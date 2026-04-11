// ===== DASHBOARD INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  renderClock();
  renderEnergy();
  renderClimate();
  renderAlarm();
  renderDevices();
  renderFlows();
  renderNotifications();
  setInterval(renderClock, 10000);
});

// ===== CLOCK =====
function renderClock() {
  const el = document.getElementById('clock');
  const now = new Date();
  el.textContent = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

// ===== ENERGY MODULE =====
function renderEnergy() {
  const d = HomeyData.energy;

  // Stats
  const statsEl = document.getElementById('energy-stats');
  statsEl.innerHTML = `
    <div class="energy-stat">
      <div class="energy-stat__value">${formatNumber(d.current.power)} W</div>
      <div class="energy-stat__label">Huidig verbruik</div>
    </div>
    <div class="energy-stat">
      <div class="energy-stat__value energy-stat__value--solar">${formatNumber(d.current.solar)} W</div>
      <div class="energy-stat__label">Zonne-energie</div>
    </div>
    <div class="energy-stat">
      <div class="energy-stat__value energy-stat__value--grid">${d.today.consumed} kWh</div>
      <div class="energy-stat__label">Vandaag verbruikt</div>
    </div>
    <div class="energy-stat">
      <div class="energy-stat__value energy-stat__value--cost">&euro;${d.today.cost.toFixed(2)}</div>
      <div class="energy-stat__label">Kosten vandaag</div>
    </div>
  `;

  // Chart
  renderEnergyChart('energy-chart', d.hourly, d.solarHourly);
}

function renderEnergyChart(containerId, usageData, solarData) {
  const container = document.getElementById(containerId);
  const width = container.offsetWidth || 600;
  const height = 140;
  const pad = { top: 10, right: 10, bottom: 24, left: 44 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const allValues = [...usageData, ...solarData];
  const maxVal = Math.max(...allValues) * 1.1;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', height);
  svg.style.display = 'block';

  // Defs: gradients
  const defs = document.createElementNS(svgNS, 'defs');

  defs.appendChild(createGradient(svgNS, 'grad-usage', '#10b981', 0.25, 0.02));
  defs.appendChild(createGradient(svgNS, 'grad-solar', '#fbbf24', 0.2, 0.02));
  svg.appendChild(defs);

  // Grid lines + labels
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = pad.top + (ch / gridSteps) * i;
    const val = Math.round(maxVal - (maxVal / gridSteps) * i);

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', pad.left);
    line.setAttribute('x2', width - pad.right);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.05)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', pad.left - 6);
    label.setAttribute('y', y + 3);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', '#4a5a78');
    label.setAttribute('font-size', '9');
    label.setAttribute('font-family', 'Space Mono, monospace');
    label.textContent = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val;
    svg.appendChild(label);
  }

  // Time labels
  for (let i = 0; i < 24; i += 6) {
    const x = pad.left + (i / 23) * cw;
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', height - 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#4a5a78');
    label.setAttribute('font-size', '9');
    label.setAttribute('font-family', 'Space Mono, monospace');
    label.textContent = `${String(i).padStart(2, '0')}:00`;
    svg.appendChild(label);
  }

  // Draw areas
  svg.appendChild(createArea(svgNS, usageData, maxVal, pad, cw, ch, 'url(#grad-usage)', '#10b981'));
  svg.appendChild(createArea(svgNS, solarData, maxVal, pad, cw, ch, 'url(#grad-solar)', '#fbbf24'));

  // Draw lines
  svg.appendChild(createLine(svgNS, usageData, maxVal, pad, cw, ch, '#10b981'));
  svg.appendChild(createLine(svgNS, solarData, maxVal, pad, cw, ch, '#fbbf24'));

  // Current time indicator
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;
  const nowX = pad.left + (nowHour / 23) * cw;
  const nowLine = document.createElementNS(svgNS, 'line');
  nowLine.setAttribute('x1', nowX);
  nowLine.setAttribute('x2', nowX);
  nowLine.setAttribute('y1', pad.top);
  nowLine.setAttribute('y2', pad.top + ch);
  nowLine.setAttribute('stroke', 'rgba(255,255,255,0.2)');
  nowLine.setAttribute('stroke-width', '1');
  nowLine.setAttribute('stroke-dasharray', '4,3');
  svg.appendChild(nowLine);

  container.innerHTML = '';
  container.appendChild(svg);
}

