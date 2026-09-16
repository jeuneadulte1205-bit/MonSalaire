/* ============================================================
   VIEWS - Studio Fiche
   ============================================================ */

const STUDIO_HTML =
    '<div class="tab-panel" id="panel-fiche">' +
        '<div class="studio">' +
            '<div class="studio-panel">' +
                '<div class="studio-panel-header"><i class="fas fa-sliders-h"></i> Personnalisation</div>' +
                '<div class="studio-panel-body">' +
                    /* Templates */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-swatchbook"></i> Modèle (8 styles)</div>' +
                        '<div class="template-grid" id="templateGrid">' +
                            '<div class="template-card active" data-template="classic"><div class="template-thumb tpl-classic-thumb"></div><div class="template-name">Classique</div></div>' +
                            '<div class="template-card" data-template="modern"><div class="template-thumb tpl-modern-thumb"></div><div class="template-name">Moderne</div></div>' +
                            '<div class="template-card" data-template="elegant"><div class="template-thumb tpl-elegant-thumb"></div><div class="template-name">Élégant</div></div>' +
                            '<div class="template-card" data-template="corporate"><div class="template-thumb tpl-corporate-thumb"></div><div class="template-name">Corporate</div></div>' +
                            '<div class="template-card" data-template="minimalist"><div class="template-thumb tpl-minimalist-thumb"></div><div class="template-name">Minimaliste</div></div>' +
                            '<div class="template-card" data-template="bold"><div class="template-thumb tpl-bold-thumb"></div><div class="template-name">Audacieux</div></div>' +
                            '<div class="template-card" data-template="bordered"><div class="template-thumb tpl-bordered-thumb"></div><div class="template-name">Encadré</div></div>' +
                            '<div class="template-card" data-template="stripe"><div class="template-thumb tpl-stripe-thumb"></div><div class="template-name">Rayé</div></div>' +
                        '</div>' +
                    '</div>' +
                    /* Couleurs */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-palette"></i> Couleurs</div>' +
                        '<div class="color-row"><input type="color" id="colorPrimary" value="#2563eb"><span class="color-label">Principale</span></div>' +
                        '<div class="color-row"><input type="color" id="colorSecondary" value="#0f172a"><span class="color-label">Secondaire</span></div>' +
                    '</div>' +
                    /* Logo */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-image"></i> Logo</div>' +
                        '<div class="logo-uploader" onclick="document.getElementById(\\'logoInput\\').click()"><i class="fas fa-cloud-upload-alt"></i><p>Cliquez pour uploader</p></div>' +
                        '<input type="file" id="logoInput" accept="image/*" style="display:none">' +
                        '<div id="logoPreviewContainer"></div>' +
                    '</div>' +
                    /* Informations */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-info-circle"></i> Informations</div>' +
                        '<label class="studio-label">Entreprise</label><input type="text" class="studio-input" id="stEntreprise" value="Votre Entreprise SARL">' +
                        '<label class="studio-label">Adresse</label><input type="text" class="studio-input" id="stAdresse" value="Cotonou, Bénin">' +
                        '<label class="studio-label">Contact</label><input type="text" class="studio-input" id="stContact" value="+229 00 00 00 00">' +
                        '<label class="studio-label">NIF</label><input type="text" class="studio-input" id="stNif" placeholder="Ex: 1234567890123">' +
                        '<label class="studio-label">N° CNSS</label><input type="text" class="studio-input" id="stCnss" placeholder="Ex: CNSS-012345678">' +
                        '<label class="studio-label">Salarié</label><input type="text" class="studio-input" id="stSalarie" value="Jean DUPONT">' +
                        '<label class="studio-label">Matricule</label><input type="text" class="studio-input" id="stMatricule" placeholder="Ex: EMP001">' +
                        '<label class="studio-label">Fonction</label><input type="text" class="studio-input" id="stFonction" value="Chef de projet">' +
                        '<label class="studio-label">Période</label><input type="text" class="studio-input" id="stPeriode" value="Août 2026">' +
                        '<label class="studio-label">Date de paiement</label><input type="date" class="studio-input" id="stDatePaiement" value="2026-08-28">' +
                        '<label class="studio-label">Signature Responsable</label><input type="text" class="studio-input" id="stSignature" value="Le Directeur Général">' +
                        '<label class="studio-label">Signature Employé</label><input type="text" class="studio-input" id="stSignatureEmp" value="L\\'Employé">' +
                        '<label class="studio-label">Pied de page</label><textarea class="studio-textarea" id="stFooter">Document généré par Mon Salaire - Calculateur de paie Bénin</textarea>' +
                    '</div>' +
                    /* Sections */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-eye"></i> Sections</div>' +
                        '<div class="toggle-row"><label>Logo</label><div class="toggle"><input type="checkbox" id="stShowLogo" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Primes détaillées</label><div class="toggle"><input type="checkbox" id="stShowPrimes" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Absences</label><div class="toggle"><input type="checkbox" id="stShowAbsences" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Mentions légales</label><div class="toggle"><input type="checkbox" id="stShowMentions" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Signatures</label><div class="toggle"><input type="checkbox" id="stShowSignature" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Infos employeur</label><div class="toggle"><input type="checkbox" id="stShowEmp" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>NIF / N° CNSS</label><div class="toggle"><input type="checkbox" id="stShowNif"><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Matricule</label><div class="toggle"><input type="checkbox" id="stShowMatricule"><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Date de paiement</label><div class="toggle"><input type="checkbox" id="stShowDatePaiement" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Solde congés</label><div class="toggle"><input type="checkbox" id="stShowConges" checked><span class="toggle-slider"></span></div></div>' +
                        '<div class="toggle-row"><label>Cumuls YTD</label><div class="toggle"><input type="checkbox" id="stShowYtd"><span class="toggle-slider"></span></div></div>' +
                    '</div>' +
                    /* Primes */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-plus-circle"></i> Primes</div>' +
                        '<div class="grid-2">' +
                            '<div><label class="studio-label">Transport</label><input type="number" class="studio-input" id="pTransport" value="0" step="1000"></div>' +
                            '<div><label class="studio-label">Logement</label><input type="number" class="studio-input" id="pLogement" value="0" step="1000"></div>' +
                            '<div><label class="studio-label">Ancienneté</label><input type="number" class="studio-input" id="pAnciennete" value="0" step="1000"></div>' +
                            '<div><label class="studio-label">Heures sup.</label><input type="number" class="studio-input" id="pHeuresSup" value="0" step="1000"></div>' +
                        '</div>' +
                        '<label class="studio-label">Cumul Brut YTD</label><input type="number" class="studio-input" id="pYtdBrut" value="0" step="1000">' +
                        '<label class="studio-label">Cumul Net YTD</label><input type="number" class="studio-input" id="pYtdNet" value="0" step="1000">' +
                    '</div>' +
                    /* Actions */
                    '<div class="studio-section">' +
                        '<div class="studio-section-title"><i class="fas fa-bolt"></i> Actions</div>' +
                        '<button class="btn-studio btn-apply" onclick="genererFichePDF()"><i class="fas fa-file-pdf"></i> Générer PDF</button>' +
                        '<button class="btn-studio btn-save-tpl" onclick="saveTemplate()"><i class="fas fa-save"></i> Enregistrer modèle</button>' +
                        '<button class="btn-studio btn-reset" onclick="resetTemplate()"><i class="fas fa-undo"></i> Réinitialiser</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                    '<h3 style="color:var(--gray-700);font-size:16px;"><i class="fas fa-eye" style="color:var(--primary);"></i> Aperçu en temps réel</h3>' +
                '</div>' +
                '<div class="fiche-wrapper"><div class="fiche-apercu" id="fichePreview"></div></div>' +
            '</div>' +
        '</div>' +
    '</div>';

VIEWS_HTML += STUDIO_HTML;