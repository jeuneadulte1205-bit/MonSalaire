/* ============================================================
   11-REGISTRE - Registre mensuel + Journal + Virement + Archive
   ============================================================ */

function renderRegistre() {
    const moisInput = document.getElementById('regMois');
    if (!moisInput) return;
    if (!moisInput.value) moisInput.value = new Date().toISOString().slice(0, 7);
    const mois = moisInput.value;
    const tbody = document.getElementById('registreTableBody');
    const empty = document.getElementById('registreEmpty');
    const salaries = getSalaries();

    if (salaries.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        ['regNbSalaries','regBrut','regRetenues','regNet'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0' + (id !== 'regNbSalaries' ? ' F' : '');
        });
        return;
    }
    empty.style.display = 'none';
    let totalBrut = 0, totalCnss = 0, totalIts = 0, totalNet = 0;
    let html = '';
    const salariesPourMois = [];

    salaries.forEach(s => {
        const calc = calculerSalariePourMois(
            s.salaireBase,
            { transport: s.primeTransport || 0, logement: s.primeLogement || 0, anciennete: s.primeAnciennete || 0, heuresSup: s.primeHeuresSup || 0 },
            s.absences || [], mois
        );
        if (!calc.result) return;
        totalBrut += calc.brutTotal;
        totalCnss += calc.result.cnss;
        totalIts += calc.result.its;
        totalNet += calc.result.net;
        salariesPourMois.push({ salarie: s, calc: calc });
        html += '<tr>' +
            '<td style="color:var(--gray-500);font-size:12px;">' + escapeHtml(s.matricule || '—') + '</td>' +
            '<td style="font-weight:600;">' + escapeHtml(s.prenom) + ' ' + escapeHtml(s.nom).toUpperCase() + '</td>' +
            '<td style="color:var(--gray-500);font-size:12px;">' + escapeHtml(s.poste || '—') + '</td>' +
            '<td class="r" style="font-weight:600;' + (calc.joursAbsentsTotal > 0 ? 'color:#92400e;' : 'color:var(--gray-400);') + '">' + (calc.joursAbsentsTotal > 0 ? calc.joursAbsentsTotal + ' j' : '—') + '</td>' +
            '<td class="r" style="' + (calc.retenueAbsence > 0 ? 'color:var(--danger);font-weight:600;' : 'color:var(--gray-400);') + '">' + (calc.retenueAbsence > 0 ? '-' + calc.retenueAbsence.toLocaleString('fr-FR') + ' F' : '—') + '</td>' +
            '<td class="r" style="font-weight:600;">' + calc.brutTotal.toLocaleString('fr-FR') + ' F</td>' +
            '<td class="r" style="color:var(--danger);">' + calc.result.cnss.toLocaleString('fr-FR') + ' F</td>' +
            '<td class="r" style="color:var(--danger);">' + calc.result.its.toLocaleString('fr-FR') + ' F</td>' +
            '<td class="r" style="font-weight:800;color:var(--primary);">' + calc.result.net.toLocaleString('fr-FR') + ' F</td>' +
            '<td class="c" style="display:flex;gap:4px;justify-content:center;">' +
                '<button class="btn-sm btn-outline" style="padding:6px 8px;font-size:11px;" onclick="openAbsenceModal(\'' + s.id + '\')" title="Absences"><i class="fas fa-calendar-times"></i></button>' +
                '<button class="btn-sm btn-outline" style="padding:6px 8px;font-size:11px;" onclick="pdfSalarieMois(\'' + s.id + '\',\'' + mois + '\')" title="PDF"><i class="fas fa-file-pdf"></i></button>' +
            '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
    document.getElementById('regNbSalaries').textContent = salariesPourMois.length;
    document.getElementById('regBrut').textContent = totalBrut.toLocaleString('fr-FR') + ' F';
    document.getElementById('regRetenues').textContent = (totalCnss + totalIts).toLocaleString('fr-FR') + ' F';
    document.getElementById('regNet').textContent = totalNet.toLocaleString('fr-FR') + ' F';
    registreCache = {
        salaries: salariesPourMois, mois: mois,
        totaux: { brut: totalBrut, cnss: totalCnss, its: totalIts, net: totalNet, nb: salariesPourMois.length }
    };
}

function pdfSalarieMois(salarieId, moisStr) {
    const s = getSalaries().find(x => x.id === salarieId);
    if (!s) return;
    document.getElementById('stSalarie').value = s.prenom + ' ' + s.nom.toUpperCase();
    document.getElementById('stFonction').value = s.poste || '';
    document.getElementById('stMatricule').value = s.matricule || '';
    document.getElementById('stPeriode').value = formatMoisFr(moisStr);
    document.getElementById('pTransport').value = s.primeTransport || 0;
    document.getElementById('pLogement').value = s.primeLogement || 0;
    document.getElementById('pAnciennete').value = s.primeAnciennete || 0;
    document.getElementById('pHeuresSup').value = s.primeHeuresSup || 0;
    const calc = calculerSalariePourMois(
        s.salaireBase,
        { transport: s.primeTransport || 0, logement: s.primeLogement || 0, anciennete: s.primeAnciennete || 0, heuresSup: s.primeHeuresSup || 0 },
        s.absences || [], moisStr
    );
    state.lastResult = calc.result;
    saveState();
    genererFichePDF();
}

function genererToutesFichesPDF() {
    const salaries = getSalaries();
    if (salaries.length === 0) { alert('Aucun salarié.'); return; }
    const mois = document.getElementById('regMois').value || new Date().toISOString().slice(0, 7);
    const moisFr = formatMoisFr(mois);
    const doc = new jspdf.jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let isFirstPage = true;
    const tpl = state.template;
    const hexToRgb = (hex) => {
        const h = hex.replace('#', '');
        return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
    };
    const primaryRGB = hexToRgb(tpl.primaryColor);

    salaries.forEach((s, idx) => {
        if (!isFirstPage) doc.addPage();
        isFirstPage = false;
        const calc = calculerSalariePourMois(
            s.salaireBase,
            { transport: s.primeTransport || 0, logement: s.primeLogement || 0, anciennete: s.primeAnciennete || 0, heuresSup: s.primeHeuresSup || 0 },
            s.absences || [], mois
        );
        if (!calc.result) return;
        doc.setFillColor.apply(doc, primaryRGB);
        doc.rect(0, 0, pageWidth, 60, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
        doc.text('FICHE DE PAIE', margin, 38);
        doc.setFontSize(11); doc.setFont('helvetica', 'normal');
        doc.text(tpl.entreprise + '  •  ' + moisFr, pageWidth - margin, 38, { align: 'right' });
        let y = 90;
        doc.setTextColor(20, 20, 20); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text(s.prenom + ' ' + s.nom.toUpperCase(), margin, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
        doc.text(s.poste || '—', margin, y + 14);
        if (s.matricule) doc.text('Matricule: ' + s.matricule, pageWidth - margin, y, { align: 'right' });
        y += 32;
        doc.setDrawColor.apply(doc, primaryRGB); doc.setLineWidth(1.5);
        doc.line(margin, y, pageWidth - margin, y); y += 16;
        const tableData = [];
        tableData.push(['Salaire de base', calc.result.brut.toLocaleString('fr-FR') + ' FCFA']);
        if ((s.primeTransport || 0) > 0) tableData.push(['Prime transport', s.primeTransport.toLocaleString('fr-FR') + ' FCFA']);
        if ((s.primeLogement || 0) > 0) tableData.push(['Prime logement', s.primeLogement.toLocaleString('fr-FR') + ' FCFA']);
        if ((s.primeAnciennete || 0) > 0) tableData.push(['Prime ancienneté', s.primeAnciennete.toLocaleString('fr-FR') + ' FCFA']);
        if ((s.primeHeuresSup || 0) > 0) tableData.push(['Heures supplémentaires', s.primeHeuresSup.toLocaleString('fr-FR') + ' FCFA']);
        if (calc.retenueAbsence > 0) tableData.push(['Absences (' + calc.joursNonPayes + ' j non payés)', '- ' + calc.retenueAbsence.toLocaleString('fr-FR') + ' FCFA']);
        tableData.push(['Salaire Brut total', calc.brutTotal.toLocaleString('fr-FR') + ' FCFA']);
        tableData.push(['Base imposable', calc.result.baseImposable.toLocaleString('fr-FR') + ' FCFA']);
        tableData.push(['CNSS (3,6%)', '- ' + calc.result.cnss.toLocaleString('fr-FR') + ' FCFA']);
        tableData.push(['ITS', '- ' + calc.result.its.toLocaleString('fr-FR') + ' FCFA']);
        tableData.push(['NET À PAYER', calc.result.net.toLocaleString('fr-FR') + ' FCFA']);
        doc.autoTable({
            startY: y, head: [['Désignation', 'Montant']], body: tableData, theme: 'striped',
            headStyles: { fillColor: primaryRGB, textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
            bodyStyles: { fontSize: 11, cellPadding: 8 },
            columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 180, halign: 'right' } },
            didParseCell: (data) => {
                if (data.section === 'body' && data.row.index === tableData.length - 1) {
                    data.cell.styles.fillColor = primaryRGB;
                    data.cell.styles.textColor = [255, 255, 255];
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fontSize = 13;
                }
            }
        });
        y = doc.lastAutoTable.finalY + 30;
        if (tpl.showSignature) {
            const colW = (pageWidth - 2 * margin - 40) / 2;
            doc.setFontSize(9); doc.setTextColor(120, 120, 120); doc.setFont('helvetica', 'normal');
            doc.text("Signature de l'employeur", margin, y);
            doc.text("Signature de l'employé", margin + colW + 40, y);
            y += 50; doc.setDrawColor(150, 150, 150); doc.setLineWidth(.5);
            doc.line(margin, y, margin + colW, y);
            doc.line(margin + colW + 40, y, margin + 2 * colW + 40, y);
            y += 12; doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(40, 40, 40);
            doc.text(tpl.signature, margin, y);
            doc.text(tpl.signatureEmp || "L'Employé", margin + colW + 40, y);
        }
        doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(150, 150, 150);
        doc.text('Fiche ' + (idx + 1) + '/' + salaries.length + ' — ' + tpl.footer, pageWidth / 2, pageHeight - 20, { align: 'center' });
    });
    doc.save('Fiches_paie_' + mois + '.pdf');
    state.pdfCount = (state.pdfCount || 0) + salaries.length;
    saveState();
    mettreAJourDashboard();
    showToast('✅ ' + salaries.length + ' fiches générées');
}

function genererJournalPaiePDF() {
    if (!registreCache.totaux || registreCache.salaries.length === 0) { alert('Aucun salarié.'); return; }
    const salaries = registreCache.salaries;
    const totaux = registreCache.totaux;
    const mois = registreCache.mois;
    const moisFr = formatMoisFr(mois);
    const doc = new jspdf.jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, pageWidth, 65, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('JOURNAL DE PAIE', margin, 40);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(moisFr, pageWidth - margin, 40, { align: 'right' });
    let y = 90;
    doc.setTextColor(20, 20, 20); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(state.template.entreprise, margin, y); y += 16;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(state.template.adresse, margin, y); y += 24;
    doc.setFillColor(248, 249, 250); doc.roundedRect(margin, y, pageWidth - 2 * margin, 70, 6, 6, 'F');
    doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.setFont('helvetica', 'normal');
    doc.text('Effectif', margin + 16, y + 22);
    doc.text('Masse brute', margin + 140, y + 22);
    doc.text('Retenues', margin + 280, y + 22);
    doc.text('Masse nette', margin + 420, y + 22);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text(String(totaux.nb), margin + 16, y + 52);
    doc.text(totaux.brut.toLocaleString('fr-FR') + ' F', margin + 140, y + 52);
    doc.text((totaux.cnss + totaux.its).toLocaleString('fr-FR') + ' F', margin + 280, y + 52);
    doc.text(totaux.net.toLocaleString('fr-FR') + ' F', margin + 420, y + 52);
    y += 90;
    const rows = salaries.map(item => [
        item.salarie.matricule || '—',
        item.salarie.prenom + ' ' + item.salarie.nom.toUpperCase(),
        item.calc.joursAbsentsTotal > 0 ? item.calc.joursAbsentsTotal + ' j' : '—',
        item.calc.brutTotal.toLocaleString('fr-FR'),
        item.calc.result.cnss.toLocaleString('fr-FR'),
        item.calc.result.its.toLocaleString('fr-FR'),
        item.calc.result.net.toLocaleString('fr-FR')
    ]);
    doc.autoTable({
        startY: y,
        head: [['Matricule', 'Salarié', 'Abs.', 'Brut', 'CNSS', 'ITS', 'Net à payer']],
        body: rows,
        foot: [['', 'TOTAL', '', totaux.brut.toLocaleString('fr-FR'), totaux.cnss.toLocaleString('fr-FR'), totaux.its.toLocaleString('fr-FR'), totaux.net.toLocaleString('fr-FR')]],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, cellPadding: 7 },
        footStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' }, 2: { halign: 'center', cellWidth: 40 }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right', fontStyle: 'bold' } }
    });
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(150, 150, 150);
    doc.text('Journal de paie ' + moisFr, pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    doc.save('Journal_paie_' + mois + '.pdf');
    showToast('✅ Journal généré');
}

