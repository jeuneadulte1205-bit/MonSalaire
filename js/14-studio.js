/* ============================================================
   14-STUDIO - Édition fiche + aperçu temps réel
   ============================================================ */

function selectTemplate(type) {
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    const card = document.querySelector('.template-card[data-template="' + type + '"]');
    if (card) card.classList.add('active');
    state.template.type = type;
    const colorMap = {
        classic: { primary: '#2563eb', secondary: '#0f172a' },
        modern: { primary: '#16a34a', secondary: '#0f172a' },
        elegant: { primary: '#0f172a', secondary: '#475569' },
        corporate: { primary: '#f59e0b', secondary: '#1e293b' },
        minimalist: { primary: '#0f172a', secondary: '#64748b' },
        bold: { primary: '#dc2626', secondary: '#0f172a' },
        bordered: { primary: '#2563eb', secondary: '#1e293b' },
        stripe: { primary: '#7c3aed', secondary: '#0f172a' }
    };
    const colors = colorMap[type];
    if (colors) {
        state.template.primaryColor = colors.primary;
        state.template.secondaryColor = colors.secondary;
        document.getElementById('colorPrimary').value = colors.primary;
        document.getElementById('colorSecondary').value = colors.secondary;
    }
    updatePreview();
}

function collectTemplateFromUI() {
    const t = state.template;
    t.primaryColor = document.getElementById('colorPrimary').value;
    t.secondaryColor = document.getElementById('colorSecondary').value;
    t.entreprise = document.getElementById('stEntreprise').value;
    t.adresse = document.getElementById('stAdresse').value;
    t.contact = document.getElementById('stContact').value;
    t.nif = document.getElementById('stNif').value;
    t.cnss = document.getElementById('stCnss').value;
    t.salarie = document.getElementById('stSalarie').value;
    t.matricule = document.getElementById('stMatricule').value;
    t.fonction = document.getElementById('stFonction').value;
    t.periode = document.getElementById('stPeriode').value;
    t.datePaiement = document.getElementById('stDatePaiement').value;
    t.signature = document.getElementById('stSignature').value;
    t.signatureEmp = document.getElementById('stSignatureEmp').value;
    t.footer = document.getElementById('stFooter').value;
    t.showLogo = document.getElementById('stShowLogo').checked;
    t.showPrimes = document.getElementById('stShowPrimes').checked;
    t.showAbsences = document.getElementById('stShowAbsences').checked;
    t.showMentions = document.getElementById('stShowMentions').checked;
    t.showSignature = document.getElementById('stShowSignature').checked;
    t.showEmp = document.getElementById('stShowEmp').checked;
    t.showNif = document.getElementById('stShowNif').checked;
    t.showMatricule = document.getElementById('stShowMatricule').checked;
    t.showDatePaiement = document.getElementById('stShowDatePaiement').checked;
    t.showConges = document.getElementById('stShowConges').checked;
    t.showYtd = document.getElementById('stShowYtd').checked;
}

function getPrimesFromUI() {
    return {
        transport: parseFloat(document.getElementById('pTransport').value) || 0,
        logement: parseFloat(document.getElementById('pLogement').value) || 0,
        anciennete: parseFloat(document.getElementById('pAnciennete').value) || 0,
        heuresSup: parseFloat(document.getElementById('pHeuresSup').value) || 0,
        ytdBrut: parseFloat(document.getElementById('pYtdBrut').value) || 0,
        ytdNet: parseFloat(document.getElementById('pYtdNet').value) || 0
    };
}

function buildSignaturesHtml(tpl) {
    if (!tpl.showSignature) return '';
    return '<div class="signature-zone">' +
        '<div class="sign-box"><div class="sign-title">Signature de l\'employeur</div><div class="sign-line">' + tpl.signature + '</div><div class="sign-sub">Nom, qualité, signature et cachet</div></div>' +
        '<div class="sign-box" style="text-align:right;"><div class="sign-title">Signature de l\'employé</div><div class="sign-line">' + tpl.signatureEmp + '</div><div class="sign-sub">Pour accusé de réception</div></div>' +
    '</div>';
}

