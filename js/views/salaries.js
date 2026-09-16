/* ============================================================
   VIEWS - Salariés
   ============================================================ */

const SALARIES_HTML =
    '<div class="tab-panel" id="panel-salaries">' +
        '<div class="salaries-toolbar">' +
            '<input type="text" id="searchSalary" placeholder="🔍 Rechercher...">' +
            '<button class="btn-sm btn-primary" onclick="openSalaryModal()"><i class="fas fa-plus"></i> Ajouter</button>' +
            '<button class="btn-sm btn-success" onclick="openImportModal()"><i class="fas fa-file-import"></i> Importer</button>' +
            '<button class="btn-sm btn-outline" onclick="exportSalariesCSV()"><i class="fas fa-file-export"></i> Exporter</button>' +
        '</div>' +
        '<div id="salariesList" class="salaries-list"></div>' +
    '</div>';

VIEWS_HTML += SALARIES_HTML;