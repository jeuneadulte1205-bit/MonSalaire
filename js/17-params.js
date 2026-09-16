/* ============================================================
   17-PARAMS - Paramètres + export/reset
   ============================================================ */

function chargerParams() {
    document.getElementById('paramCnss').value = state.cnssRate;
    document.getElementById('paramCnssCeil').value = state.cnssCeil;
    document.getElementById('paramSessionDuration').value = state.sessionDuration || 30;
    document.getElementById('paramCPJoursMois').value = state.cpJoursMois || 2;
    document.getElementById('paramJoursOuvrables').value = state.joursOuvrables || 30;
    const ent = getEntrepriseActive();
    const entInfo = document.getElementById('paramsEntrepriseInfo');
    if (ent) {
        entInfo.innerHTML =
            '<div style="padding:12px;background:var(--bg-card);border-radius:10px;border:1px solid var(--gray-200);">' +
                '<div style="font-weight:700;color:var(--primary);margin-bottom:4px;">' + escapeHtml(ent.nom) + '</div>' +
                '<div style="font-size:12px;color:var(--gray-500);">' + escapeHtml(ent.adresse || '—') + '</div>' +
                (ent.nif ? '<div style="font-size:11px;color:var(--gray-500);margin-top:2px;">NIF : ' + escapeHtml(ent.nif) + '</div>' : '') +
                (ent.cnss ? '<div style="font-size:11px;color:var(--gray-500);">N° CNSS : ' + escapeHtml(ent.cnss) + '</div>' : '') +
                '<div style="font-size:11px;color:var(--gray-500);margin-top:4px;">' + (ent.salaries || []).length + ' salarié(s)</div>' +
            '</div>';
    } else {
        entInfo.innerHTML = '<div class="text-muted" style="padding:12px;">Aucune entreprise active</div>';
    }
    const container = document.getElementById('itsBracketsContainer');
    let html = '';
    state.itsBrackets.forEach((b) => {
        html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:8px;">' +
            '<input type="number" class="its-min" value="' + b.min + '" step="1">' +
            '<input type="number" class="its-max" value="' + (b.max === Infinity ? 0 : b.max) + '" step="1" placeholder="Infini=0">' +
            '<input type="number" class="its-rate" value="' + (b.rate * 100) + '" step="0.1">' +
            '<input type="number" class="its-cumul" value="' + b.cumul + '" step="1">' +
        '</div>';
    });
    container.innerHTML = html;
}

function saveParams() {
    state.cnssRate = parseFloat(document.getElementById('paramCnss').value) || 3.6;
    state.cnssCeil = parseFloat(document.getElementById('paramCnssCeil').value) || 0;
    const mins = document.querySelectorAll('.its-min');
    const maxs = document.querySelectorAll('.its-max');
    const rates = document.querySelectorAll('.its-rate');
    const cumuls = document.querySelectorAll('.its-cumul');
    const newBrackets = [];
    for (let i = 0; i < mins.length; i++) {
        const min = parseFloat(mins[i].value) || 0;
        const maxVal = parseFloat(maxs[i].value);
        const max = (maxVal === 0 || isNaN(maxVal)) ? Infinity : maxVal;
        const rate = (parseFloat(rates[i].value) || 0) / 100;
        const cumul = parseFloat(cumuls[i].value) || 0;
        newBrackets.push({ min: min, max: max, rate: rate, cumul: cumul });
    }
    state.itsBrackets = newBrackets;
    saveState();
    showToast('✅ Paramètres sauvegardés');
    updatePreview();
}

function exportAllData() {
    const data = {
        exportDate: new Date().toISOString(),
        app: 'Mon Salaire', version: '7.0',
        state: state
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mon-salaire-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📥 Sauvegarde téléchargée');
}

function resetAllData() {
    if (!confirm('⚠️ Toutes vos données seront supprimées. Continuer ?')) return;
    if (!confirm('Dernière confirmation. Action IRRÉVERSIBLE.')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_OLD);
    localStorage.removeItem(STORAGE_KEY_OLD_V6);
    localStorage.removeItem(STORAGE_KEY_PIN);
    location.reload();
}