function buildMentionsHtml(tpl) {
    if (!tpl.showMentions) return '';
    return '<div style="margin-top:14px;padding:10px;background:#f8f9fa;border-radius:6px;font-size:10px;color:#666;line-height:1.5;"><strong>Mentions légales :</strong> CNSS part ouvrière 3,6%. ITS barème progressif au Bénin (0% à 30%). Rétention : 10 ans.</div>';
}

function buildNifHtml(tpl) {
    if (!tpl.showNif || (!tpl.nif && !tpl.cnss)) return '';
    let s = '<div style="font-size:10px;color:#888;margin-top:4px;">';
    if (tpl.nif) s += 'NIF : ' + tpl.nif;
    if (tpl.cnss) s += (tpl.nif ? ' • ' : '') + 'N° CNSS : ' + tpl.cnss;
    return s + '</div>';
}

function buildYtdHtml(tpl, primes) {
    if (!tpl.showYtd) return '';
    return '<div style="margin-top:12px;padding:10px;background:#f0f5ff;border-radius:6px;font-size:10px;color:#333;"><strong>YTD :</strong> Brut : ' + primes.ytdBrut.toLocaleString('fr-FR') + ' FCFA • Net : ' + primes.ytdNet.toLocaleString('fr-FR') + ' FCFA</div>';
}

