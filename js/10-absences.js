/* ============================================================
   10-ABSENCES - Module absences & congés
   ============================================================ */

function openAbsenceModal(salarieId) {
    const s = getSalaries().find(x => x.id === salarieId);
    if (!s) return;
    document.getElementById('absenceSalarieId').value = salarieId;
    document.getElementById('absenceModalTitle').innerHTML = '<i class="fas fa-calendar-times"></i> Absences — ' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase();
    const now = new Date();
    document.getElementById('absMois').value = now.toISOString().slice(0, 7);
    document.getElementById('absDateDebut').value = now.toISOString().split('T')[0];
    document.getElementById('absDateFin').value = now.toISOString().split('T')[0];
    document.getElementById('absJours').value = '';
    document.getElementById('absMotif').value = '';
    renderAbsenceModal();
    document.getElementById('absenceModal').classList.add('show');
}

function closeAbsenceModal() {
    document.getElementById('absenceModal').classList.remove('show');
}

function renderAbsenceModal() {
    const salarieId = document.getElementById('absenceSalarieId').value;
    const s = getSalaries().find(x => x.id === salarieId);
    if (!s) return;
    const solde = calculerSoldeConges(s);
    const absences = s.absences || [];
    const moisSel = document.getElementById('absMois').value;
    const absencesCeMois = absences.filter(a => a.mois === moisSel);
    const joursCeMois = absencesCeMois.reduce((sum, a) => sum + (a.jours || 0), 0);

    document.getElementById('absenceSummary').innerHTML =
        '<div class="absence-summary-grid">' +
            '<div class="item primary"><div class="lbl">CP cumulés</div><div class="val">' + solde.cumule + ' j</div></div>' +
            '<div class="item warning"><div class="lbl">CP pris</div><div class="val">' + solde.pris + ' j</div></div>' +
            '<div class="item success"><div class="lbl">Solde CP</div><div class="val">' + solde.solde + ' j</div></div>' +
            '<div class="item danger"><div class="lbl">Abs. ce mois</div><div class="val">' + joursCeMois + ' j</div></div>' +
        '</div>';

    const list = document.getElementById('absenceList');
    if (absences.length === 0) {
        list.innerHTML = '<div class="empty-absences"><i class="fas fa-calendar-check" style="font-size:32px;display:block;margin-bottom:8px;color:var(--gray-300);"></i>Aucune absence enregistrée</div>';
        return;
    }
    const sorted = [].concat(absences).sort((a, b) => b.dateDebut.localeCompare(a.dateDebut));
    let html = '';
    sorted.forEach(a => {
        const type = ABSENCE_TYPES[a.type] || { label: a.type, paye: true };
        const payeLabel = type.paye ? '💚 Payé' : '🔴 Non payé';
        const dateRange = a.dateDebut === a.dateFin ? formatDateFr(a.dateDebut) : formatDateFr(a.dateDebut) + ' → ' + formatDateFr(a.dateFin);
        html += '<div class="absence-item">' +
            '<span class="abs-badge ' + a.type + '">' + type.label + '</span>' +
            '<div class="abs-info">' +
                '<div class="main">' + dateRange + ' — ' + a.jours + ' jour(s)</div>' +
                '<div class="sub">' + formatMoisFr(a.mois) + ' • ' + payeLabel + (a.motif ? ' • ' + escapeHtml(a.motif) : '') + '</div>' +
            '</div>' +
            '<button class="abs-delete" onclick="deleteAbsence(\'' + a.id + '\')"><i class="fas fa-trash"></i></button>' +
        '</div>';
    });
    list.innerHTML = html;
}

function saveAbsence() {
    const salarieId = document.getElementById('absenceSalarieId').value;
    const ent = getEntrepriseActive();
    if (!ent) return;
    const s = (ent.salaries || []).find(x => x.id === salarieId);
    if (!s) return;
    const type = document.getElementById('absType').value;
    const mois = document.getElementById('absMois').value;
    const dateDebut = document.getElementById('absDateDebut').value;
    const dateFin = document.getElementById('absDateFin').value;
    const motif = document.getElementById('absMotif').value.trim();
    let jours = parseFloat(document.getElementById('absJours').value);
    if (!mois) { alert('Veuillez choisir un mois.'); return; }
    if (!dateDebut || !dateFin) { alert('Dates obligatoires.'); return; }
    if (dateFin < dateDebut) { alert('Date fin doit être après début.'); return; }
    if (isNaN(jours) || jours <= 0) {
        const d1 = new Date(dateDebut), d2 = new Date(dateFin);
        jours = Math.round(((d2 - d1) / (1000 * 60 * 60 * 24) + 1) * 10) / 10;
    }
    const typeInfo = ABSENCE_TYPES[type];
    if (typeInfo.decompteCP) {
        const solde = calculerSoldeConges(s);
        if (jours > solde.solde) {
            if (!confirm('⚠️ Le salarié n\'a que ' + solde.solde + ' jour(s) de CP.\n\nContinuer ?')) return;
        }
    }
    const absence = {
        id: generateId('abs'), type: type, paye: typeInfo.paye,
        mois: mois, dateDebut: dateDebut, dateFin: dateFin,
        jours: jours, motif: motif, createdAt: new Date().toISOString()
    };
    if (!s.absences) s.absences = [];
    s.absences.push(absence);
    saveState();
    renderAbsenceModal();
    refreshAllViews();
    showToast('✅ Absence enregistrée');
    document.getElementById('absJours').value = '';
    document.getElementById('absMotif').value = '';
}

