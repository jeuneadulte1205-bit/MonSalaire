/* ============================================================
   VIEWS - Absences (vue globale)
   ============================================================ */

const ABSENCES_HTML =
    '<div class="tab-panel" id="panel-absences">' +
        '<div class="absences-toolbar">' +
            '<div>' +
                '<label class="registre-lbl">Mois</label>' +
                '<input type="month" id="absGlobalMois" onchange="renderAbsencesGlobal()">' +
            '</div>' +
            '<div style="align-self:flex-end;"><button class="btn-sm btn-primary" onclick="renderAbsencesGlobal()"><i class="fas fa-sync"></i> Actualiser</button></div>' +
            '<div style="align-self:flex-end;margin-left:auto;">' +
                '<button class="btn-sm btn-outline" onclick="exportAbsencesCSV()"><i class="fas fa-file-csv"></i> Exporter</button>' +
            '</div>' +
        '</div>' +
        '<div class="stats-grid" style="margin:16px 0;">' +
            '<div class="stat-card primary"><i class="fas fa-users icon"></i><div class="label">Salariés absents</div><div class="value" id="absStatSalaries">0</div><div class="sub">ce mois</div></div>' +
            '<div class="stat-card warning"><i class="fas fa-calendar-day icon"></i><div class="label">Jours absents</div><div class="value" id="absStatJours">0</div><div class="sub">total</div></div>' +
            '<div class="stat-card danger"><i class="fas fa-money-bill-wave icon"></i><div class="label">Retenues</div><div class="value" id="absStatRetenues" style="font-size:20px;">0 F</div><div class="sub">impact masse</div></div>' +
        '</div>' +
        '<div id="absencesGlobalList"></div>' +
    '</div>';

VIEWS_HTML += ABSENCES_HTML;