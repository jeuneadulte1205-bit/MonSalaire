/* ============================================================
   15-DASHBOARD - Dashboard enrichi (chart, top, alerts, activity)
   ============================================================ */

function mettreAJourDashboard() {
    const salaries = getSalaries();
    const archives = getArchives();
    document.getElementById('statSalaries').textContent = salaries.length;
    document.getElementById('statTotal').textContent = state.history.length;
    const totalAbs = salaries.reduce((sum, s) => sum + (s.absences || []).length, 0);
    document.getElementById('statAbsences').textContent = totalAbs;
    document.getElementById('statPdfCount').textContent = state.pdfCount || 0;
    renderDashboardChart(archives);
    renderTopSalaries(salaries);
    renderAlerts(salaries, archives);
}

function renderDashboardChart(archives) {
    const container = document.getElementById('dashChart');
    if (!container) return;
    const now = new Date();
    const mois12 = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        mois12.push(d.toISOString().slice(0, 7));
    }
    const data = mois12.map(m => {
        const arch = archives.find(a => a.mois === m);
        return { mois: m, brut: arch ? arch.totaux.brut : 0 };
    });
    const maxBrut = Math.max.apply(null, data.map(d => d.brut).concat([1]));
    let barsHtml = '';
    let labelsHtml = '';
    data.forEach(d => {
        const h = (d.brut / maxBrut) * 100;
        const parts = d.mois.split('-');
        const m = parts[1];
        const mName = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'][parseInt(m, 10) - 1];
        barsHtml += '<div class="mini-chart-bar" style="height:' + Math.max(h, 2) + '%" title="' + formatMoisFr(d.mois) + ' : ' + d.brut.toLocaleString('fr-FR') + ' F"></div>';
        labelsHtml += '<div class="mini-chart-lbl">' + mName + '</div>';
    });
    const hasData = data.some(d => d.brut > 0);
    if (!hasData) {
        container.innerHTML = '<div class="empty-dash"><i class="fas fa-chart-bar"></i><p>Archivez vos paies pour voir l\'évolution</p></div>';
        return;
    }
    const totalAnnee = data.reduce((s, d) => s + d.brut, 0);
    const moyenneMois = Math.round(totalAnnee / 12);
    container.innerHTML =
        '<div class="mini-chart">' + barsHtml + '</div>' +
        '<div class="mini-chart-labels">' + labelsHtml + '</div>' +
        '<div style="display:flex;justify-content:space-around;margin-top:14px;padding-top:14px;border-top:1px solid var(--gray-200);">' +
            '<div style="text-align:center;">' +
                '<div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px;">Total 12 mois</div>' +
                '<div style="font-size:15px;font-weight:800;color:var(--primary);margin-top:4px;">' + totalAnnee.toLocaleString('fr-FR') + ' F</div>' +
            '</div>' +
            '<div style="text-align:center;">' +
                '<div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px;">Moyenne / mois</div>' +
                '<div style="font-size:15px;font-weight:800;color:var(--primary);margin-top:4px;">' + moyenneMois.toLocaleString('fr-FR') + ' F</div>' +
            '</div>' +
        '</div>';
}

function renderTopSalaries(salaries) {
    const container = document.getElementById('dashTopSalaries');
    if (!container) return;
    if (salaries.length === 0) {
        container.innerHTML = '<div class="empty-dash"><i class="fas fa-users"></i><p>Ajoutez des salariés</p></div>';
        return;
    }
    const enriched = salaries.map(s => {
        const primes = (s.primeTransport || 0) + (s.primeLogement || 0) + (s.primeAnciennete || 0) + (s.primeHeuresSup || 0);
        return Object.assign({}, s, { brutTotal: (s.salaireBase || 0) + primes });
    });
    enriched.sort((a, b) => b.brutTotal - a.brutTotal);
    const top5 = enriched.slice(0, 5);
    let html = '';
    top5.forEach((s, i) => {
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'other';
        html += '<div class="top-salary-row">' +
            '<div class="top-salary-rank ' + rankClass + '">' + (i + 1) + '</div>' +
            '<div class="top-salary-info">' +
                '<div class="name">' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase() + '</div>' +
                '<div class="poste">' + escapeHtml(s.poste || 'Poste non défini') + '</div>' +
            '</div>' +
            '<div class="top-salary-amount">' + s.brutTotal.toLocaleString('fr-FR') + ' F</div>' +
        '</div>';
    });
    container.innerHTML = html;
}

