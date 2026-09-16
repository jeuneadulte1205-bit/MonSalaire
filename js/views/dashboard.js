/* ============================================================
   VIEWS - Dashboard
   ============================================================ */

const DASHBOARD_HTML =
    '<div class="tab-panel active" id="panel-dashboard">' +
        '<div class="stats-grid">' +
            '<div class="stat-card primary"><i class="fas fa-users icon"></i><div class="label">Salariés</div><div class="value" id="statSalaries">0</div><div class="sub">actifs</div></div>' +
            '<div class="stat-card success"><i class="fas fa-calculator icon"></i><div class="label">Calculs</div><div class="value" id="statTotal">0</div><div class="sub">ce mois</div></div>' +
            '<div class="stat-card warning"><i class="fas fa-calendar-times icon"></i><div class="label">Absences</div><div class="value" id="statAbsences">0</div><div class="sub">ce mois</div></div>' +
            '<div class="stat-card danger"><i class="fas fa-file-pdf icon"></i><div class="label">Fiches PDF</div><div class="value" id="statPdfCount">0</div><div class="sub">générées</div></div>' +
        '</div>' +
        '<div class="dashboard-grid">' +
            '<div class="dash-card primary" id="dashMasseCard">' +
                '<div class="dash-card-header"><h3><i class="fas fa-money-bill-trend-up"></i> Masse salariale — 12 derniers mois</h3></div>' +
                '<div class="dash-card-body"><div id="dashChart"></div></div>' +
            '</div>' +
            '<div class="dash-card" id="dashTopCard">' +
                '<div class="dash-card-header"><h3><i class="fas fa-crown"></i> Top 5 salariés</h3></div>' +
                '<div class="dash-card-body"><div id="dashTopSalaries" class="empty-dash"><i class="fas fa-users"></i><p>Ajoutez des salariés</p></div></div>' +
            '</div>' +
            '<div class="dash-card" id="dashAlertsCard">' +
                '<div class="dash-card-header"><h3><i class="fas fa-bell"></i> Alertes & rappels</h3></div>' +
                '<div class="dash-card-body"><div id="dashAlerts"></div></div>' +
            '</div>' +
            '<div class="dash-card" id="dashActivityCard">' +
                '<div class="dash-card-header"><h3><i class="fas fa-clock-rotate-left"></i> Activités récentes</h3></div>' +
                '<div class="dash-card-body"><div id="activityList"></div></div>' +
            '</div>' +
        '</div>' +
    '</div>';

VIEWS_HTML += DASHBOARD_HTML;