function createGradient(ns, id, color, topOpacity, bottomOpacity) {
  const g = document.createElementNS(ns, 'linearGradient');
  g.setAttribute('id', id);
  g.setAttribute('x1', '0'); g.setAttribute('y1', '0');
  g.setAttribute('x2', '0'); g.setAttribute('y2', '1');
  const s1 = document.createElementNS(ns, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', color); s1.setAttribute('stop-opacity', topOpacity);
  const s2 = document.createElementNS(ns, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', color); s2.setAttribute('stop-opacity', bottomOpacity);
  g.appendChild(s1); g.appendChild(s2);
  return g;
}

function createArea(ns, data, maxVal, pad, cw, ch, fill, _color) {
  const pts = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * cw,
    y: pad.top + (1 - v / maxVal) * ch
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = d + ` L${pts[pts.length - 1].x},${pad.top + ch} L${pts[0].x},${pad.top + ch} Z`;
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', areaD);
  path.setAttribute('fill', fill);
  return path;
}

function createLine(ns, data, maxVal, pad, cw, ch, color) {
  const pts = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * cw,
    y: pad.top + (1 - v / maxVal) * ch
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linejoin', 'round');
  return path;
}

// ===== CLIMATE MODULE =====
function renderClimate() {
  const d = HomeyData.climate;
  renderTemperatureGauge('climate-gauge', d.indoor.temperature, d.thermostat.target);
  renderClimateControls('climate-controls', d.thermostat.target);
  renderClimateStats('climate-stats', d);
}

function renderTemperatureGauge(containerId, current, _target) {
  const container = document.getElementById(containerId);
  const size = 150;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const minTemp = 10;
  const maxTemp = 30;
  const normalized = (current - minTemp) / (maxTemp - minTemp);
  const arcFraction = 0.75;
  const dashLen = circumference * arcFraction * normalized;
  const gapLen = circumference - dashLen;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);

  const cx = size / 2;
  const cy = size / 2;

  // Background arc
  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('cx', cx);
  bgCircle.setAttribute('cy', cy);
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', 'rgba(255,255,255,0.06)');
  bgCircle.setAttribute('stroke-width', stroke);
  bgCircle.setAttribute('stroke-dasharray', `${circumference * arcFraction} ${circumference * (1 - arcFraction)}`);
  bgCircle.setAttribute('stroke-linecap', 'round');
  bgCircle.setAttribute('transform', `rotate(135 ${cx} ${cy})`);
  svg.appendChild(bgCircle);

  // Value arc
  const valCircle = document.createElementNS(svgNS, 'circle');
  valCircle.setAttribute('cx', cx);
  valCircle.setAttribute('cy', cy);
  valCircle.setAttribute('r', radius);
  valCircle.setAttribute('fill', 'none');
  valCircle.setAttribute('stroke', '#38bdf8');
  valCircle.setAttribute('stroke-width', stroke);
  valCircle.setAttribute('stroke-dasharray', `${dashLen} ${gapLen}`);
  valCircle.setAttribute('stroke-linecap', 'round');
  valCircle.setAttribute('transform', `rotate(135 ${cx} ${cy})`);
  valCircle.style.filter = 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))';
  svg.appendChild(valCircle);

  // Center text
  const tempText = document.createElementNS(svgNS, 'text');
  tempText.setAttribute('x', cx);
  tempText.setAttribute('y', cy - 4);
  tempText.setAttribute('text-anchor', 'middle');
  tempText.setAttribute('fill', '#e8edf5');
  tempText.setAttribute('font-family', 'Space Mono, monospace');
  tempText.setAttribute('font-size', '28');
  tempText.setAttribute('font-weight', '700');
  tempText.textContent = current.toFixed(1) + '°';
  svg.appendChild(tempText);

  const labelText = document.createElementNS(svgNS, 'text');
  labelText.setAttribute('x', cx);
  labelText.setAttribute('y', cy + 18);
  labelText.setAttribute('text-anchor', 'middle');
  labelText.setAttribute('fill', '#4a5a78');
  labelText.setAttribute('font-family', 'DM Sans, sans-serif');
  labelText.setAttribute('font-size', '11');
  labelText.textContent = 'Binnentemperatuur';
  svg.appendChild(labelText);

  container.innerHTML = '';
  container.appendChild(svg);
}