function deleteAbsence(absenceId) {
    const salarieId = document.getElementById('absenceSalarieId').value;
    const ent = getEntrepriseActive();
    if (!ent) return;
    const s = (ent.salaries || []).find(x => x.id === salarieId);
    if (!s || !s.absences) return;
    const abs = s.absences.find(a => a.id === absenceId);
    if (!abs) return;
    if (!confirm('Supprimer l\'absence du ' + formatDateFr(abs.dateDebut) + ' ?')) return;
    s.absences = s.absences.filter(a => a.id !== absenceId);
    saveState();
    renderAbsenceModal();
    refreshAllViews();
    showToast('🗑️ Supprimée');
}

function initAbsenceAutoCalc() {
    const dDebut = document.getElementById('absDateDebut');
    const dFin = document.getElementById('absDateFin');
    if (!dDebut || !dFin) return;
    function updateJours() {
        if (dDebut.value && dFin.value && dFin.value >= dDebut.value) {
            const d1 = new Date(dDebut.value), d2 = new Date(dFin.value);
            const jours = Math.round(((d2 - d1) / (1000 * 60 * 60 * 24) + 1) * 10) / 10;
            document.getElementById('absJours').value = jours;
        }
    }
    dDebut.addEventListener('change', updateJours);
    dFin.addEventListener('change', updateJours);
}

/* ----- Vue globale absences ----- */
function renderAbsencesGlobal() {
    const moisInput = document.getElementById('absGlobalMois');
    if (!moisInput) return;
    if (!moisInput.value) moisInput.value = new Date().toISOString().slice(0, 7);
    const mois = moisInput.value;
    const list = document.getElementById('absencesGlobalList');
    const salaries = getSalaries();
    let nbSalaries = 0, totalJours = 0, totalRetenues = 0;
    let html = '';
    salaries.forEach(s => {
        const absencesMois = (s.absences || []).filter(a => a.mois === mois);
        if (absencesMois.length === 0) return;
        nbSalaries++;
        const jours = absencesMois.reduce((sum, a) => sum + (a.jours || 0), 0);
        const joursNP = absencesMois.filter(a => !a.paye).reduce((sum, a) => sum + (a.jours || 0), 0);
        const totalPrimes = (s.primeTransport || 0) + (s.primeLogement || 0) + (s.primeAnciennete || 0) + (s.primeHeuresSup || 0);
        const salaireMensuel = (s.salaireBase || 0) + totalPrimes;
        const retenue = Math.round(salaireMensuel / (state.joursOuvrables || 30) * joursNP);
        totalJours += jours;
        totalRetenues += retenue;
        let itemsHtml = '';
        absencesMois.forEach(a => {
            const type = ABSENCE_TYPES[a.type] || { label: a.type, paye: true };
            const dateRange = a.dateDebut === a.dateFin ? formatDateFr(a.dateDebut) : formatDateFr(a.dateDebut) + ' → ' + formatDateFr(a.dateFin);
            itemsHtml += '<div class="absence-item">' +
                '<span class="abs-badge ' + a.type + '">' + type.label + '</span>' +
                '<div class="abs-info"><div class="main">' + dateRange + ' — ' + a.jours + ' j</div><div class="sub">' + (type.paye ? '💚 Payé' : '🔴 Non payé') + (a.motif ? ' • ' + escapeHtml(a.motif) : '') + '</div></div>' +
                '<button class="abs-delete" onclick="openAbsenceModal(\'' + s.id + '\')"><i class="fas fa-edit"></i></button>' +
            '</div>';
        });
        html += '<div class="abs-global-card">' +
            '<div class="head">' +
                '<div class="name">' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase() + (s.matricule ? ' • ' + escapeHtml(s.matricule) : '') + '</div>' +
                '<div class="totaux">' +
                    '<span><i class="fas fa-calendar-day"></i> <strong>' + jours + ' j</strong></span>' +
                    (retenue > 0 ? '<span><i class="fas fa-minus-circle" style="color:var(--danger);"></i> Retenue: <strong>' + retenue.toLocaleString('fr-FR') + ' F</strong></span>' : '') +
                '</div>' +
            '</div>' +
            '<div class="list">' + itemsHtml + '</div>' +
        '</div>';
    });
    if (html === '') {
        list.innerHTML = '<div class="empty-archives"><i class="fas fa-calendar-check"></i><p>Aucune absence ce mois</p></div>';
    } else {
        list.innerHTML = html;
    }
    document.getElementById('absStatSalaries').textContent = nbSalaries;
    document.getElementById('absStatJours').textContent = totalJours;
    document.getElementById('absStatRetenues').textContent = totalRetenues.toLocaleString('fr-FR') + ' F';
}

function exportAbsencesCSV() {
    const mois = document.getElementById('absGlobalMois').value || new Date().toISOString().slice(0, 7);
    let csv = 'Matricule;Nom;Prenom;Poste;Type;DateDebut;DateFin;Jours;Paye;Motif\n';
    let count = 0;
    getSalaries().forEach(s => {
        (s.absences || []).filter(a => a.mois === mois).forEach(a => {
            const type = ABSENCE_TYPES[a.type] || { label: a.type, paye: true };
            csv += [s.matricule || '', s.nom, s.prenom, s.poste || '', type.label, a.dateDebut, a.dateFin, a.jours, type.paye ? 'Oui' : 'Non', a.motif || '']
                .map(v => String(v).includes(';') ? '"' + v + '"' : v).join(';') + '\n';
            count++;
        });
    });
    if (count === 0) { alert('Aucune absence ce mois.'); return; }
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Absences_' + mois + '.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📤 ' + count + ' absence(s) exportée(s)');
}