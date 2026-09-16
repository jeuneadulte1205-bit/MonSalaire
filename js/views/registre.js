/* ============================================================
   VIEWS - Registre mensuel
   ============================================================ */

const REGISTRE_HTML =
    '<div class="tab-panel" id="panel-registre">' +
        '<div class="registre-toolbar">' +
            '<div>' +
                '<label class="registre-lbl">Mois de paie</label>' +
                '<input type="month" id="regMois" onchange="renderRegistre()">' +
            '</div>' +
            '<div style="align-self:flex-end;"><button class="btn-sm btn-primary" onclick="renderRegistre()"><i class="fas fa-sync"></i> Actualiser</button></div>' +
            '<div class="registre-actions">' +
                '<button class="btn-sm btn-success" onclick="genererToutesFichesPDF()"><i class="fas fa-file-pdf"></i> Toutes les fiches</button>' +
                '<button class="btn-sm btn-warning" onclick="genererJournalPaiePDF()"><i class="fas fa-chart-bar"></i> Journal</button>' +
                '<button class="btn-sm btn-outline" onclick="exportRegistreCSV()"><i class="fas fa-file-csv"></i> Virement</button>' +
                '<button class="btn-sm btn-primary" onclick="enregistrerPaieMois()"><i class="fas fa-save"></i> Archiver</button>' +
            '</div>' +
        '</div>' +
        '<div class="stats-grid" style="margin-bottom:20px;">' +
            '<div class="stat-card primary"><i class="fas fa-users icon"></i><div class="label">Salariés</div><div class="value" id="regNbSalaries">0</div><div class="sub">ce mois</div></div>' +
            '<div class="stat-card warning"><i class="fas fa-money-bill-wave icon"></i><div class="label">Masse brute</div><div class="value" id="regBrut" style="font-size:20px;">0 F</div><div class="sub">total</div></div>' +
            '<div class="stat-card danger"><i class="fas fa-percent icon"></i><div class="label">Retenues</div><div class="value" id="regRetenues" style="font-size:20px;">0 F</div><div class="sub">CNSS+ITS+Abs</div></div>' +
            '<div class="stat-card success"><i class="fas fa-hand-holding-usd icon"></i><div class="label">Masse nette</div><div class="value" id="regNet" style="font-size:20px;">0 F</div><div class="sub">à payer</div></div>' +
        '</div>' +
        '<div class="registre-table-wrap">' +
            '<table class="registre-table">' +
                '<thead><tr>' +
                    '<th>Matricule</th><th>Salarié</th><th>Poste</th>' +
                    '<th class="r">Abs.</th><th class="r">Retenue</th>' +
                    '<th class="r">Brut</th><th class="r">CNSS</th><th class="r">ITS</th>' +
                    '<th class="r">Net</th><th class="c">Actions</th>' +
                '</tr></thead>' +
                '<tbody id="registreTableBody"></tbody>' +
            '</table>' +
        '</div>' +
        '<div id="registreEmpty" class="empty-salaries" style="display:none;margin-top:20px;">' +
            '<i class="fas fa-users-slash"></i>' +
            '<p>Aucun salarié enregistré</p>' +
        '</div>' +
    '</div>';

VIEWS_HTML += REGISTRE_HTML;