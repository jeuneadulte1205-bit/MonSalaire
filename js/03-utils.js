/* ============================================================
   03-UTILS - Fonctions utilitaires
   ============================================================ */

function formatDateFr(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMoisFr(moisStr) {
    if (!moisStr) return '';
    const parts = moisStr.split('-');
    const y = parts[0], m = parts[1];
    const noms = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet',
                  'Août','Septembre','Octobre','Novembre','Décembre'];
    return noms[parseInt(m, 10) - 1] + ' ' + y;
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}

function generateId(prefix) {
    return (prefix || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculerSoldeConges(salarie) {
    if (!salarie.dateEmbauche) return { cumule: 0, pris: 0, solde: 0, moisTravailles: 0 };
    const debut = new Date(salarie.dateEmbauche);
    const now = new Date();
    const moisTravailles = Math.max(0,
        (now.getFullYear() - debut.getFullYear()) * 12 +
        (now.getMonth() - debut.getMonth()) + 1);
    const cumule = moisTravailles * (state.cpJoursMois || 2);
    const pris = (salarie.absences || [])
        .filter(a => a.type === 'conge_paye')
        .reduce((s, a) => s + (a.jours || 0), 0);
    return {
        cumule: Math.round(cumule * 10) / 10,
        pris: Math.round(pris * 10) / 10,
        solde: Math.round((cumule - pris) * 10) / 10,
        moisTravailles
    };
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 2800);
}