/* ============================================================
   19-INIT - Initialisation de l'app
   ============================================================ */

function initEventListeners() {
    document.addEventListener('click', function(e) {
        const tab = e.target.closest('.nav-tab');
        if (tab && tab.dataset.tab) switchTab(tab.dataset.tab);
        const subTab = e.target.closest('.sub-tab');
        if (subTab && subTab.dataset.subtab) {
            const parent = subTab.closest('.tab-panel');
            if (parent) {
                parent.querySelectorAll('.sub-tab').forEach(s => s.classList.remove('active'));
                subTab.classList.add('active');
                parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
                const subPanel = document.getElementById('sub-' + subTab.dataset.subtab);
                if (subPanel) subPanel.classList.add('active');
            }
        }
        const tpl = e.target.closest('.template-card');
        if (tpl && tpl.dataset.template) selectTemplate(tpl.dataset.template);
        const aideBtn = e.target.closest('.aide-nav-btn');
        if (aideBtn && aideBtn.dataset.aide) showAideSection(aideBtn.dataset.aide);
    });

    const studioFields = ['colorPrimary', 'colorSecondary', 'stEntreprise', 'stAdresse', 'stContact',
        'stNif', 'stCnss', 'stSalarie', 'stMatricule', 'stFonction', 'stPeriode', 'stDatePaiement',
        'stSignature', 'stSignatureEmp', 'stFooter', 'stShowLogo', 'stShowPrimes', 'stShowAbsences',
        'stShowMentions', 'stShowSignature', 'stShowEmp', 'stShowNif', 'stShowMatricule',
        'stShowDatePaiement', 'stShowConges', 'stShowYtd', 'pTransport', 'pLogement', 'pAnciennete',
        'pHeuresSup', 'pYtdBrut', 'pYtdNet'];
    studioFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
    });

    const logoInput = document.getElementById('logoInput');
    if (logoInput) logoInput.addEventListener('change', handleLogoUpload);

    const searchSalary = document.getElementById('searchSalary');
    if (searchSalary) searchSalary.addEventListener('input', renderSalaries);

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.addEventListener('input', performGlobalSearch);

    const setupPin1 = document.getElementById('setupPin1');
    if (setupPin1) setupPin1.addEventListener('input', function () {
        const v = this.value;
        const el = document.getElementById('pinStrength');
        if (!el) return;
        el.classList.remove('weak', 'medium', 'strong');
        if (v.length === 0) return;
        if (['123456', '000000', '111111', '654321', '012345'].includes(v)) el.classList.add('weak');
        else if (v.length < 6) el.classList.add('weak');
        else if (/^(\d)\1{5}$/.test(v)) el.classList.add('weak');
        else if (v.length === 6) el.classList.add('strong');
    });

    const absMois = document.getElementById('absMois');
    if (absMois) absMois.addEventListener('change', renderAbsenceModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
        }
    });

    ['click', 'keydown', 'mousemove', 'touchstart', 'input', 'change'].forEach(function(evt) {
        document.addEventListener(evt, resetActivity, true);
    });
}

function calculerBrutNet() {
    const brut = parseFloat(document.getElementById('brutInput').value);
    if (isNaN(brut) || brut <= 0) { alert('Brut valide ?'); return; }
    const result = calculerBrutToNet(brut);
    if (!result) return;
    afficherResultat('bn', result, 'brutToNet');
    state.lastResult = result; state.lastMode = 'brutToNet'; state.lastInput = brut;
    saveState();
    ajouterHistorique(result, 'brutToNet', brut);
    updatePreview();
}

function calculerNetBrut() {
    const net = parseFloat(document.getElementById('netInput').value);
    if (isNaN(net) || net <= 0) { alert('Net valide ?'); return; }
    const result = calculerNetToBrut(net);
    if (!result) { alert('Erreur.'); return; }
    afficherResultat('nb', result, 'netToBrut');
    state.lastResult = result; state.lastMode = 'netToBrut'; state.lastInput = net;
    saveState();
    ajouterHistorique(result, 'netToBrut', net);
    updatePreview();
}

function afficherResultat(prefix, result, mode) {
    const brut = result.brut, baseImposable = result.baseImposable;
    const cnss = result.cnss, its = result.its, itsResult = result.itsResult, net = result.net;
    const mainVal = mode === 'brutToNet' ? net : brut;
    document.getElementById(mode === 'brutToNet' ? 'bnNet' : 'nbNet').textContent = mainVal.toLocaleString('fr-FR') + ' FCFA';
    document.getElementById(prefix + 'Base').textContent = baseImposable.toLocaleString('fr-FR') + ' F';
    document.getElementById(prefix + 'Cnss').textContent = cnss.toLocaleString('fr-FR') + ' F';
    document.getElementById(prefix + 'Its').textContent = its.toLocaleString('fr-FR') + ' F';
    document.getElementById(prefix + 'Total').textContent = (cnss + its).toLocaleString('fr-FR') + ' F';
    let detail = 'Tranche ' + getBracketDescription(itsResult.bracketIndex) + '. ';
    if (itsResult.bracketIndex !== -1) {
        const b = state.itsBrackets[itsResult.bracketIndex];
        detail += 'Calcul : (' + baseImposable.toLocaleString() + ' - ' + b.min.toLocaleString() + ') × ' + (b.rate * 100) + '% + ' + b.cumul.toLocaleString() + ' = ' + its.toLocaleString() + ' F';
    }
    document.getElementById(prefix + 'Detail').textContent = detail;
}

function injectViews() {
    // Injecter les onglets de navigation
    const navTabs = document.getElementById('navTabs');
    if (navTabs && typeof NAV_TABS_HTML !== 'undefined') navTabs.innerHTML = NAV_TABS_HTML;

    // Injecter le contenu des onglets
    const contentContainer = document.getElementById('contentContainer');
    if (contentContainer && typeof VIEWS_HTML !== 'undefined') contentContainer.innerHTML = VIEWS_HTML;

    // Injecter les modals
    const modalsContainer = document.getElementById('modalsContainer');
    if (modalsContainer && typeof MODALS_HTML !== 'undefined') modalsContainer.innerHTML = MODALS_HTML;
}

function init() {
    injectViews();
    loadState();
    initTheme();
    initEventListeners();
    initAbsenceAutoCalc();
    checkPinSetup();
    updateEntrepriseName();
    chargerParams();
    mettreAJourDashboard();
    mettreAJourActivite();
    renderSalaries();
    renderArchives();
    loadTemplateToUI();
    updatePreview();
    if (state.lastResult) {
        const r = state.lastResult;
        if (state.lastMode === 'brutToNet') {
            document.getElementById('brutInput').value = state.lastInput || r.brut;
            afficherResultat('bn', r, 'brutToNet');
        } else {
            document.getElementById('netInput').value = state.lastInput || r.net;
            afficherResultat('nb', r, 'netToBrut');
        }
    } else if (document.getElementById('brutInput')) {
        calculerBrutNet();
    }
    const sd = document.getElementById('sessionDuration');
    if (sd) sd.textContent = (state.sessionDuration || 30) + ' min';
    console.log('✅ Mon Salaire v7.0 chargé');
}

window.addEventListener('DOMContentLoaded', init);