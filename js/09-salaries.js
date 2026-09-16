/* ============================================================
   09-SALARIES - CRUD salariés + Import/Export CSV
   ============================================================ */

function getFilteredSalaries() {
    const q = (document.getElementById('searchSalary') ? document.getElementById('searchSalary').value : '').toLowerCase().trim();
    const salaries = getSalaries();
    if (!q) return salaries;
    return salaries.filter(s =>
        (s.nom || '').toLowerCase().includes(q) ||
        (s.prenom || '').toLowerCase().includes(q) ||
        (s.matricule || '').toLowerCase().includes(q) ||
        (s.poste || '').toLowerCase().includes(q));
}

function renderSalaries() {
    const container = document.getElementById('salariesList');
    if (!container) return;
    const salaries = getSalaries();
    if (salaries.length === 0) {
        container.innerHTML = '<div class="empty-salaries"><i class="fas fa-users-slash"></i><p>Aucun salarié enregistré</p><p style="font-size:12px;margin-top:6px;color:var(--gray-500);">Sélectionnez une entreprise puis ajoutez un salarié</p></div>';
        return;
    }
    const list = getFilteredSalaries();
    if (list.length === 0) {
        container.innerHTML = '<div class="empty-salaries"><i class="fas fa-search"></i><p>Aucun résultat</p></div>';
        return;
    }
    let html = '';
    list.forEach(s => {
        const totalPrimes = (s.primeTransport || 0) + (s.primeLogement || 0) + (s.primeAnciennete || 0) + (s.primeHeuresSup || 0);
        const brutTotal = (s.salaireBase || 0) + totalPrimes;
        const nbAbs = (s.absences || []).length;
        html += '<div class="salary-card"><div class="info">' +
            '<div class="name">' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase() + '</div>' +
            '<div class="meta">' +
                (s.matricule ? '<span><i class="fas fa-id-card"></i> ' + escapeHtml(s.matricule) + '</span>' : '') +
                (s.poste ? '<span><i class="fas fa-briefcase"></i> ' + escapeHtml(s.poste) + '</span>' : '') +
                (s.contrat ? '<span><i class="fas fa-file-signature"></i> ' + escapeHtml(s.contrat) + '</span>' : '') +
            '</div>' +
            '<div class="meta" style="margin-top:4px;">' +
                '<span><i class="fas fa-money-bill"></i> Base: <strong>' + (s.salaireBase || 0).toLocaleString('fr-FR') + ' F</strong></span>' +
                (totalPrimes > 0 ? '<span><i class="fas fa-plus"></i> Primes: <strong>' + totalPrimes.toLocaleString('fr-FR') + ' F</strong></span>' : '') +
                '<span style="color:var(--primary);"><i class="fas fa-calculator"></i> Brut total: <strong>' + brutTotal.toLocaleString('fr-FR') + ' F</strong></span>' +
            '</div>' +
            '</div><div class="actions">' +
                '<button class="btn-calc" onclick="useForFiche(\'' + s.id + '\')"><i class="fas fa-palette"></i> Fiche</button>' +
                '<button class="btn-pdf-sm" onclick="pdfForSalary(\'' + s.id + '\')"><i class="fas fa-file-pdf"></i> PDF</button>' +
                '<button class="btn-abs" onclick="openAbsenceModal(\'' + s.id + '\')"><i class="fas fa-calendar-times"></i> Absences' + (nbAbs > 0 ? ' (' + nbAbs + ')' : '') + '</button>' +
                '<button onclick="editSalary(\'' + s.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-del" onclick="deleteSalary(\'' + s.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div></div>';
    });
    container.innerHTML = html;
}

function openSalaryModal(id) {
    if (!getEntrepriseActive()) { alert("Créez d'abord une entreprise."); return; }
    document.getElementById('salaryModalTitle').innerHTML = id ? '<i class="fas fa-user-edit"></i> Modifier' : '<i class="fas fa-user-plus"></i> Ajouter';
    document.getElementById('salaryId').value = id || '';
    if (id) {
        const s = getSalaries().find(x => x.id === id);
        if (s) {
            document.getElementById('salNom').value = s.nom || '';
            document.getElementById('salPrenom').value = s.prenom || '';
            document.getElementById('salMatricule').value = s.matricule || '';
            document.getElementById('salPoste').value = s.poste || '';
            document.getElementById('salContrat').value = s.contrat || 'CDI';
            document.getElementById('salDateEmbauche').value = s.dateEmbauche || '';
            document.getElementById('salSalaireBase').value = s.salaireBase || '';
            document.getElementById('salPrimeTransport').value = s.primeTransport || 0;
            document.getElementById('salPrimeLogement').value = s.primeLogement || 0;
            document.getElementById('salPrimeAnciennete').value = s.primeAnciennete || 0;
            document.getElementById('salPrimeHeuresSup').value = s.primeHeuresSup || 0;
        }
    } else {
        ['salNom', 'salPrenom', 'salMatricule', 'salPoste', 'salSalaireBase'].forEach(i => {
            const el = document.getElementById(i);
            if (el) el.value = '';
        });
        document.getElementById('salContrat').value = 'CDI';
        document.getElementById('salDateEmbauche').value = new Date().toISOString().split('T')[0];
        ['salPrimeTransport', 'salPrimeLogement', 'salPrimeAnciennete', 'salPrimeHeuresSup'].forEach(i => {
            const el = document.getElementById(i);
            if (el) el.value = 0;
        });
    }
    document.getElementById('salaryModal').classList.add('show');
}

function closeSalaryModal() {
    document.getElementById('salaryModal').classList.remove('show');
}

function saveSalary() {
    const ent = getEntrepriseActive();
    if (!ent) { alert('Aucune entreprise active.'); return; }
    const id = document.getElementById('salaryId').value;
    const nom = document.getElementById('salNom').value.trim();
    const prenom = document.getElementById('salPrenom').value.trim();
    const salaireBase = parseFloat(document.getElementById('salSalaireBase').value);
    if (!nom || !prenom) { alert('Nom et prénom obligatoires.'); return; }
    if (isNaN(salaireBase) || salaireBase <= 0) { alert('Salaire obligatoire.'); return; }
    const data = {
        nom: nom, prenom: prenom,
        matricule: document.getElementById('salMatricule').value.trim(),
        poste: document.getElementById('salPoste').value.trim(),
        contrat: document.getElementById('salContrat').value,
        dateEmbauche: document.getElementById('salDateEmbauche').value,
        salaireBase: salaireBase,
        primeTransport: parseFloat(document.getElementById('salPrimeTransport').value) || 0,
        primeLogement: parseFloat(document.getElementById('salPrimeLogement').value) || 0,
        primeAnciennete: parseFloat(document.getElementById('salPrimeAnciennete').value) || 0,
        primeHeuresSup: parseFloat(document.getElementById('salPrimeHeuresSup').value) || 0
    };
    const salaries = ent.salaries || [];
    if (id) {
        const idx = salaries.findIndex(x => x.id === id);
        if (idx >= 0) salaries[idx] = Object.assign({}, salaries[idx], data);
        showToast('✅ Modifié');
    } else {
        salaries.push(Object.assign({ id: generateId('sal'), absences: [], createdAt: new Date().toISOString() }, data));
        showToast('✅ Ajouté');
    }
    ent.salaries = salaries;
    saveState();
    refreshAllViews();
    closeSalaryModal();
}

function editSalary(id) { openSalaryModal(id); }

function deleteSalary(id) {
    const ent = getEntrepriseActive();
    if (!ent) return;
    const s = (ent.salaries || []).find(x => x.id === id);
    if (!s || !confirm('Supprimer ' + s.prenom + ' ' + s.nom + ' ?')) return;
    ent.salaries = (ent.salaries || []).filter(x => x.id !== id);
    saveState();
    refreshAllViews();
    showToast('🗑️ Supprimé');
}

function useForFiche(id) {
    const s = getSalaries().find(x => x.id === id);
    if (!s) return;
    document.getElementById('stSalarie').value = s.prenom + ' ' + s.nom.toUpperCase();
    document.getElementById('stFonction').value = s.poste || '';
    document.getElementById('stMatricule').value = s.matricule || '';
    document.getElementById('pTransport').value = s.primeTransport || 0;
    document.getElementById('pLogement').value = s.primeLogement || 0;
    document.getElementById('pAnciennete').value = s.primeAnciennete || 0;
    document.getElementById('pHeuresSup').value = s.primeHeuresSup || 0;
    state.lastResult = calculerBrutToNet(s.salaireBase);
    saveState();
    switchTab('fiche');
    updatePreview();
}

function pdfForSalary(id) {
    const s = getSalaries().find(x => x.id === id);
    if (!s) return;
    const moisActuel = document.getElementById('regMois') ? document.getElementById('regMois').value : new Date().toISOString().slice(0, 7);
    document.getElementById('stSalarie').value = s.prenom + ' ' + s.nom.toUpperCase();
    document.getElementById('stFonction').value = s.poste || '';
    document.getElementById('stMatricule').value = s.matricule || '';
    document.getElementById('stPeriode').value = formatMoisFr(moisActuel);
    document.getElementById('pTransport').value = s.primeTransport || 0;
    document.getElementById('pLogement').value = s.primeLogement || 0;
    document.getElementById('pAnciennete').value = s.primeAnciennete || 0;
    document.getElementById('pHeuresSup').value = s.primeHeuresSup || 0;
    const calc = calculerSalariePourMois(
        s.salaireBase,
        { transport: s.primeTransport || 0, logement: s.primeLogement || 0, anciennete: s.primeAnciennete || 0, heuresSup: s.primeHeuresSup || 0 },
        s.absences || [], moisActuel
    );
    state.lastResult = calc.result;
    saveState();
    genererFichePDF();
}

/* ----- Import / Export CSV ----- */
function openImportModal() {
    if (!getEntrepriseActive()) { alert("Créez d'abord une entreprise."); return; }
    document.getElementById('csvInput').value = '';
    document.getElementById('csvFile').value = '';
    document.getElementById('importModal').classList.add('show');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('show');
}

function processImport() {
    const textareaVal = document.getElementById('csvInput').value.trim();
    const file = document.getElementById('csvFile').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => parseCSV(e.target.result);
        reader.readAsText(file, 'UTF-8');
    } else if (textareaVal) parseCSV(textareaVal);
    else alert('Veuillez coller un CSV ou sélectionner un fichier.');
}