function renderAlerts(salaries, archives) {
    const container = document.getElementById('dashAlerts');
    if (!container) return;
    const alerts = [];
    const now = new Date();
    const moisActuel = now.toISOString().slice(0, 7);
    const moisDernier = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const archMois = archives.find(a => a.mois === moisActuel);
    if (!archMois && salaries.length > 0) {
        alerts.push({ type: 'warning', icon: 'fa-calendar-exclamation', text: 'La paie de ' + formatMoisFr(moisActuel) + ' n\'est pas archivée' });
    }
    const archDernier = archives.find(a => a.mois === moisDernier);
    if (!archDernier && salaries.length > 0) {
        alerts.push({ type: 'warning', icon: 'fa-clock', text: 'Le mois précédent (' + formatMoisFr(moisDernier) + ') n\'est pas archivé' });
    }
    const sansDate = salaries.filter(s => !s.dateEmbauche).length;
    if (sansDate > 0) {
        alerts.push({ type: 'info', icon: 'fa-info-circle', text: sansDate + ' salarié(s) sans date d\'embauche (impact CP)' });
    }
    salaries.forEach(s => {
        const solde = calculerSoldeConges(s);
        if (solde.solde < 0) {
            alerts.push({ type: 'danger', icon: 'fa-exclamation-triangle', text: s.prenom + ' ' + s.nom + ' : solde CP négatif (' + solde.solde + ' j)' });
        }
    });
    if (salaries.length > 0 && alerts.length === 0) {
        alerts.push({ type: 'success', icon: 'fa-check-circle', text: 'Tout est à jour ! ' + salaries.length + ' salarié(s) actif(s)' });
    }
    if (!getEntrepriseActive()) {
        alerts.push({ type: 'info', icon: 'fa-building', text: 'Créez ou sélectionnez une entreprise pour commencer' });
    }
    if (alerts.length === 0) {
        container.innerHTML = '<div class="empty-dash"><i class="fas fa-bell-slash"></i><p>Aucune alerte</p></div>';
        return;
    }
    let html = '';
    alerts.forEach(a => {
        html += '<div class="alert-row ' + a.type + '">' +
            '<i class="fas ' + a.icon + '"></i>' +
            '<div class="alert-text">' + a.text + '</div>' +
        '</div>';
    });
    container.innerHTML = html;
}

function mettreAJourActivite() {
    const container = document.getElementById('activityList');
    if (!container) return;
    if (state.history.length === 0) {
        container.innerHTML = '<div class="activity-item"><span>Aucune activité</span><span class="date">-</span></div>';
        return;
    }
    let html = '';
    state.history.slice(0, 5).forEach(item => {
        const label = item.mode === 'brutToNet' ? 'Brut→Net' : 'Net→Brut';
        html += '<div class="activity-item"><span><strong>' + label + '</strong> • ' + item.brut.toLocaleString() + ' F → ' + item.net.toLocaleString() + ' F</span><span class="date">' + item.date + '</span></div>';
    });
    container.innerHTML = html;
}

function ajouterHistorique(result, mode, input) {
    state.history.unshift({
        mode: mode, input: input,
        brut: result.brut, net: result.net,
        base: result.baseImposable, cnss: result.cnss, its: result.its,
        date: new Date().toLocaleString('fr-FR', { hour12: false })
    });
    if (state.history.length > 100) state.history.pop();
    saveState();
    mettreAJourDashboard();
    mettreAJourActivite();
}