function updatePreview() {
    collectTemplateFromUI();
    const tpl = state.template;
    const primes = getPrimesFromUI();
    const totalPrimes = primes.transport + primes.logement + primes.anciennete + primes.heuresSup;
    let baseResult = state.lastResult || calculerBrutToNet(500000);
    const salaireBase = baseResult.brut;
    const brutTotal = salaireBase + totalPrimes;
    const result = calculerBrutToNet(brutTotal);
    const container = document.getElementById('fichePreview');
    if (!container) return;
    container.style.setProperty('--tpl-primary', tpl.primaryColor);
    container.style.setProperty('--tpl-secondary', tpl.secondaryColor);
    const fmt = (n) => n.toLocaleString('fr-FR') + ' FCFA';
    const logoPreview = document.getElementById('logoPreviewContainer');
    if (tpl.logo) logoPreview.innerHTML = '<div class="logo-preview"><img src="' + tpl.logo + '"><button onclick="removeLogo()"><i class="fas fa-trash"></i> Retirer</button></div>';
    else logoPreview.innerHTML = '';
    const logoClass = { classic: 'fc-logo', modern: 'logo', elegant: 'fe-logo', corporate: 'logo', minimalist: 'fmi-logo', bold: 'fb-logo', bordered: 'fb2-logo', stripe: 'fs-logo' }[tpl.type] || 'fc-logo';
    const logoHtml = (tpl.showLogo && tpl.logo) ? '<img src="' + tpl.logo + '" class="' + logoClass + '" alt="logo">' : '';
    let tableRows = '';
    if (tpl.showPrimes) {
        tableRows += '<tr><td>Salaire de base</td><td>' + fmt(salaireBase) + '</td></tr>';
        if (primes.transport > 0) tableRows += '<tr><td>Prime transport</td><td>' + fmt(primes.transport) + '</td></tr>';
        if (primes.logement > 0) tableRows += '<tr><td>Prime logement</td><td>' + fmt(primes.logement) + '</td></tr>';
        if (primes.anciennete > 0) tableRows += '<tr><td>Prime ancienneté</td><td>' + fmt(primes.anciennete) + '</td></tr>';
        if (primes.heuresSup > 0) tableRows += '<tr><td>Heures sup.</td><td>' + fmt(primes.heuresSup) + '</td></tr>';
        tableRows += '<tr style="border-top:2px solid #ddd;"><td><strong>Salaire Brut total</strong></td><td><strong>' + fmt(brutTotal) + '</strong></td></tr>';
    } else tableRows += '<tr><td>Salaire Brut</td><td>' + fmt(brutTotal) + '</td></tr>';
    tableRows += '<tr><td>Base imposable (arrondie)</td><td>' + fmt(result.baseImposable) + '</td></tr>';
    tableRows += '<tr><td>CNSS (part ouvrière 3,6%)</td><td style="color:#dc2626;">- ' + fmt(result.cnss) + '</td></tr>';
    tableRows += '<tr><td>ITS (Impôt)</td><td style="color:#dc2626;">- ' + fmt(result.its) + '</td></tr>';
    tableRows += '<tr class="fc-total-row fm-total-row fe-total-row fmi-total-row fb-total-row fb2-total-row fs-total-row"><td>NET À PAYER</td><td>' + fmt(result.net) + '</td></tr>';
    const mentionsHtml = buildMentionsHtml(tpl);
    const signaturesHtml = buildSignaturesHtml(tpl);
    const nifHtml = buildNifHtml(tpl);
    const ytdHtml = buildYtdHtml(tpl, primes);
    const congesHtml = tpl.showConges ? '<div style="margin-top:8px;font-size:10px;color:#666;"><strong>Congés payés :</strong> 24 jours/an</div>' : '';
    const datePaiementHtml = tpl.showDatePaiement ? 'Payé le ' + formatDateFr(tpl.datePaiement) : '';
    const matriculeHtml = tpl.showMatricule && tpl.matricule ? 'Matricule : ' + tpl.matricule : '';

    let html = '';
    if (tpl.type === 'classic') {
        html = '<div class="fiche-classic" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fc-header">' + logoHtml + '<div class="fc-country">RÉPUBLIQUE DU BÉNIN</div><div class="fc-title">FICHE DE PAIE</div><div class="fc-company">' + tpl.entreprise + '</div><div style="font-size:11px;color:#888;margin-top:4px;">' + tpl.adresse + '</div>' + nifHtml + '</div>' +
        '<div class="fc-info-row"><span class="lbl">Salarié</span><span class="val">' + tpl.salarie + '</span></div>' +
        (matriculeHtml ? '<div class="fc-info-row"><span class="lbl">Matricule</span><span class="val">' + tpl.matricule + '</span></div>' : '') +
        '<div class="fc-info-row"><span class="lbl">Fonction</span><span class="val">' + tpl.fonction + '</span></div>' +
        '<div class="fc-info-row"><span class="lbl">Période</span><span class="val">' + tpl.periode + '</span></div>' +
        (datePaiementHtml ? '<div class="fc-info-row"><span class="lbl">Date de paiement</span><span class="val">' + formatDateFr(tpl.datePaiement) + '</span></div>' : '') +
        '<table class="fc-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '<div class="fc-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'modern') {
        html = '<div class="fiche-modern" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fm-banner"><div class="left">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>' + tpl.entreprise + ' • ' + tpl.adresse + '</p>' + nifHtml + '</div><div class="right"><strong>' + tpl.periode + '</strong><div>' + (datePaiementHtml || 'Émis le ' + formatDateFr(tpl.datePaiement)) + '</div></div></div>' +
        '<div class="fm-body"><div class="fm-section">' +
        '<div class="item"><div class="lbl">Salarié</div><div class="val">' + tpl.salarie + '</div></div>' +
        (matriculeHtml ? '<div class="item"><div class="lbl">Matricule</div><div class="val">' + tpl.matricule + '</div></div>' : '') +
        '<div class="item"><div class="lbl">Fonction</div><div class="val">' + tpl.fonction + '</div></div>' +
        '<div class="item"><div class="lbl">Contact</div><div class="val">' + tpl.contact + '</div></div>' +
        '</div><table class="fm-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '</div><div class="fm-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'elegant') {
        html = '<div class="fiche-elegant" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fe-header"><div class="left">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>RÉPUBLIQUE DU BÉNIN</p></div><div class="right"><div>Période : <strong>' + tpl.periode + '</strong></div><div style="margin-top:4px;">' + tpl.entreprise + '</div>' + nifHtml + '</div></div>' +
        '<div class="fe-info"><div class="item"><div class="lbl">Salarié</div><div class="val">' + tpl.salarie + '</div></div>' +
        (matriculeHtml ? '<div class="item"><div class="lbl">Matricule</div><div class="val">' + tpl.matricule + '</div></div>' : '') +
        '<div class="item"><div class="lbl">Fonction</div><div class="val">' + tpl.fonction + '</div></div>' +
        '<div class="item"><div class="lbl">Adresse</div><div class="val">' + tpl.adresse + '</div></div>' +
        '</div><table class="fe-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '<div class="fe-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'corporate') {
        html = '<div class="fiche-corporate" style="--tpl-primary:' + tpl.primaryColor + ';--tpl-secondary:' + tpl.secondaryColor + ';"><div class="fc-banner"><h2>FICHE DE PAIE</h2>' + logoHtml + '</div>' +
        '<div class="fc-sub"><span>Période : <strong>' + tpl.periode + '</strong></span><span>' + (datePaiementHtml || 'Émis le ' + formatDateFr(tpl.datePaiement)) + '</span></div>' +
        '<div class="fc-body"><div class="fc-info-grid">' +
        '<div class="item"><div class="lbl">Salarié</div><div class="val">' + tpl.salarie + '</div></div>' +
        (matriculeHtml ? '<div class="item"><div class="lbl">Matricule</div><div class="val">' + tpl.matricule + '</div></div>' : '') +
        '<div class="item"><div class="lbl">Fonction</div><div class="val">' + tpl.fonction + '</div></div>' +
        '<div class="item"><div class="lbl">Entreprise</div><div class="val">' + tpl.entreprise + '</div></div>' +
        '</div><table class="fc-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '</div><div class="fc-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'minimalist') {
        html = '<div class="fiche-minimalist" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fmi-header">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>' + tpl.periode + ' • ' + tpl.entreprise + '</p>' + nifHtml + '</div>' +
        '<div class="fmi-info"><div><span class="lbl">Salarié</span><br><span class="val">' + tpl.salarie + '</span></div>' +
        (matriculeHtml ? '<div><span class="lbl">Matricule</span><br><span class="val">' + tpl.matricule + '</span></div>' : '') +
        '<div><span class="lbl">Fonction</span><br><span class="val">' + tpl.fonction + '</span></div>' +
        '<div><span class="lbl">Adresse</span><br><span class="val">' + tpl.adresse + '</span></div>' +
        '</div><table class="fmi-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '<div class="fmi-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'bold') {
        html = '<div class="fiche-bold" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fb-banner">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>' + tpl.entreprise + ' • ' + tpl.periode + '</p>' + nifHtml + '</div>' +
        '<div class="fb-body"><div class="fb-info">' +
        '<div><div class="lbl">Salarié</div><div class="val">' + tpl.salarie + '</div></div>' +
        (matriculeHtml ? '<div><div class="lbl">Matricule</div><div class="val">' + tpl.matricule + '</div></div>' : '') +
        '<div><div class="lbl">Fonction</div><div class="val">' + tpl.fonction + '</div></div>' +
        '<div><div class="lbl">Adresse</div><div class="val">' + tpl.adresse + '</div></div>' +
        '</div><table class="fb-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '</div><div class="fb-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'bordered') {
        html = '<div class="fiche-bordered" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fb2-header">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>' + tpl.entreprise + ' • ' + tpl.periode + '</p>' + nifHtml + '</div>' +
        '<div class="fb2-info"><div><span class="lbl">Salarié</span> <span class="val">' + tpl.salarie + '</span></div>' +
        (matriculeHtml ? '<div><span class="lbl">Matricule</span> <span class="val">' + tpl.matricule + '</span></div>' : '') +
        '<div><span class="lbl">Fonction</span> <span class="val">' + tpl.fonction + '</span></div>' +
        '<div><span class="lbl">Adresse</span> <span class="val">' + tpl.adresse + '</span></div>' +
        '</div><table class="fb2-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '<div class="fb2-footer">' + tpl.footer + '</div></div>';
    } else if (tpl.type === 'stripe') {
        html = '<div class="fiche-stripe" style="--tpl-primary:' + tpl.primaryColor + ';"><div class="fs-banner">' + logoHtml + '<h2>FICHE DE PAIE</h2><p>' + tpl.entreprise + ' • ' + tpl.periode + '</p>' + nifHtml + '</div>' +
        '<div class="fs-body"><div class="fs-info">' +
        '<div><div class="lbl">Salarié</div><div class="val">' + tpl.salarie + '</div></div>' +
        (matriculeHtml ? '<div><div class="lbl">Matricule</div><div class="val">' + tpl.matricule + '</div></div>' : '') +
        '<div><div class="lbl">Fonction</div><div class="val">' + tpl.fonction + '</div></div>' +
        '<div><div class="lbl">Adresse</div><div class="val">' + tpl.adresse + '</div></div>' +
        '</div><table class="fs-table"><thead><tr><th>Désignation</th><th>Montant</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        congesHtml + ytdHtml + mentionsHtml + signaturesHtml + '</div><div class="fs-footer">' + tpl.footer + '</div></div>';
    }
    container.innerHTML = html;
    saveState();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        state.template.logo = e.target.result;
        saveState();
        updatePreview();
        showToast('✅ Logo ajouté');
    };
    reader.readAsDataURL(file);
}

