/* ============================================================
   12-ARCHIVES - Archives + évolution
   ============================================================ */

function renderArchives() {
    const list = document.getElementById('archivesList');
    const empty = document.getElementById('archivesEmpty');
    const globalActions = document.getElementById('archivesGlobalActions');
    const evoContainer = document.getElementById('evoContainer');
    if (!list) return;
    const archives = getArchives();
    if (archives.length === 0) {
        list.innerHTML = ''; empty.style.display = 'block';
        globalActions.style.display = 'none'; evoContainer.innerHTML = '';
        return;
    }
    empty.style.display = 'none'; globalActions.style.display = 'block';
    const sorted = [].concat(archives).sort((a, b) => b.mois.localeCompare(a.mois));
    if (sorted.length >= 2) evoContainer.innerHTML = renderEvolution(sorted);
    else evoContainer.innerHTML = '';
    let html = '';
    sorted.forEach(a => {
        const parts = a.mois.split('-');
        const y = parts[0], m = parts[1];
        const mName = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'][parseInt(m, 10) - 1];
        const dateArch = new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        html += '<div class="archive-card">' +
            '<div class="badge"><div class="m">' + mName + '</div><div class="y">' + y + '</div></div>' +
            '<div class="info">' +
                '<div class="title">Paie ' + a.moisFr + '</div>' +
                '<div class="meta">' +
                    '<span><i class="fas fa-users"></i> <strong>' + a.totaux.nb + '</strong> salarié(s)</span>' +
                    '<span><i class="fas fa-money-bill-wave"></i> Brut : <strong>' + a.totaux.brut.toLocaleString('fr-FR') + ' F</strong></span>' +
                    '<span><i class="fas fa-hand-holding-usd"></i> Net : <strong>' + a.totaux.net.toLocaleString('fr-FR') + ' F</strong></span>' +
                    '<span><i class="fas fa-calendar"></i> Archivé le ' + dateArch + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="actions">' +
                '<button class="btn-open" onclick="openArchive(\'' + a.mois + '\')"><i class="fas fa-eye"></i> Voir</button>' +
                '<button class="btn-pdf-arch" onclick="pdfArchive(\'' + a.mois + '\')"><i class="fas fa-file-pdf"></i> PDF</button>' +
                '<button class="btn-restore" onclick="restoreArchive(\'' + a.mois + '\')"><i class="fas fa-undo"></i> Restaurer</button>' +
                '<button class="btn-del-arch" onclick="deleteArchive(\'' + a.mois + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    });
    list.innerHTML = html;
}

function renderEvolution(sorted) {
    const recent = [].concat(sorted).slice(0, 6).reverse();
    const maxBrut = Math.max.apply(null, recent.map(a => a.totaux.brut));
    let barsHtml = '', labelsHtml = '';
    recent.forEach(a => {
        const h = (a.totaux.brut / maxBrut) * 100;
        const parts = a.mois.split('-');
        const y = parts[0], m = parts[1];
        const mName = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'][parseInt(m, 10) - 1];
        barsHtml += '<div class="evo-bar-wrap"><div class="evo-bar-val">' + (a.totaux.brut / 1000).toFixed(0) + 'k</div><div class="evo-bar" style="height:' + Math.max(h, 4) + '%" title="' + a.totaux.brut.toLocaleString('fr-FR') + ' F"></div></div>';
        labelsHtml += '<div class="evo-lbl">' + mName + ' ' + y.slice(-2) + '</div>';
    });
    let evolution = '';
    if (sorted.length >= 2) {
        const last = sorted[0].totaux.brut, prev = sorted[1].totaux.brut;
        const pct = prev > 0 ? ((last - prev) / prev) * 100 : 0;
        const cls = pct > 0 ? 'up' : (pct < 0 ? 'down' : 'flat');
        const icon = pct > 0 ? 'fa-arrow-up' : (pct < 0 ? 'fa-arrow-down' : 'fa-minus');
        evolution = '<div class="spark-line ' + cls + '" style="margin-left:auto;"><i class="fas ' + icon + '"></i> ' + (pct > 0 ? '+' : '') + pct.toFixed(1) + '% vs ' + sorted[1].moisFr + '</div>';
    }
    return '<div class="evo-card">' +
        '<h3 style="display:flex;align-items:center;"><i class="fas fa-chart-line" style="color:var(--primary);"></i> Évolution masse salariale ' + evolution + '</h3>' +
        '<div class="evo-bars">' + barsHtml + '</div>' +
        '<div class="evo-labels">' + labelsHtml + '</div>' +
    '</div>';
}