function parseCSV(text) {
    const ent = getEntrepriseActive();
    if (!ent) return;
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { alert('CSV invalide.'); return; }
    const sep = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(sep).map(h => h.trim().toLowerCase());
    const idx = {
        nom: headers.findIndex(h => h === 'nom'),
        prenom: headers.findIndex(h => h === 'prenom' || h === 'prénom'),
        matricule: headers.findIndex(h => h === 'matricule'),
        poste: headers.findIndex(h => h === 'poste'),
        salaireBase: headers.findIndex(h => h === 'salairebase' || h.includes('salaire')),
        primeTransport: headers.findIndex(h => h.includes('transport')),
        primeLogement: headers.findIndex(h => h.includes('logement')),
        primeAnciennete: headers.findIndex(h => h.includes('ancien')),
        primeHeuresSup: headers.findIndex(h => h.includes('heure'))
    };
    if (idx.nom === -1 || idx.prenom === -1 || idx.salaireBase === -1) {
        alert('Colonnes obligatoires : nom, prenom, salaireBase');
        return;
    }
    let count = 0;
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(sep).map(c => c.trim());
        const nom = cols[idx.nom], prenom = cols[idx.prenom], salaireBase = parseFloat(cols[idx.salaireBase]);
        if (!nom || !prenom || isNaN(salaireBase)) continue;
        ent.salaries.push({
            id: generateId('sal'), nom: nom, prenom: prenom,
            matricule: idx.matricule >= 0 ? cols[idx.matricule] : '',
            poste: idx.poste >= 0 ? cols[idx.poste] : '',
            contrat: 'CDI', dateEmbauche: '', salaireBase: salaireBase,
            primeTransport: idx.primeTransport >= 0 ? (parseFloat(cols[idx.primeTransport]) || 0) : 0,
            primeLogement: idx.primeLogement >= 0 ? (parseFloat(cols[idx.primeLogement]) || 0) : 0,
            primeAnciennete: idx.primeAnciennete >= 0 ? (parseFloat(cols[idx.primeAnciennete]) || 0) : 0,
            primeHeuresSup: idx.primeHeuresSup >= 0 ? (parseFloat(cols[idx.primeHeuresSup]) || 0) : 0,
            absences: [], createdAt: new Date().toISOString()
        });
        count++;
    }
    saveState();
    refreshAllViews();
    closeImportModal();
    showToast('✅ ' + count + ' salarié(s) importé(s)');
}

function exportSalariesCSV() {
    const salaries = getSalaries();
    if (salaries.length === 0) { alert('Aucun salarié à exporter.'); return; }
    const headers = ['nom', 'prenom', 'matricule', 'poste', 'contrat', 'dateEmbauche', 'salaireBase', 'primeTransport', 'primeLogement', 'primeAnciennete', 'primeHeuresSup'];
    let csv = headers.join(';') + '\n';
    salaries.forEach(s => {
        csv += [s.nom || '', s.prenom || '', s.matricule || '', s.poste || '', s.contrat || '', s.dateEmbauche || '', s.salaireBase || 0, s.primeTransport || 0, s.primeLogement || 0, s.primeAnciennete || 0, s.primeHeuresSup || 0]
            .map(v => String(v).includes(';') ? '"' + v + '"' : v).join(';') + '\n';
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'salaries_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📤 ' + salaries.length + ' exporté(s)');
}