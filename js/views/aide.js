/* ============================================================
   VIEWS - Aide
   ============================================================ */

const AIDE_HTML =
    '<div class="tab-panel" id="panel-aide">' +
        '<div class="aide-container">' +
            '<div class="aide-header">' +
                '<div class="logo-big"><i class="fas fa-question-circle"></i></div>' +
                '<div>' +
                    '<h1>Centre d\\'aide</h1>' +
                    '<p>Tout ce qu\\'il faut savoir sur Mon Salaire et la paie au Bénin</p>' +
                '</div>' +
            '</div>' +

            '<div class="aide-nav">' +
                '<button class="aide-nav-btn active" data-aide="demarrage"><i class="fas fa-rocket"></i> Démarrage</button>' +
                '<button class="aide-nav-btn" data-aide="calculs"><i class="fas fa-calculator"></i> Calculs ITS/CNSS</button>' +
                '<button class="aide-nav-btn" data-aide="fiches"><i class="fas fa-file-invoice"></i> Fiches de paie</button>' +
                '<button class="aide-nav-btn" data-aide="absences"><i class="fas fa-calendar-times"></i> Absences</button>' +
                '<button class="aide-nav-btn" data-aide="faq"><i class="fas fa-comments"></i> FAQ</button>' +
                '<button class="aide-nav-btn" data-aide="legal"><i class="fas fa-balance-scale"></i> Légal</button>' +
            '</div>' +

            '<div class="aide-content">' +

                /* Démarrage */
                '<div class="aide-section active" id="aide-demarrage">' +
                    '<h2><i class="fas fa-rocket"></i> Démarrage rapide</h2>' +
                    '<div class="aide-step"><div class="step-number">1</div><div class="step-content"><h3>Créer votre première entreprise</h3><p>Cliquez sur le sélecteur d\\'entreprise en haut → remplissez le nom, l\\'adresse et éventuellement le NIF/CNSS.</p></div></div>' +
                    '<div class="aide-step"><div class="step-number">2</div><div class="step-content"><h3>Ajouter vos salariés</h3><p>Onglet "Salariés" → "Ajouter" ou importez un CSV. Chaque salarié a un salaire de base, des primes, un contrat.</p></div></div>' +
                    '<div class="aide-step"><div class="step-number">3</div><div class="step-content"><h3>Générer le registre mensuel</h3><p>Onglet "Registre" → choisissez un mois → vous voyez tous les salariés avec leur net calculé.</p></div></div>' +
                    '<div class="aide-step"><div class="step-number">4</div><div class="step-content"><h3>Générer les fiches PDF</h3><p>Bouton "Toutes les fiches" → un seul PDF avec une page par salarié.</p></div></div>' +
                    '<div class="aide-step"><div class="step-number">5</div><div class="step-content"><h3>Archiver la paie</h3><p>Une fois validée, cliquez sur "Archiver" pour conserver l\\'historique du mois.</p></div></div>' +
                '</div>' +

                /* Calculs */
                '<div class="aide-section" id="aide-calculs">' +
                    '<h2><i class="fas fa-calculator"></i> Comprendre les calculs</h2>' +
                    '<div class="aide-block">' +
                        '<h3>🧾 ITS (Impôt sur les Traitements et Salaires)</h3>' +
                        '<p>Au Bénin, l\\'impôt sur le revenu des salariés s\\'appelle <strong>ITS</strong>. Barème progressif :</p>' +
                        '<table class="aide-table">' +
                            '<thead><tr><th>Tranche de revenu imposable</th><th>Taux</th></tr></thead>' +
                            '<tbody>' +
                                '<tr><td>0 – 60 000 FCFA</td><td class="success">0%</td></tr>' +
                                '<tr><td>60 001 – 150 000 FCFA</td><td>10%</td></tr>' +
                                '<tr><td>150 001 – 250 000 FCFA</td><td>15%</td></tr>' +
                                '<tr><td>250 001 – 500 000 FCFA</td><td>19%</td></tr>' +
                                '<tr><td>Au-delà de 500 000 FCFA</td><td class="danger">30%</td></tr>' +
                            '</tbody>' +
                        '</table>' +
                        '<p class="aide-note"><i class="fas fa-info-circle"></i> La <strong>base imposable</strong> est le salaire brut arrondi à la tranche de 1 000 FCFA inférieure.</p>' +
                    '</div>' +
                    '<div class="aide-block">' +
                        '<h3>💼 CNSS</h3>' +
                        '<p>Cotisation part ouvrière : <strong>3,6%</strong> du salaire brut. La part patronale (16,4%) est à la charge de l\\'employeur.</p>' +
                    '</div>' +
                    '<div class="aide-block">' +
                        '<h3>📊 Formule Brut → Net</h3>' +
                        '<div class="aide-formula">Net = Brut − CNSS (3,6%) − ITS</div>' +
                    '</div>' +
                '</div>' +

                /* Fiches */
                '<div class="aide-section" id="aide-fiches">' +
                    '<h2><i class="fas fa-file-invoice"></i> Générer une fiche de paie</h2>' +
                    '<p>Vous disposez de <strong>8 modèles visuels</strong> personnalisables :</p>' +
                    '<ul class="aide-list">' +
                        '<li><strong>Classique</strong> — Administrations et PME</li>' +
                        '<li><strong>Moderne</strong> — Bandeau coloré, startups</li>' +
                        '<li><strong>Élégant</strong> — Typographie fine</li>' +
                        '<li><strong>Corporate</strong> — Grandes entreprises</li>' +
                        '<li><strong>Minimaliste</strong> — Design épuré</li>' +
                        '<li><strong>Audacieux</strong> — Contraste fort</li>' +
                        '<li><strong>Encadré</strong> — Bordure épaisse</li>' +
                        '<li><strong>Rayé</strong> — Motif diagonal</li>' +
                    '</ul>' +
                    '<p>Dans l\\'onglet <strong>Studio Fiche</strong> vous pouvez modifier les couleurs, le logo, les textes et activer/désactiver chaque section.</p>' +
                '</div>' +

                /* Absences */
                '<div class="aide-section" id="aide-absences">' +
                    '<h2><i class="fas fa-calendar-times"></i> Gestion des absences</h2>' +
                    '<p>7 types d\\'absence supportés :</p>' +
                    '<div class="aide-badges">' +
                        '<span class="abs-badge conge_paye">Congés payés</span>' +
                        '<span class="abs-badge maladie">Maladie</span>' +
                        '<span class="abs-badge maternite">Maternité</span>' +
                        '<span class="abs-badge familial">Événement familial</span>' +
                        '<span class="abs-badge sans_solde">Sans solde</span>' +
                        '<span class="abs-badge autre_paye">Autre (payé)</span>' +
                        '<span class="abs-badge autre_non_paye">Autre (non payé)</span>' +
                    '</div>' +
                    '<h3 style="margin-top:20px;">Calcul de la retenue</h3>' +
                    '<div class="aide-formula">Retenue = (Salaire + Primes) ÷ 30 × jours non payés</div>' +
                    '<h3 style="margin-top:20px;">Congés payés</h3>' +
                    '<p>Le solde est cumulé à <strong>2 jours/mois</strong> (24 jours/an, conforme au Code du Travail béninois).</p>' +
                '</div>' +

                /* FAQ */
                '<div class="aide-section" id="aide-faq">' +
                    '<h2><i class="fas fa-comments"></i> Questions fréquentes</h2>' +
                    '<details class="faq-item"><summary>Mes données sont-elles en sécurité ?</summary><p>Toutes vos données restent sur votre appareil. Aucune information n\\'est envoyée à un serveur externe. L\\'accès est protégé par un code PIN à 6 chiffres (haché SHA-256).</p></details>' +
                    '<details class="faq-item"><summary>Puis-je gérer plusieurs entreprises ?</summary><p>Oui ! Cliquez sur le sélecteur d\\'entreprise en haut. Chaque entreprise a ses propres salariés, archives et modèle de fiche.</p></details>' +
                    '<details class="faq-item"><summary>Comment mettre à jour les taux CNSS/ITS ?</summary><p>Onglet Paramètres → modifiez les taux. Les calculs suivants utiliseront automatiquement les nouvelles valeurs.</p></details>' +
                    '<details class="faq-item"><summary>Comment sauvegarder mes données ?</summary><p>Paramètres → "Exporter mes données" télécharge un fichier JSON complet.</p></details>' +
                    '<details class="faq-item"><summary>J\\'ai oublié mon code PIN, que faire ?</summary><p>Malheureusement, aucune récupération n\\'est possible. Vous devez réinitialiser l\\'application, ce qui efface toutes les données.</p></details>' +
                    '<details class="faq-item"><summary>Puis-je utiliser Mon Salaire hors ligne ?</summary><p>Oui, l\\'application fonctionne 100% hors ligne.</p></details>' +
                '</div>' +

                /* Légal */
                '<div class="aide-section" id="aide-legal">' +
                    '<h2><i class="fas fa-balance-scale"></i> Cadre légal</h2>' +
                    '<div class="aide-block">' +
                        '<h3>Conformité au Bénin</h3>' +
                        '<ul class="aide-list">' +
                            '<li>CNSS : Part ouvrière 3,6%</li>' +
                            '<li>ITS : Barème progressif 0% à 30%</li>' +
                            '<li>Arrêté n°155/MFPTRA/DC/SGM/DGT/DNT/SRT du 12 juin 2003</li>' +
                            '<li>Code du Travail : 24 jours de congés payés par an</li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="aide-block">' +
                        '<h3>Mentions obligatoires sur la fiche de paie</h3>' +
                        '<ul class="aide-list">' +
                            '<li>Identité de l\\'employeur (nom, adresse, NIF, N° CNSS)</li>' +
                            '<li>Identité du salarié (nom, matricule, fonction)</li>' +
                            '<li>Période de paie</li>' +
                            '<li>Détail des éléments de rémunération</li>' +
                            '<li>Détail des retenues (CNSS, ITS)</li>' +
                            '<li>Net à payer</li>' +
                            '<li>Signatures (employeur + employé)</li>' +
                        '</ul>' +
                        '<p class="aide-note"><i class="fas fa-exclamation-triangle"></i> <strong>Important :</strong> cette application fournit une aide au calcul. Faites toujours valider vos bulletins par un expert-comptable.</p>' +
                    '</div>' +
                '</div>' +

            '</div>' +
        '</div>' +
    '</div>';

VIEWS_HTML += AIDE_HTML;