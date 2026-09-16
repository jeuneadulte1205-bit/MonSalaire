/* ============================================================
   18-NAVIGATION - Switch onglets + recherche globale + refresh
   ============================================================ */

function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + tabId);
    if (panel) panel.classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector('.nav-tab[data-tab="' + tabId + '"]');
    if (tab) tab.classList.add('active');
    if (tabId === 'params') chargerParams();
    if (tabId === 'fiche') updatePreview();
    if (tabId === 'dashboard') { mettreAJourDashboard(); mettreAJourActivite(); }
    if (tabId === 'salaries') renderSalaries();
    if (tabId === 'registre') renderRegistre();
    if (tabId === 'archives') renderArchives();
    if (tabId === 'absences') renderAbsencesGlobal();
}

function refreshAllViews() {
    renderSalaries();
    renderRegistre();
    renderArchives();
    renderAbsencesGlobal();
    mettreAJourDashboard();
    mettreAJourActivite();
}

/* ----- Recherche globale ----- */
function openGlobalSearch() {
    document.getElementById('globalSearchInput').value = '';
    document.getElementById('globalSearchResults').innerHTML = '<div class="search-empty"><i class="fas fa-search" style="font-size:32px;opacity:.3;display:block;margin-bottom:8px;"></i>Tapez pour rechercher</div>';
    document.getElementById('searchModal').classList.add('show');
    setTimeout(() => document.getElementById('globalSearchInput').focus(), 100);
}

function closeGlobalSearch() {
    document.getElementById('searchModal').classList.remove('show');
}

function performGlobalSearch() {
    const q = (document.getElementById('globalSearchInput').value || '').toLowerCase().trim();
    const results = document.getElementById('globalSearchResults');
    if (!q) {
        results.innerHTML = '<div class="search-empty"><i class="fas fa-search" style="font-size:32px;opacity:.3;display:block;margin-bottom:8px;"></i>Tapez pour rechercher</div>';
        return;
    }
    let html = '';
    const salaries = getSalaries().filter(s =>
        (s.nom || '').toLowerCase().includes(q) ||
        (s.prenom || '').toLowerCase().includes(q) ||
        (s.matricule || '').toLowerCase().includes(q) ||
        (s.poste || '').toLowerCase().includes(q));
    if (salaries.length > 0) {
        html += '<div class="search-section-title">Salariés (' + salaries.length + ')</div>';
        salaries.slice(0, 5).forEach(s => {
            html += '<div class="search-result" onclick="useForFiche(\'' + s.id + '\');closeGlobalSearch();">' +
                '<div class="icon"><i class="fas fa-user"></i></div>' +
                '<div class="info">' +
                    '<div class="title">' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase() + '</div>' +
                    '<div class="subtitle">' + escapeHtml(s.poste || '—') + ' • ' + (s.salaireBase || 0).toLocaleString('fr-FR') + ' F</div>' +
                '</div>' +
            '</div>';
        });
    }
    const archives = getArchives().filter(a =>
        (a.moisFr || '').toLowerCase().includes(q) ||
        (a.mois || '').includes(q));
    if (archives.length > 0) {
        html += '<div class="search-section-title">Archives (' + archives.length + ')</div>';
        archives.slice(0, 5).forEach(a => {
            html += '<div class="search-result" onclick="openArchive(\'' + a.mois + '\');switchTab(\'archives\');closeGlobalSearch();">' +
                '<div class="icon" style="background:var(--success);"><i class="fas fa-archive"></i></div>' +
                '<div class="info">' +
                    '<div class="title">Paie ' + a.moisFr + '</div>' +
                    '<div class="subtitle">' + a.totaux.nb + ' salarié(s) • ' + a.totaux.net.toLocaleString('fr-FR') + ' F net</div>' +
                '</div>' +
            '</div>';
        });
    }
    if (html === '') {
        html = '<div class="search-empty"><i class="fas fa-search-minus" style="font-size:32px;opacity:.3;display:block;margin-bottom:8px;"></i>Aucun résultat pour "' + escapeHtml(q) + '"</div>';
    }
    results.innerHTML = html;
}