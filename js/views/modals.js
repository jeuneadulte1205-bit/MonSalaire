/* ============================================================
   VIEWS - Tous les modals
   ============================================================ */

const MODALS_HTML =
    /* --- ENTREPRISE --- */
    '<div class="modal-overlay" id="entrepriseModal">' +
        '<div class="modal" style="max-width:560px;">' +
            '<div class="modal-header"><h3><i class="fas fa-building"></i> Mes entreprises</h3><button class="modal-close" onclick="closeEntrepriseModal()">×</button></div>' +
            '<div class="modal-body">' +
                '<div id="entrepriseList"></div>' +
                '<hr style="margin:16px 0;border:0;border-top:1px solid var(--gray-200);">' +
                '<h4 style="font-size:14px;color:var(--gray-700);margin-bottom:10px;"><i class="fas fa-plus-circle"></i> Nouvelle entreprise</h4>' +
                '<input type="hidden" id="entId">' +
                '<div class="grid-2">' +
                    '<div><label>Nom *</label><input type="text" id="entNom" placeholder="Ex: Ma Société SARL"></div>' +
                    '<div><label>Adresse</label><input type="text" id="entAdresse" placeholder="Cotonou, Bénin"></div>' +
                    '<div><label>NIF</label><input type="text" id="entNif" placeholder="Ex: 1234567890123"></div>' +
                    '<div><label>N° CNSS</label><input type="text" id="entCnss" placeholder="Ex: CNSS-012345678"></div>' +
                '</div>' +
                '<button class="btn-sm btn-primary" onclick="saveEntreprise()" style="width:100%;justify-content:center;margin-top:14px;">' +
                    '<i class="fas fa-save"></i> Enregistrer l\\'entreprise' +
                '</button>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button class="btn-sm btn-outline" onclick="closeEntrepriseModal()">Fermer</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    /* --- SALARIÉ --- */
    '<div class="modal-overlay" id="salaryModal">' +
        '<div class="modal">' +
            '<div class="modal-header"><h3 id="salaryModalTitle"><i class="fas fa-user-plus"></i> Ajouter un salarié</h3><button class="modal-close" onclick="closeSalaryModal()">×</button></div>' +
            '<div class="modal-body">' +
                '<input type="hidden" id="salaryId">' +
                '<div class="grid-2"><div><label>Nom *</label><input type="text" id="salNom"></div><div><label>Prénom *</label><input type="text" id="salPrenom"></div></div>' +
                '<div class="grid-2"><div><label>Matricule</label><input type="text" id="salMatricule"></div><div><label>Poste</label><input type="text" id="salPoste"></div></div>' +
                '<div class="grid-2">' +
                    '<div><label>Contrat</label><select id="salContrat"><option>CDI</option><option>CDD</option><option>Stage</option></select></div>' +
                    '<div><label>Date d\\'embauche</label><input type="date" id="salDateEmbauche"></div>' +
                '</div>' +
                '<label>Salaire de base (FCFA) *</label><input type="number" id="salSalaireBase" step="1000">' +
                '<label style="margin-top:14px;"><i class="fas fa-plus-circle"></i> Primes mensuelles</label>' +
                '<div class="grid-2">' +
                    '<div><label style="font-size:12px;">Transport</label><input type="number" id="salPrimeTransport" value="0" step="1000"></div>' +
                    '<div><label style="font-size:12px;">Logement</label><input type="number" id="salPrimeLogement" value="0" step="1000"></div>' +
                    '<div><label style="font-size:12px;">Ancienneté</label><input type="number" id="salPrimeAnciennete" value="0" step="1000"></div>' +
                    '<div><label style="font-size:12px;">Heures sup.</label><input type="number" id="salPrimeHeuresSup" value="0" step="1000"></div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button class="btn-sm btn-outline" onclick="closeSalaryModal()">Annuler</button>' +
                '<button class="btn-sm btn-primary" onclick="saveSalary()"><i class="fas fa-save"></i> Enregistrer</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    /* --- IMPORT CSV --- */
    '<div class="modal-overlay" id="importModal">' +
        '<div class="modal">' +
            '<div class="modal-header"><h3><i class="fas fa-file-import"></i> Importer des salariés</h3><button class="modal-close" onclick="closeImportModal()">×</button></div>' +
            '<div class="modal-body">' +
                '<p class="text-muted">Format : <code>nom;prenom;matricule;poste;salaireBase;primeTransport;primeLogement;primeAnciennete;primeHeuresSup</code></p>' +
                '<label style="margin-top:14px;">Collez votre CSV :</label>' +
                '<textarea id="csvInput" style="width:100%;min-height:150px;padding:10px;border:2px solid var(--gray-200);border-radius:10px;font-family:monospace;font-size:12px;"></textarea>' +
                '<label style="margin-top:12px;">Ou fichier :</label>' +
                '<input type="file" id="csvFile" accept=".csv,.txt">' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button class="btn-sm btn-outline" onclick="closeImportModal()">Annuler</button>' +
                '<button class="btn-sm btn-success" onclick="processImport()"><i class="fas fa-upload"></i> Importer</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    /* --- CHANGER PIN --- */
    '<div class="modal-overlay" id="changePinModal">' +
        '<div class="modal" style="max-width:420px;">' +
            '<div class="modal-header"><h3><i class="fas fa-key"></i> Changer le code PIN</h3><button class="modal-close" onclick="closeChangePinModal()">×</button></div>' +
            '<div class="modal-body">' +
                '<div class="pin-change-form">' +
                    '<input type="tel" id="oldPin" maxlength="6" inputmode="numeric" placeholder="PIN actuel">' +
                    '<input type="tel" id="newPin1" maxlength="6" inputmode="numeric" placeholder="Nouveau PIN">' +
                    '<input type="tel" id="newPin2" maxlength="6" inputmode="numeric" placeholder="Confirmer nouveau PIN">' +
                '</div>' +
                '<div class="pin-error-msg" id="changePinError" style="text-align:center;"></div>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button class="btn-sm btn-outline" onclick="closeChangePinModal()">Annuler</button>' +
                '<button class="btn-sm btn-primary" onclick="submitChangePin()"><i class="fas fa-check"></i> Changer</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    /* --- ABSENCES --- */
    '<div class="modal-overlay" id="absenceModal">' +
        '<div class="modal" style="max-width:720px;">' +
            '<div class="modal-header">' +
                '<h3 id="absenceModalTitle"><i class="fas fa-calendar-times"></i> Absences</h3>' +
                '<button class="modal-close" onclick="closeAbsenceModal()">×</button>' +
            '</div>' +
            '<div class="modal-body">' +
                '<input type="hidden" id="absenceSalarieId">' +
                '<div id="absenceSummary" style="background:var(--gray-50);padding:14px;border-radius:12px;margin-bottom:16px;"></div>' +
                '<div id="absenceList"></div>' +
                '<hr style="margin:16px 0;border:0;border-top:1px solid var(--gray-200);">' +
                '<h4 style="font-size:14px;color:var(--gray-700);margin-bottom:10px;"><i class="fas fa-plus-circle"></i> Ajouter une absence</h4>' +
                '<div class="grid-2">' +
                    '<div><label>Type</label>' +
                        '<select id="absType">' +
                            '<option value="conge_paye">Congés payés</option>' +
                            '<option value="maladie">Maladie</option>' +
                            '<option value="maternite">Maternité</option>' +
                            '<option value="familial">Événement familial</option>' +
                            '<option value="sans_solde">Sans solde</option>' +
                            '<option value="autre_paye">Autre (payé)</option>' +
                            '<option value="autre_non_paye">Autre (non payé)</option>' +
                        '</select>' +
                    '</div>' +
                    '<div><label>Mois</label><input type="month" id="absMois"></div>' +
                    '<div><label>Date début</label><input type="date" id="absDateDebut"></div>' +
                    '<div><label>Date fin</label><input type="date" id="absDateFin"></div>' +
                    '<div><label>Jours</label><input type="number" id="absJours" step="0.5" min="0.5" placeholder="Auto"></div>' +
                    '<div><label>Motif</label><input type="text" id="absMotif" placeholder="Optionnel"></div>' +
                '</div>' +
                '<button class="btn-sm btn-primary" onclick="saveAbsence()" style="width:100%;justify-content:center;margin-top:14px;">' +
                    '<i class="fas fa-save"></i> Enregistrer l\\'absence' +
                '</button>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button class="btn-sm btn-outline" onclick="closeAbsenceModal()">Fermer</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    /* --- RECHERCHE GLOBALE --- */
    '<div class="modal-overlay" id="searchModal">' +
        '<div class="modal" style="max-width:600px;">' +
            '<div class="modal-header"><h3><i class="fas fa-search"></i> Recherche globale</h3><button class="modal-close" onclick="closeGlobalSearch()">×</button></div>' +
            '<div class="modal-body">' +
                '<input type="text" id="globalSearchInput" placeholder="Rechercher un salarié, une archive..." style="font-size:16px;padding:14px;">' +
                '<div id="globalSearchResults" style="margin-top:16px;"></div>' +
            '</div>' +
        '</div>' +
    '</div>';