/* ============================================================
   02-STATE - État global + helpers entreprise
   ============================================================ */

let state = {
    entreprises: [],
    entrepriseActiveId: null,
    cnssRate: 3.6,
    cnssCeil: 0,
    itsBrackets: JSON.parse(JSON.stringify(DEFAULT_ITS)),
    history: [],
    pdfCount: 0,
    lastResult: null,
    lastMode: 'brutToNet',
    lastInput: 785269,
    template: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE)),
    sessionDuration: 30,
    cpJoursMois: 2,
    joursOuvrables: 30,
    darkMode: false
};

let auth = {
    pinHash: null,
    unlocked: false,
    lastActivity: null,
    timerInterval: null,
    inputBuffer: ''
};

let registreCache = { salaries: [], mois: '', totaux: null };

/* ----- Helpers entreprise active ----- */
function getEntrepriseActive() {
    if (!state.entrepriseActiveId) return null;
    return state.entreprises.find(e => e.id === state.entrepriseActiveId) || null;
}

function getSalaries() {
    const ent = getEntrepriseActive();
    return ent ? (ent.salaries || []) : [];
}

function setSalaries(arr) {
    const ent = getEntrepriseActive();
    if (ent) { ent.salaries = arr; saveState(); }
}

function getArchives() {
    const ent = getEntrepriseActive();
    return ent ? (ent.archives || []) : [];
}

function setArchives(arr) {
    const ent = getEntrepriseActive();
    if (ent) { ent.archives = arr; saveState(); }
}