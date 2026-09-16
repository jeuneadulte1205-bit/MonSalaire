/* ============================================================
   VIEWS - Calculs (Brut/Net)
   ============================================================ */

const CALCULS_HTML =
    '<div class="tab-panel" id="panel-calcul">' +
        '<div class="sub-tabs">' +
            '<button class="sub-tab active" data-subtab="brutToNet"><i class="fas fa-arrow-right"></i> Brut → Net</button>' +
            '<button class="sub-tab" data-subtab="netToBrut"><i class="fas fa-arrow-left"></i> Net → Brut</button>' +
        '</div>' +
        '<div class="sub-panel active" id="sub-brutToNet">' +
            '<div class="calc-grid">' +
                '<div class="calc-inputs">' +
                    '<label>Salaire Brut (FCFA)</label>' +
                    '<input type="number" id="brutInput" value="785269">' +
                    '<button class="btn" onclick="calculerBrutNet()"><i class="fas fa-calculator"></i> Calculer</button>' +
                '</div>' +
                '<div class="calc-results">' +
                    '<div class="label">Salaire Net à percevoir</div>' +
                    '<div class="net-big" id="bnNet">0 FCFA</div>' +
                    '<div style="margin-top:12px;">' +
                        '<div class="detail-row"><span>Base imposable</span><span class="val" id="bnBase">0</span></div>' +
                        '<div class="detail-row"><span>CNSS (3,6%)</span><span class="val" id="bnCnss">0</span></div>' +
                        '<div class="detail-row"><span>ITS (Impôt)</span><span class="val" id="bnIts">0</span></div>' +
                        '<div class="detail-row"><span>Total retenues</span><span class="val" id="bnTotal">0</span></div>' +
                    '</div>' +
                    '<div class="highlight-box" id="bnDetail">Détail du calcul ITS : ...</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="sub-panel" id="sub-netToBrut">' +
            '<div class="calc-grid">' +
                '<div class="calc-inputs">' +
                    '<label>Salaire Net souhaité (FCFA)</label>' +
                    '<input type="number" id="netInput" value="600000">' +
                    '<button class="btn" onclick="calculerNetBrut()"><i class="fas fa-calculator"></i> Calculer</button>' +
                '</div>' +
                '<div class="calc-results">' +
                    '<div class="label">Salaire Brut nécessaire</div>' +
                    '<div class="net-big" id="nbNet">0 FCFA</div>' +
                    '<div style="margin-top:12px;">' +
                        '<div class="detail-row"><span>Base imposable</span><span class="val" id="nbBase">0</span></div>' +
                        '<div class="detail-row"><span>CNSS (3,6%)</span><span class="val" id="nbCnss">0</span></div>' +
                        '<div class="detail-row"><span>ITS (Impôt)</span><span class="val" id="nbIts">0</span></div>' +
                        '<div class="detail-row"><span>Total retenues</span><span class="val" id="nbTotal">0</span></div>' +
                    '</div>' +
                    '<div class="highlight-box" id="nbDetail">Détail du calcul ITS : ...</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

VIEWS_HTML += CALCULS_HTML;