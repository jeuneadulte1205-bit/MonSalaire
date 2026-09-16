/* ============================================================
   VIEWS - Archives
   ============================================================ */

const ARCHIVES_HTML =
    '<div class="tab-panel" id="panel-archives">' +
        '<div class="archives-header">' +
            '<div>' +
                '<h2><i class="fas fa-archive"></i> Archives des paies</h2>' +
                '<p>Historique des mois clôturés</p>' +
            '</div>' +
            '<div id="archivesGlobalActions" style="display:none;">' +
                '<button class="btn-sm btn-outline" onclick="exportArchivesGlobalCSV()"><i class="fas fa-file-export"></i> Tout exporter</button>' +
            '</div>' +
        '</div>' +
        '<div id="evoContainer"></div>' +
        '<div id="archivesList"></div>' +
        '<div id="archivesEmpty" class="empty-archives" style="display:none;">' +
            '<i class="fas fa-folder-open"></i>' +
            '<p>Aucune archive pour le moment</p>' +
            '<p class="hint">Registre → <strong>Archiver</strong></p>' +
        '</div>' +
    '</div>';

VIEWS_HTML += ARCHIVES_HTML;