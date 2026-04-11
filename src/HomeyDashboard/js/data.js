const HomeyData = {
  house: {
    name: "Huize De Vries",
    location: "Amsterdam",
    weather: {
      temp: 8,
      condition: "Bewolkt",
      icon: "cloud",
      humidity: 78,
      wind: 14
    }
  },

  energy: {
    current: {
      power: 1847,
      solar: 1240,
      grid: 607,
      gasRate: 0.3
    },
    today: {
      consumed: 12.4,
      produced: 8.2,
      gas: 2.1,
      cost: 3.42
    },
    month: {
      consumed: 286,
      produced: 194,
      gas: 48,
      cost: 78.50
    },
    hourly: [
      820, 640, 580, 520, 490, 510, 890, 1420,
      1680, 1520, 1340, 1180, 1240, 1380, 1120, 980,
      1450, 2100, 2340, 1980, 1640, 1420, 1180, 920
    ],
    solarHourly: [
      0, 0, 0, 0, 0, 0, 20, 180,
      520, 890, 1120, 1340, 1420, 1380, 1240, 980,
      640, 280, 60, 0, 0, 0, 0, 0
    ]
  },

  alarm: {
    status: "thuis",
    zones: [
      { id: 1, name: "Voordeur", type: "door", icon: "door_front", status: "Dicht", ok: true, battery: 92 },
      { id: 2, name: "Achterdeur", type: "door", icon: "door_back", status: "Dicht", ok: true, battery: 87 },
      { id: 3, name: "Woonkamer", type: "motion", icon: "motion_sensor_active", status: "Geen beweging", ok: true, battery: 95 },
      { id: 4, name: "Slaapkamerraam", type: "window", icon: "sensor_window", status: "Dicht", ok: true, battery: 24 },
      { id: 5, name: "Garage", type: "door", icon: "garage", status: "Dicht", ok: true, battery: 88 },
      { id: 6, name: "Tuin", type: "motion", icon: "yard", status: "Geen beweging", ok: true, battery: 81 }
    ],
    history: [
      { time: "14:32", event: "Voordeur geopend", severity: "info" },
      { time: "14:33", event: "Voordeur gesloten", severity: "info" },
      { time: "12:15", event: "Beweging gedetecteerd — Tuin", severity: "warning" },
      { time: "08:45", event: "Alarm uitgeschakeld", severity: "info" },
      { time: "23:02", event: "Alarm ingeschakeld (thuis)", severity: "success" }
    ]
  },

  devices: [
    { id: 1, name: "Woonkamer", type: "light", icon: "lightbulb", on: true, dimmable: true, brightness: 80, room: "Woonkamer", energy: 8.4 },
    { id: 2, name: "Keuken", type: "light", icon: "lightbulb", on: false, dimmable: true, brightness: 0, room: "Keuken", energy: 0 },
    { id: 3, name: "Slaapkamer", type: "light", icon: "bedroom_parent", on: false, dimmable: true, brightness: 0, room: "Slaapkamer", energy: 0 },
    { id: 4, name: "Buitenlamp", type: "light", icon: "light", on: true, dimmable: false, brightness: 100, room: "Tuin", energy: 12 },
    { id: 5, name: "TV Stekker", type: "plug", icon: "power", on: true, dimmable: false, brightness: null, room: "Woonkamer", energy: 85 },
    { id: 6, name: "Wasmachine", type: "plug", icon: "local_laundry_service", on: false, dimmable: false, brightness: null, room: "Bijkeuken", energy: 0 },
    { id: 7, name: "Sonos", type: "speaker", icon: "speaker", on: true, dimmable: false, brightness: null, room: "Woonkamer", energy: 6 },
    { id: 8, name: "Vaatwasser", type: "plug", icon: "dishwasher", on: true, dimmable: false, brightness: null, room: "Keuken", energy: 1200 },
    { id: 9, name: "Garagedeur", type: "cover", icon: "garage", on: false, dimmable: false, brightness: null, room: "Garage", energy: 0 },
    { id: 10, name: "Ventilator", type: "fan", icon: "mode_fan", on: false, dimmable: false, brightness: null, room: "Slaapkamer", energy: 0 }
  ],

  climate: {
    indoor: { temperature: 20.5, humidity: 55, co2: 620 },
    outdoor: { temperature: 8, humidity: 78, pressure: 1013 },
    thermostat: {
      target: 20.5,
      mode: "auto",
      heating: true,
      schedule: [
        { time: "06:00", temp: 20.0 },
        { time: "08:30", temp: 18.0 },
        { time: "17:00", temp: 20.5 },
        { time: "23:00", temp: 16.0 }
      ]
    },
    history: [
      20.1, 20.0, 19.8, 19.5, 18.2, 17.8, 16.5, 16.2,
      16.0, 16.0, 16.0, 16.2, 17.5, 18.8, 19.5, 20.0,
      20.2, 20.5, 20.5, 20.5, 20.3, 20.5, 20.4, 20.5
    ]
  },

  flows: [
    { id: 1, name: "Goedemorgen", icon: "wb_sunny", active: true, trigger: "Elke dag 07:00", condition: "Werkdag", action: "Lampen aan, verwarming 20°C", lastRun: "Vandaag 07:00", runs: 142 },
    { id: 2, name: "Welterusten", icon: "bedtime", active: true, trigger: "Elke dag 23:00", condition: "—", action: "Alles uit, alarm aan", lastRun: "Gisteren 23:00", runs: 138 },
    { id: 3, name: "Niemand thuis", icon: "home_off", active: true, trigger: "Iedereen weg", condition: "Alle telefoons weg", action: "Verwarming 16°C, lampen uit", lastRun: "Vandaag 08:45", runs: 87 },
    { id: 4, name: "Beweging tuin", icon: "motion_sensor_alert", active: true, trigger: "Bewegingssensor tuin", condition: "Na zonsondergang", action: "Buitenlamp 5 min aan", lastRun: "Vandaag 12:15", runs: 2304 },
    { id: 5, name: "TV Tijd", icon: "tv", active: false, trigger: "TV aangezet", condition: "Na 18:00", action: "Woonkamer dimmen 40%", lastRun: "Gisteren 20:14", runs: 56 },
    { id: 6, name: "Wasmachine klaar", icon: "notifications_active", active: true, trigger: "Stekker < 5W", condition: "Was bezig geweest", action: "Notificatie sturen", lastRun: "Gisteren 14:22", runs: 34 }
  ],

  notifications: [
    { id: 1, time: "14:35", date: "Vandaag", message: "Energieverbruik hoger dan gemiddeld", severity: "warning", icon: "bolt", read: false },
    { id: 2, time: "14:32", date: "Vandaag", message: "Voordeur geopend en gesloten", severity: "info", icon: "door_front", read: false },
    { id: 3, time: "12:15", date: "Vandaag", message: "Beweging gedetecteerd in de tuin", severity: "warning", icon: "motion_sensor_alert", read: true },
    { id: 4, time: "08:45", date: "Vandaag", message: "Flow 'Niemand thuis' uitgevoerd", severity: "info", icon: "play_circle", read: true },
    { id: 5, time: "07:00", date: "Vandaag", message: "Flow 'Goedemorgen' uitgevoerd", severity: "success", icon: "wb_sunny", read: true },
    { id: 6, time: "23:00", date: "Gisteren", message: "Alarm ingeschakeld — thuismodus", severity: "success", icon: "shield", read: true },
    { id: 7, time: "20:14", date: "Gisteren", message: "Flow 'TV Tijd' uitgevoerd", severity: "info", icon: "tv", read: true },
    { id: 8, time: "14:22", date: "Gisteren", message: "Wasmachine is klaar!", severity: "info", icon: "local_laundry_service", read: true },
    { id: 9, time: "09:30", date: "Gisteren", message: "Software update beschikbaar voor Homey", severity: "info", icon: "system_update", read: true },
    { id: 10, time: "03:12", date: "Gisteren", message: "Slaapkamerraam sensor — batterij laag (24%)", severity: "warning", icon: "battery_alert", read: true }
  ]
};