function renderClimateControls(containerId, target) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <button class="climate-btn" id="temp-down">−</button>
    <div class="climate-target">
      <div class="climate-target__value" id="target-temp">${target.toFixed(1)}°C</div>
      <div class="climate-target__label">Doeltemperatuur</div>
    </div>
    <button class="climate-btn" id="temp-up">+</button>
  `;

  document.getElementById('temp-down').addEventListener('click', () => {
    HomeyData.climate.thermostat.target = Math.max(10, HomeyData.climate.thermostat.target - 0.5);
    document.getElementById('target-temp').textContent = HomeyData.climate.thermostat.target.toFixed(1) + '°C';
  });

  document.getElementById('temp-up').addEventListener('click', () => {
    HomeyData.climate.thermostat.target = Math.min(30, HomeyData.climate.thermostat.target + 0.5);
    document.getElementById('target-temp').textContent = HomeyData.climate.thermostat.target.toFixed(1) + '°C';
  });
}

function renderClimateStats(containerId, d) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="climate-stat">
      <div class="climate-stat__value">${d.outdoor.temperature}°C</div>
      <div class="climate-stat__label">Buiten</div>
    </div>
    <div class="climate-stat">
      <div class="climate-stat__value">${d.indoor.humidity}%</div>
      <div class="climate-stat__label">Luchtvocht.</div>
    </div>
    <div class="climate-stat">
      <div class="climate-stat__value">${d.indoor.co2}</div>
      <div class="climate-stat__label">CO₂ ppm</div>
    </div>
  `;
}

// ===== ALARM MODULE =====
function renderAlarm() {
  const d = HomeyData.alarm;
  renderAlarmModes('alarm-modes', d.status);
  renderAlarmZones('alarm-zones', d.zones);
  renderAlarmHistory('alarm-history', d.history);
}

function renderAlarmModes(containerId, current) {
  const container = document.getElementById(containerId);
  const modes = [
    { id: 'uit', icon: 'lock_open', label: 'Uit' },
    { id: 'thuis', icon: 'home', label: 'Thuis' },
    { id: 'afwezig', icon: 'lock', label: 'Afwezig' }
  ];
  container.innerHTML = modes.map(m => `
    <button class="alarm-mode ${current === m.id ? 'alarm-mode--active' : ''} ${m.id === 'uit' && current === 'uit' ? 'alarm-mode--safe' : ''}"
            data-mode="${m.id}">
      <span class="material-symbols-outlined">${m.icon}</span>
      ${m.label}
    </button>
  `).join('');

  container.querySelectorAll('.alarm-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      HomeyData.alarm.status = btn.dataset.mode;
      renderAlarmModes(containerId, btn.dataset.mode);
    });
  });
}

function renderAlarmZones(containerId, zones) {
  const container = document.getElementById(containerId);
  container.innerHTML = zones.map(z => {
    const lowBattery = z.battery < 30;
    return `
      <div class="alarm-zone">
        <span class="material-symbols-outlined alarm-zone__icon ${!z.ok ? 'alarm-zone__icon--warning' : ''}">${z.icon}</span>
        <span class="alarm-zone__name">${z.name}</span>
        <span class="alarm-zone__status">${z.status}</span>
        <span class="alarm-zone__battery ${lowBattery ? 'alarm-zone__battery--low' : ''}">
          <span class="material-symbols-outlined">${lowBattery ? 'battery_alert' : 'battery_full'}</span>
          ${z.battery}%
        </span>
      </div>
    `;
  }).join('');
}