function openArchive(mois) {
    const a = getArchives().find(x => x.mois === mois);
    if (!a) return;
    let lignesHtml = '';
    a.lignes.forEach(l => {
        lignesHtml += '<tr>' +
            '<td>' + escapeHtml(l.matricule || '—') + '</td>' +
            '<td><strong>' + escapeHtml(l.prenom) + ' ' + escapeHtml(l.nom).toUpperCase() + '</strong></td>' +
            '<td>' + escapeHtml(l.poste || '—') + '</td>' +
            '<td>' + (l.joursAbsents || 0) + ' j</td>' +
            '<td>' + l.brut.toLocaleString('fr-FR') + ' F</td>' +
            '<td>' + l.cnss.toLocaleString('fr-FR') + ' F</td>' +
            '<td>' + l.its.toLocaleString('fr-FR') + ' F</td>' +
            '<td>' + l.net.toLocaleString('fr-FR') + ' F</td>' +
        '</tr>';
    });
    const html = '<div class="arch-detail">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">' +
            '<div>' +
                '<div class="arch-title">Paie ' + a.moisFr + '</div>' +
                '<div class="arch-sub">Archivée le ' + new Date(a.date).toLocaleString('fr-FR') + '</div>' +
            '</div>' +
            '<button class="btn-sm btn-outline" onclick="closeArchiveDetail()"><i class="fas fa-times"></i> Fermer</button>' +
        '</div>' +
        '<div class="grid-totaux">' +
            '<div class="t"><div class="lbl">Effectif</div><div class="val">' + a.totaux.nb + '</div></div>' +
            '<div class="t"><div class="lbl">Masse brute</div><div class="val">' + a.totaux.brut.toLocaleString('fr-FR') + ' F</div></div>' +
            '<div class="t"><div class="lbl">CNSS</div><div class="val">' + a.totaux.cnss.toLocaleString('fr-FR') + ' F</div></div>' +
            '<div class="t"><div class="lbl">ITS</div><div class="val">' + a.totaux.its.toLocaleString('fr-FR') + ' F</div></div>' +
            '<div class="t"><div class="lbl">Masse nette</div><div class="val">' + a.totaux.net.toLocaleString('fr-FR') + ' F</div></div>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
            '<table class="arch-table">' +
                '<thead><tr><th>Matricule</th><th>Salarié</th><th>Poste</th><th>Abs.</th><th>Brut</th><th>CNSS</th><th>ITS</th><th>Net</th></tr></thead>' +
                '<tbody>' + lignesHtml + '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>';
    document.getElementById('archivesList').innerHTML = html;
    document.getElementById('evoContainer').style.display = 'none';
    document.getElementById('archivesGlobalActions').style.display = 'none';
}

function closeArchiveDetail() {
    document.getElementById('evoContainer').style.display = 'block';
    document.getElementById('archivesGlobalActions').style.display = 'block';
    renderArchives();
}

