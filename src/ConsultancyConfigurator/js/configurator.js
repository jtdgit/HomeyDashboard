/**
 * AFAS Consultancy Configurator — Wizard Logic
 * Vanilla JS, no dependencies
 */

const Configurator = (() => {

    // ── State ──────────────────────────────────
    const state = {
        currentStep: 1,
        totalSteps: 4,
        selectedBranche: null,
        selectedOmvang: null,
        selectedThemas: []          // array of theme ids
    };

    // ── DOM refs ───────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ── Initialize ─────────────────────────────
    function init() {
        renderStep();
        updateIndicator();
        updateNavigation();
    }

    // ── Navigation ─────────────────────────────
    function nextStep() {
        if (!validateCurrentStep()) return;

        if (state.currentStep < state.totalSteps) {
            transitionStep('forward', () => {
                state.currentStep++;
                renderStep();
                updateIndicator();
                updateNavigation();
            });
        }
    }

    function prevStep() {
        if (state.currentStep > 1) {
            transitionStep('backward', () => {
                state.currentStep--;
                renderStep();
                updateIndicator();
                updateNavigation();
            });
        }
    }

    // ── Step Transition ────────────────────────
    function transitionStep(direction, callback) {
        const el = $('#stepContent');
        const exitClass = direction === 'forward' ? 'step-content--exiting' : 'step-content--entering';
        const enterClass = direction === 'forward' ? 'step-content--entering' : 'step-content--exiting';

        el.classList.add(exitClass);

        setTimeout(() => {
            callback();
            el.classList.remove(exitClass);
            el.classList.add(enterClass);

            // force reflow
            void el.offsetWidth;

            el.classList.remove(enterClass);
        }, 250);
    }

    // ── Validation ─────────────────────────────
    function validateCurrentStep() {
        let valid = true;

        switch (state.currentStep) {
            case 1:
                valid = state.selectedBranche !== null;
                break;
            case 2:
                valid = state.selectedOmvang !== null;
                break;
            case 3:
                valid = state.selectedThemas.length > 0;
                break;
            case 4:
                valid = true; // last step, always valid
                break;
        }

        const msg = $('#validationMessage');
        if (!valid) {
            msg.classList.add('validation-message--visible');
            const btn = $('#btnNext');
            btn.classList.remove('btn--shake');
            void btn.offsetWidth;
            btn.classList.add('btn--shake');
        } else {
            msg.classList.remove('validation-message--visible');
        }

        return valid;
    }

    // ── Update Step Indicator ──────────────────
    function updateIndicator() {
        $$('.step-indicator__item').forEach(item => {
            const step = parseInt(item.dataset.step);
            item.classList.remove('step-indicator__item--active', 'step-indicator__item--completed');

            if (step === state.currentStep) {
                item.classList.add('step-indicator__item--active');
            } else if (step < state.currentStep) {
                item.classList.add('step-indicator__item--completed');
                item.querySelector('.step-indicator__number').textContent = '✓';
            }
        });

        $$('.step-indicator__connector').forEach(conn => {
            const step = parseInt(conn.dataset.connector);
            conn.classList.toggle('step-indicator__connector--completed', step < state.currentStep);
        });
    }

    // ── Update Navigation Buttons ──────────────
    function updateNavigation() {
        const btnPrev = $('#btnPrev');
        const btnNext = $('#btnNext');

        // Show/hide prev
        if (state.currentStep === 1) {
            btnPrev.classList.add('btn--ghost');
        } else {
            btnPrev.classList.remove('btn--ghost');
        }

        // Last step = no next
        if (state.currentStep === state.totalSteps) {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = '';
            btnNext.disabled = false;
        }

        // Hide validation message
        $('#validationMessage').classList.remove('validation-message--visible');
    }

    // ── Render Current Step ────────────────────
    function renderStep() {
        const container = $('#stepContent');

        switch (state.currentStep) {
            case 1: renderBrancheStep(container); break;
            case 2: renderOmvangStep(container); break;
            case 3: renderThemasStep(container); break;
            case 4: renderInzetStep(container); break;
        }
    }

    // ── Step 1: Branche ────────────────────────
    function renderBrancheStep(container) {
        container.innerHTML = `
            <div class="step-header">
                <div class="step-header__subtitle">Stap 1 van 4</div>
                <h2 class="step-header__title">In welke branche is de klant actief?</h2>
            </div>
            <div class="card-grid card-grid--cols-4">
                ${ConfiguratorData.branches.map(b => `
                    <div class="option-card ${state.selectedBranche === b.id ? 'option-card--selected' : ''}"
                         onclick="Configurator.selectBranche('${b.id}')">
                        <span class="option-card__icon">${b.icoon}</span>
                        <div class="option-card__title">${b.naam}</div>
                        <div class="option-card__description">${b.beschrijving}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function selectBranche(id) {
        state.selectedBranche = id;
        renderStep();
        $('#validationMessage').classList.remove('validation-message--visible');
    }

    // ── Step 2: Omvang ─────────────────────────
    function renderOmvangStep(container) {
        container.innerHTML = `
            <div class="step-header">
                <div class="step-header__subtitle">Stap 2 van 4</div>
                <h2 class="step-header__title">Wat is de omvang van het beheer?</h2>
            </div>
            <div class="card-grid card-grid--cols-3">
                ${ConfiguratorData.omvangOpties.map(o => `
                    <div class="option-card ${state.selectedOmvang === o.id ? 'option-card--selected' : ''}"
                         onclick="Configurator.selectOmvang('${o.id}')">
                        <span class="option-card__icon">${o.icoon}</span>
                        <div class="option-card__title">${o.naam}</div>
                        <div class="option-card__description">${o.beschrijving}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function selectOmvang(id) {
        state.selectedOmvang = id;
        renderStep();
        $('#validationMessage').classList.remove('validation-message--visible');
    }

    // ── Step 3: Thema's ────────────────────────
    function renderThemasStep(container) {
        container.innerHTML = `
            <div class="step-header">
                <div class="step-header__subtitle">Stap 3 van 4</div>
                <h2 class="step-header__title">Welke thema's wil je inzetten?</h2>
            </div>
            <div class="card-grid card-grid--cols-2x4">
                ${ConfiguratorData.themas.map(t => {
                    const selected = state.selectedThemas.includes(t.id);
                    const badgeClass = t.consultantType === 'senior' ? 'option-card__badge--senior' : 'option-card__badge--consultant';
                    const badgeLabel = t.consultantType === 'senior' ? 'Senior' : 'Consultant';
                    return `
                        <div class="option-card ${selected ? 'option-card--selected' : ''}"
                             onclick="Configurator.toggleThema(${t.id})">
                            <span class="option-card__check">${selected ? '✓' : ''}</span>
                            <span class="option-card__icon">${t.icoon}</span>
                            <div class="option-card__title">${t.naam}</div>
                            <div class="option-card__description">${t.beschrijving}</div>
                            <span class="option-card__badge ${badgeClass}">${badgeLabel}</span>
                            <div class="option-card__days">${t.basisDagen} dagen basis</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function toggleThema(id) {
        const idx = state.selectedThemas.indexOf(id);
        if (idx > -1) {
            state.selectedThemas.splice(idx, 1);
        } else {
            state.selectedThemas.push(id);
        }
        renderStep();
        $('#validationMessage').classList.remove('validation-message--visible');
    }

    // ── Step 4: Inzet van consultancy ──────────
    function renderInzetStep(container) {
        const branche = ConfiguratorData.branches.find(b => b.id === state.selectedBranche);
        const omvang = ConfiguratorData.omvangOpties.find(o => o.id === state.selectedOmvang);
        const selectedThemas = ConfiguratorData.themas.filter(t => state.selectedThemas.includes(t.id));

        let totaalDagen = 0;
        let totaalConsultant = 0;
        let totaalSenior = 0;

        const regels = selectedThemas.map(t => {
            const dagen = ConfiguratorData.berekenDagen(t, branche.factor, omvang.factor);
            const type = t.consultantType;
            totaalDagen += dagen;
            if (type === 'senior') totaalSenior += dagen;
            else totaalConsultant += dagen;

            return { thema: t, dagen, type };
        });

        container.innerHTML = `
            <div class="step-header">
                <div class="step-header__subtitle">Stap 4 van 4</div>
                <h2 class="step-header__title">Inzet van consultancy</h2>
            </div>

            <div class="inzet-overview">
                <table class="inzet-table">
                    <thead>
                        <tr>
                            <th>Thema</th>
                            <th>Type</th>
                            <th>Dagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${regels.map(r => `
                            <tr>
                                <td>
                                    <span style="margin-right:8px">${r.thema.icoon}</span>
                                    ${r.thema.naam}
                                </td>
                                <td>
                                    <span class="inzet-table__type inzet-table__type--${r.type}">
                                        ${r.type === 'senior' ? 'Senior' : 'Consultant'}
                                    </span>
                                </td>
                                <td>${formatDagen(r.dagen)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2">Totaal inzet</td>
                            <td>${formatDagen(totaalDagen)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="inzet-summary">
                <div class="inzet-summary-card">
                    <div class="inzet-summary-card__value">${formatDagen(totaalDagen)}</div>
                    <div class="inzet-summary-card__label">Totaal dagen</div>
                </div>
                <div class="inzet-summary-card inzet-summary-card--accent">
                    <div class="inzet-summary-card__value">${formatDagen(totaalConsultant)}</div>
                    <div class="inzet-summary-card__label">Consultant dagen</div>
                </div>
                <div class="inzet-summary-card inzet-summary-card--green">
                    <div class="inzet-summary-card__value">${formatDagen(totaalSenior)}</div>
                    <div class="inzet-summary-card__label">Senior dagen</div>
                </div>
            </div>

            <div style="text-align:center; margin-top:var(--space-lg); color:var(--afas-dark-gray); font-size:0.85rem;">
                ${branche.naam} · ${omvang.naam} beheer · ${selectedThemas.length} thema's geselecteerd
            </div>
        `;
    }

    // ── Helpers ────────────────────────────────
    function formatDagen(n) {
        // show 1 decimal only when half-days exist
        return n % 1 === 0 ? n.toString() : n.toFixed(1);
    }

    // ── Boot ───────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    // ── Public API ─────────────────────────────
    return {
        nextStep,
        prevStep,
        selectBranche,
        selectOmvang,
        toggleThema
    };

})();