function renderAlarmHistory(containerId, history) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="alarm-history__title">Recente activiteit</div>
    ${history.map(e => `
      <div class="alarm-event">
        <span class="alarm-event__dot alarm-event__dot--${e.severity}"></span>
        <span class="alarm-event__time">${e.time}</span>
        <span class="alarm-event__text">${e.event}</span>
      </div>
    `).join('')}
  `;
}

// ===== DEVICES MODULE =====
function renderDevices() {
  const devices = HomeyData.devices;
  const onCount = devices.filter(d => d.on).length;
  document.getElementById('devices-count').textContent = `${onCount}/${devices.length} aan`;
  renderDeviceGrid('devices-grid', devices);
}

function renderDeviceGrid(containerId, devices) {
  const container = document.getElementById(containerId);
  container.innerHTML = devices.map(d => `
    <div class="device ${d.on ? 'device--on' : ''}" data-id="${d.id}">
      <div class="device__top">
        <span class="material-symbols-outlined device__icon">${d.icon}</span>
        <div class="toggle ${d.on ? 'toggle--on' : ''}" data-device-id="${d.id}">
          <div class="toggle__thumb"></div>
        </div>
      </div>
      <div class="device__name">${d.name}</div>
      <div class="device__room">${d.room}</div>
      ${d.on && d.energy > 0 ? `<div class="device__power">${d.energy >= 1000 ? (d.energy / 1000).toFixed(1) + ' kW' : d.energy + ' W'}</div>` : ''}
      ${d.on && d.dimmable ? `<input type="range" class="dimmer" min="1" max="100" value="${d.brightness}" data-device-id="${d.id}">` : ''}
    </div>
  `).join('');

  // Toggle handlers
  container.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const id = parseInt(toggle.dataset.deviceId);
      const device = HomeyData.devices.find(d => d.id === id);
      device.on = !device.on;
      if (!device.on && device.dimmable) device.brightness = 0;
      if (device.on && device.dimmable && device.brightness === 0) device.brightness = 80;
      renderDevices();
    });
  });

  // Dimmer handlers
  container.querySelectorAll('.dimmer').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const id = parseInt(slider.dataset.deviceId);
      const device = HomeyData.devices.find(d => d.id === id);
      device.brightness = parseInt(e.target.value);
    });
  });
}

// ===== FLOWS MODULE =====
function renderFlows() {
  const flows = HomeyData.flows;
  const container = document.getElementById('flows-list');
  container.innerHTML = flows.map(f => `
    <div class="flow ${!f.active ? 'flow--inactive' : ''}" data-id="${f.id}">
      <div class="flow__icon-wrap">
        <span class="material-symbols-outlined">${f.icon}</span>
      </div>
      <div class="flow__info">
        <div class="flow__name">${f.name}</div>
        <div class="flow__detail">${f.trigger} → ${f.action}</div>
      </div>
      <div class="flow__meta">
        <span class="flow__runs">${formatNumber(f.runs)}x</span>
        <span class="flow__last">${f.lastRun}</span>
      </div>
      <div class="toggle ${f.active ? 'toggle--on' : ''}" style="--toggle-color: var(--color-flows)" data-flow-id="${f.id}">
        <div class="toggle__thumb"></div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const id = parseInt(toggle.dataset.flowId);
      const flow = HomeyData.flows.find(f => f.id === id);
      flow.active = !flow.active;
      renderFlows();
    });
  });
}

// ===== NOTIFICATIONS MODULE =====
function renderNotifications() {
  const notifs = HomeyData.notifications;
  const unread = notifs.filter(n => !n.read).length;

  const countEl = document.getElementById('notif-count');
  countEl.textContent = unread > 0 ? unread : '';
  countEl.style.display = unread > 0 ? 'inline-flex' : 'none';

  const container = document.getElementById('notif-list');
  let currentDate = '';
  let html = '';

  for (const n of notifs) {
    if (n.date !== currentDate) {
      currentDate = n.date;
      html += `<div class="notif__date-separator">${currentDate}</div>`;
    }
    html += `
      <div class="notif ${!n.read ? 'notif--unread' : ''}">
        <div class="notif__icon-wrap notif__icon-wrap--${n.severity}">
          <span class="material-symbols-outlined">${n.icon}</span>
        </div>
        <div class="notif__content">
          <div class="notif__message">${n.message}</div>
          <div class="notif__time">${n.time}</div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ===== HELPERS =====
function formatNumber(n) {
  return n.toLocaleString('nl-NL');
}
