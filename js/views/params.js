/* ============================================================
   VIEWS - Paramètres
   ============================================================ */

const PARAMS_HTML =
    '<div class="tab-panel" id="panel-params">' +
        '<div class="params-grid">' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-building"></i> Entreprise active</h3>' +
                '<div id="paramsEntrepriseInfo"></div>' +
                '<button class="btn-save" onclick="openEntrepriseModal()" style="margin-top:14px;"><i class="fas fa-cog"></i> Gérer les entreprises</button>' +
            '</div>' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-percent"></i> Taux CNSS</h3>' +
                '<label>Part ouvrière (%)</label><input type="number" id="paramCnss" step="0.1" value="3.6">' +
                '<label>Plafond (FCFA) - 0 = illimité</label><input type="number" id="paramCnssCeil" value="0">' +
                '<button class="btn-save" onclick="saveParams()"><i class="fas fa-save"></i> Enregistrer</button>' +
            '</div>' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-scale-balanced"></i> Barème ITS</h3>' +
                '<div id="itsBracketsContainer"></div>' +
                '<button class="btn-save" onclick="saveParams()"><i class="fas fa-save"></i> Enregistrer</button>' +
            '</div>' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-calendar-check"></i> Congés payés</h3>' +
                '<label>Jours cumulés/mois</label><input type="number" id="paramCPJoursMois" step="0.5" value="2">' +
                '<label>Jours ouvrables/mois</label><input type="number" id="paramJoursOuvrables" value="30">' +
                '<button class="btn-save" onclick="saveParamsConges()" style="margin-top:14px;"><i class="fas fa-save"></i> Enregistrer</button>' +
            '</div>' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-shield-alt"></i> Sécurité</h3>' +
                '<label>Durée de session (min)</label>' +
                '<input type="number" id="paramSessionDuration" min="1" max="120" value="30">' +
                '<button class="btn-save" onclick="saveSessionDuration()" style="margin-top:14px;"><i class="fas fa-clock"></i> Enregistrer</button>' +
                '<button class="btn-save" onclick="openChangePinModal()" style="background:var(--warning);margin-top:8px;"><i class="fas fa-key"></i> Changer le PIN</button>' +
            '</div>' +
            '<div class="params-card">' +
                '<h3><i class="fas fa-database"></i> Données</h3>' +
                '<p class="text-muted" style="font-size:13px;margin-bottom:12px;">Stockage 100% local sur cet appareil.</p>' +
                '<button class="btn-save" onclick="exportAllData()" style="background:var(--success);"><i class="fas fa-download"></i> Exporter toutes les données</button>' +
                '<button class="btn-save" onclick="resetAllData()" style="background:var(--danger);margin-top:8px;"><i class="fas fa-trash"></i> Réinitialiser tout</button>' +
            '</div>' +
        '</div>' +
    '</div>';

VIEWS_HTML += PARAMS_HTML;