function pdfArchive(mois) {
    const a = getArchives().find(x => x.mois === mois);
    if (!a) return;
    const doc = new jspdf.jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, pageWidth, 65, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('JOURNAL DE PAIE (ARCHIVE)', margin, 40);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(a.moisFr, pageWidth - margin, 40, { align: 'right' });
    let y = 90;
    doc.setTextColor(20, 20, 20); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(state.template.entreprise, margin, y); y += 16;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(state.template.adresse, margin, y); y += 14;
    doc.text('Archivé le ' + new Date(a.date).toLocaleString('fr-FR'), margin, y); y += 24;
    doc.setFillColor(248, 249, 250); doc.roundedRect(margin, y, pageWidth - 2 * margin, 70, 6, 6, 'F');
    doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.setFont('helvetica', 'normal');
    doc.text('Effectif', margin + 16, y + 22);
    doc.text('Masse brute', margin + 140, y + 22);
    doc.text('Retenues', margin + 280, y + 22);
    doc.text('Masse nette', margin + 420, y + 22);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text(String(a.totaux.nb), margin + 16, y + 52);
    doc.text(a.totaux.brut.toLocaleString('fr-FR') + ' F', margin + 140, y + 52);
    doc.text((a.totaux.cnss + a.totaux.its).toLocaleString('fr-FR') + ' F', margin + 280, y + 52);
    doc.text(a.totaux.net.toLocaleString('fr-FR') + ' F', margin + 420, y + 52);
    y += 90;
    const rows = a.lignes.map(l => [
        l.matricule || '—', l.prenom + ' ' + l.nom.toUpperCase(),
        (l.joursAbsents || 0) > 0 ? l.joursAbsents + ' j' : '—',
        l.brut.toLocaleString('fr-FR'), l.cnss.toLocaleString('fr-FR'),
        l.its.toLocaleString('fr-FR'), l.net.toLocaleString('fr-FR')
    ]);
    doc.autoTable({
        startY: y,
        head: [['Matricule', 'Salarié', 'Abs.', 'Brut', 'CNSS', 'ITS', 'Net à payer']],
        body: rows,
        foot: [['', 'TOTAL', '', a.totaux.brut.toLocaleString('fr-FR'), a.totaux.cnss.toLocaleString('fr-FR'), a.totaux.its.toLocaleString('fr-FR'), a.totaux.net.toLocaleString('fr-FR')]],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, cellPadding: 7 },
        footStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' }, 2: { halign: 'center', cellWidth: 40 }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right', fontStyle: 'bold' } }
    });
    doc.save('Archive_Paie_' + a.mois + '.pdf');
    showToast('✅ Archive PDF générée');
}

function restoreArchive(mois) {
    const ent = getEntrepriseActive();
    if (!ent) return;
    const a = (ent.archives || []).find(x => x.mois === mois);
    if (!a) return;
    if (!confirm('Restaurer la paie de ' + a.moisFr + ' ?')) return;
    let created = 0;
    a.lignes.forEach(l => {
        const exists = (ent.salaries || []).find(s =>
            (s.matricule && l.matricule && s.matricule === l.matricule) ||
            (s.nom === l.nom && s.prenom === l.prenom));
        if (!exists) {
            ent.salaries.push({
                id: generateId('sal'), nom: l.nom, prenom: l.prenom,
                matricule: l.matricule, poste: l.poste,
                contrat: 'CDI', dateEmbauche: '',
                salaireBase: l.brut - ((l.primes && l.primes.transport) || 0) - ((l.primes && l.primes.logement) || 0) - ((l.primes && l.primes.anciennete) || 0) - ((l.primes && l.primes.heuresSup) || 0),
                primeTransport: (l.primes && l.primes.transport) || 0,
                primeLogement: (l.primes && l.primes.logement) || 0,
                primeAnciennete: (l.primes && l.primes.anciennete) || 0,
                primeHeuresSup: (l.primes && l.primes.heuresSup) || 0,
                absences: [], createdAt: new Date().toISOString()
            });
            created++;
        }
    });
    saveState();
    refreshAllViews();
    document.getElementById('regMois').value = a.mois;
    renderRegistre();
    switchTab('registre');
    showToast(created > 0 ? '♻️ Paie restaurée (' + created + ' créé(s))' : '♻️ Restaurée');
}

function deleteArchive(mois) {
    const ent = getEntrepriseActive();
    if (!ent) return;
    const a = (ent.archives || []).find(x => x.mois === mois);
    if (!a) return;
    if (!confirm('Supprimer l\'archive de ' + a.moisFr + ' ?')) return;
    ent.archives = (ent.archives || []).filter(x => x.mois !== mois);
    saveState();
    refreshAllViews();
    showToast('🗑️ Archive supprimée');
}

function exportArchivesGlobalCSV() {
    const archives = getArchives();
    if (!archives || archives.length === 0) { alert('Aucune archive.'); return; }
    const sorted = [].concat(archives).sort((a, b) => a.mois.localeCompare(b.mois));
    let csv = 'Mois;Effectif;Masse brute;CNSS;ITS;Masse nette\n';
    sorted.forEach(a => {
        csv += [a.moisFr, a.totaux.nb, a.totaux.brut, a.totaux.cnss, a.totaux.its, a.totaux.net].join(';') + '\n';
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Historique_paies.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📤 Historique exporté');
}