/* ============================================================
   04-STORAGE - localStorage + migration
   ============================================================ */

const STORAGE_KEY = 'monSalaireStateV7';
const STORAGE_KEY_OLD = 'monSalaireState';
const STORAGE_KEY_OLD_V6 = 'monSalaireStateV6';
const STORAGE_KEY_PIN = 'monSalairePinHash';

function loadState() {
    try {
        // Essayer les clés dans l'ordre (V7 → V6 → old)
        let saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) saved = localStorage.getItem(STORAGE_KEY_OLD_V6);
        if (!saved) saved = localStorage.getItem(STORAGE_KEY_OLD);

        if (saved) {
            const parsed = JSON.parse(saved);
            state = Object.assign({}, state, parsed);

            if (!state.itsBrackets || !state.itsBrackets.length) {
                state.itsBrackets = JSON.parse(JSON.stringify(DEFAULT_ITS));
            }
            if (!Array.isArray(state.entreprises)) state.entreprises = [];
            if (!state.template) state.template = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
            if (!state.sessionDuration) state.sessionDuration = 30;
            if (!state.cpJoursMois) state.cpJoursMois = 2;
            if (!state.joursOuvrables) state.joursOuvrables = 30;

            // Migration ancienne structure v5 (state.salaries direct)
            if (parsed.salaries && parsed.salaries.length > 0 && state.entreprises.length === 0) {
                const ent = {
                    id: generateId('ent'),
                    nom: 'Entreprise migrée',
                    adresse: parsed.template && parsed.template.adresse ? parsed.template.adresse : 'Cotonou, Bénin',
                    nif: '',
                    cnss: '',
                    salaries: parsed.salaries || [],
                    archives: parsed.archives || [],
                    createdAt: new Date().toISOString()
                };
                state.entreprises.push(ent);
                state.entrepriseActiveId = ent.id;
            }
        }

        auth.pinHash = localStorage.getItem(STORAGE_KEY_PIN);

        if (state.darkMode) document.body.classList.add('dark-mode');
    } catch (e) {
        console.warn('Erreur loadState:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Erreur saveState:', e);
    }
}