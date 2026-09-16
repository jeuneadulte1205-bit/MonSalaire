/* ============================================================
   13-PDF - Génération PDF fiche individuelle
   ============================================================ */

function genererFichePDF() {
    collectTemplateFromUI();
    const tpl = state.template;
    const primes = getPrimesFromUI();
    const totalPrimes = primes.transport + primes.logement + primes.anciennete + primes.heuresSup;
    let baseResult = state.lastResult || calculerBrutToNet(500000);
    const salaireBase = baseResult.brut;
    const brutTotal = salaireBase + totalPrimes;
    const result = calculerBrutToNet(brutTotal);

    const doc = new jspdf.jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const hexToRgb = (hex) => {
        const h = hex.replace('#', '');
        return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
    };
    const primaryRGB = hexToRgb(tpl.primaryColor);
    const fmt = (n) => n.toLocaleString('fr-FR') + ' FCFA';

    const tableData = [];
    if (tpl.showPrimes) {
        tableData.push(['Salaire de base', fmt(salaireBase)]);
        if (primes.transport > 0) tableData.push(['Prime de transport', fmt(primes.transport)]);
        if (primes.logement > 0) tableData.push(['Prime de logement', fmt(primes.logement)]);
        if (primes.anciennete > 0) tableData.push(["Prime d'ancienneté", fmt(primes.anciennete)]);
        if (primes.heuresSup > 0) tableData.push(['Heures supplémentaires', fmt(primes.heuresSup)]);
        tableData.push(['Salaire Brut total', fmt(brutTotal)]);
    } else tableData.push(['Salaire Brut', fmt(brutTotal)]);
    tableData.push(['Base imposable (arrondie)', fmt(result.baseImposable)]);
    tableData.push(['CNSS (part ouvrière 3,6%)', '- ' + fmt(result.cnss)]);
    tableData.push(['ITS (Impôt)', '- ' + fmt(result.its)]);
    tableData.push(['NET À PAYER', fmt(result.net)]);

    const drawSignatures = (y) => {
        if (!tpl.showSignature) return y;
        const colW = (pageWidth - 2 * margin - 40) / 2;
        doc.setFontSize(9); doc.setTextColor(120, 120, 120); doc.setFont('helvetica', 'normal');
        doc.text("Signature de l'employeur", margin, y);
        doc.text("Signature de l'employé", margin + colW + 40, y);
        y += 50; doc.setDrawColor(150, 150, 150); doc.setLineWidth(.5);
        doc.line(margin, y, margin + colW, y);
        doc.line(margin + colW + 40, y, margin + 2 * colW + 40, y);
        y += 12; doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(40, 40, 40);
        doc.text(tpl.signature, margin, y);
        doc.text(tpl.signatureEmp, margin + colW + 40, y);
        y += 12; doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(160, 160, 160);
        doc.text("Nom, qualité, signature et cachet", margin, y);
        doc.text("Pour accusé de réception", margin + colW + 40, y);
        return y + 20;
    };

    const drawMentions = (y) => {
        if (!tpl.showMentions) return y;
        doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(120, 120, 120);
        doc.text("Mentions légales : CNSS part ouvrière 3,6% - ITS barème progressif au Bénin.", margin, y);
        y += 11; doc.text("Rétention : 10 ans. Arrêté n°155/MFPTRA du 12/06/2003.", margin, y);
        return y + 16;
    };

    const drawFooter = () => {
        doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(150, 150, 150);
        doc.text(tpl.footer, pageWidth / 2, pageHeight - 20, { align: 'center' });
    };

    const datePaiementFr = formatDateFr(tpl.datePaiement);
    doc.setFillColor.apply(doc, primaryRGB); doc.rect(0, 0, pageWidth, 8, 'F');
    let y = 55;
    if (tpl.showLogo && tpl.logo) {
        try { doc.addImage(tpl.logo, 'PNG', pageWidth / 2 - 30, y - 20, 60, 30); y += 25; } catch (e) {}
    }
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
    doc.text('RÉPUBLIQUE DU BÉNIN', pageWidth / 2, y, { align: 'center' }); y += 22;
    doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, primaryRGB);
    doc.text('FICHE DE PAIE', pageWidth / 2, y, { align: 'center' }); y += 18;
    doc.setFontSize(13); doc.setTextColor(30, 30, 30);
    doc.text(tpl.entreprise, pageWidth / 2, y, { align: 'center' }); y += 14;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
    doc.text(tpl.adresse, pageWidth / 2, y, { align: 'center' }); y += 12;
    if (tpl.showNif && (tpl.nif || tpl.cnss)) {
        doc.setFontSize(9);
        doc.text((tpl.nif ? 'NIF: ' + tpl.nif : '') + (tpl.cnss ? ' | N° CNSS: ' + tpl.cnss : ''), pageWidth / 2, y, { align: 'center' });
        y += 12;
    }
    y += 10;
    doc.setDrawColor.apply(doc, primaryRGB); doc.setLineWidth(1.5);
    doc.line(margin, y, pageWidth - margin, y); y += 20;
    doc.setFontSize(11); doc.setTextColor(60, 60, 60); doc.text('Salarié', margin, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text(tpl.salarie, pageWidth - margin, y, { align: 'right' }); y += 16;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.text('Fonction', margin, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text(tpl.fonction, pageWidth - margin, y, { align: 'right' }); y += 16;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.text('Période', margin, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text(tpl.periode, pageWidth - margin, y, { align: 'right' }); y += 16;
    if (tpl.showMatricule && tpl.matricule) {
        doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.text('Matricule', margin, y);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
        doc.text(tpl.matricule, pageWidth - margin, y, { align: 'right' }); y += 16;
    }
    if (tpl.showDatePaiement && datePaiementFr) {
        doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60); doc.text('Date de paiement', margin, y);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
        doc.text(datePaiementFr, pageWidth - margin, y, { align: 'right' }); y += 16;
    }
    y += 6;
    doc.autoTable({
        startY: y, head: [['Désignation', 'Montant']], body: tableData, theme: 'plain',
        headStyles: { fillColor: primaryRGB, textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
        bodyStyles: { fontSize: 11, cellPadding: 8 },
        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 180, halign: 'right' } },
        didParseCell: (data) => {
            if (data.section === 'body' && data.row.index === tableData.length - 1) {
                data.cell.styles.fillColor = [240, 245, 255];
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 13;
                data.cell.styles.textColor = primaryRGB;
            }
        }
    });
    y = doc.lastAutoTable.finalY + 16;
    y = drawMentions(y);
    y = drawSignatures(y);
    drawFooter();
    doc.save('Fiche_' + tpl.salarie.replace(/\s/g, '_') + '_' + tpl.periode.replace(/\s/g, '_') + '.pdf');
    state.pdfCount = (state.pdfCount || 0) + 1;
    saveState();
    mettreAJourDashboard();
    showToast('✅ Fiche PDF générée');
}