function exportRegistreCSV() {
    if (!registreCache.salaries || registreCache.salaries.length === 0) { alert('Aucun salarié.'); return; }
    const mois = registreCache.mois;
    let csv = 'Matricule;Nom & Prénom;Poste;Net à payer (FCFA)\n';
    registreCache.salaries.forEach(item => {
        const s = item.salarie;
        csv += [s.matricule || '', s.prenom + ' ' + s.nom.toUpperCase(), s.poste || '', item.calc.result.net]
            .map(v => String(v).includes(';') ? '"' + v + '"' : v).join(';') + '\n';
    });
    csv += ';TOTAL;;' + registreCache.totaux.net + '\n';
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Virement_' + mois + '.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📤 Virement généré');
}

function enregistrerPaieMois() {
    if (!registreCache.salaries || registreCache.salaries.length === 0) { alert('Aucun salarié.'); return; }
    if (!confirm('Archiver la paie de ' + formatMoisFr(registreCache.mois) + ' ?')) return;
    const ent = getEntrepriseActive();
    if (!ent) return;
    if (!ent.archives) ent.archives = [];
    ent.archives = ent.archives.filter(a => a.mois !== registreCache.mois);
    ent.archives.push({
        mois: registreCache.mois, moisFr: formatMoisFr(registreCache.mois),
        date: new Date().toISOString(), totaux: registreCache.totaux,
        lignes: registreCache.salaries.map(item => ({
            matricule: item.salarie.matricule || '',
            nom: item.salarie.nom, prenom: item.salarie.prenom,
            poste: item.salarie.poste || '',
            joursAbsents: item.calc.joursAbsentsTotal || 0,
            retenueAbsence: item.calc.retenueAbsence || 0,
            brut: item.calc.brutTotal, cnss: item.calc.result.cnss,
            its: item.calc.result.its, net: item.calc.result.net,
            primes: {
                transport: item.salarie.primeTransport || 0, logement: item.salarie.primeLogement || 0,
                anciennete: item.salarie.primeAnciennete || 0, heuresSup: item.salarie.primeHeuresSup || 0
            }
        }))
    });
    if (ent.archives.length > 36) ent.archives.shift();
    saveState();
    refreshAllViews();
    showToast('💾 Paie archivée');
    setTimeout(() => { switchTab('archives'); }, 600);
}