function removeLogo() {
    state.template.logo = null;
    document.getElementById('logoInput').value = '';
    saveState();
    updatePreview();
}

function saveTemplate() {
    collectTemplateFromUI();
    saveState();
    showToast('💾 Modèle enregistré');
}

function resetTemplate() {
    if (!confirm('Réinitialiser ?')) return;
    state.template = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
    saveState();
    loadTemplateToUI();
    updatePreview();
    showToast('♻️ Réinitialisé');
}

function loadTemplateToUI() {
    const t = state.template;
    document.getElementById('colorPrimary').value = t.primaryColor;
    document.getElementById('colorSecondary').value = t.secondaryColor;
    document.getElementById('stEntreprise').value = t.entreprise;
    document.getElementById('stAdresse').value = t.adresse;
    document.getElementById('stContact').value = t.contact;
    document.getElementById('stNif').value = t.nif || '';
    document.getElementById('stCnss').value = t.cnss || '';
    document.getElementById('stSalarie').value = t.salarie;
    document.getElementById('stMatricule').value = t.matricule || '';
    document.getElementById('stFonction').value = t.fonction;
    document.getElementById('stPeriode').value = t.periode;
    document.getElementById('stDatePaiement').value = t.datePaiement || '';
    document.getElementById('stSignature').value = t.signature;
    document.getElementById('stSignatureEmp').value = t.signatureEmp || '';
    document.getElementById('stFooter').value = t.footer;
    document.getElementById('stShowLogo').checked = t.showLogo;
    document.getElementById('stShowPrimes').checked = t.showPrimes;
    document.getElementById('stShowAbsences').checked = t.showAbsences !== false;
    document.getElementById('stShowMentions').checked = t.showMentions;
    document.getElementById('stShowSignature').checked = t.showSignature;
    document.getElementById('stShowEmp').checked = t.showEmp;
    document.getElementById('stShowNif').checked = t.showNif || false;
    document.getElementById('stShowMatricule').checked = t.showMatricule || false;
    document.getElementById('stShowDatePaiement').checked = t.showDatePaiement !== false;
    document.getElementById('stShowConges').checked = t.showConges !== false;
    document.getElementById('stShowYtd').checked = t.showYtd || false;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    const activeCard = document.querySelector('.template-card[data-template="' + t.type + '"]');
    if (activeCard) activeCard.classList.add('active');
}