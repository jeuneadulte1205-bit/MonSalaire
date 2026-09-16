/* ============================================================
   08-ENTREPRISES - Gestion des entreprises
   ============================================================ */

function openEntrepriseModal() {
    document.getElementById('entId').value = '';
    document.getElementById('entNom').value = '';
    document.getElementById('entAdresse').value = '';
    document.getElementById('entNif').value = '';
    document.getElementById('entCnss').value = '';
    renderEntrepriseList();
    document.getElementById('entrepriseModal').classList.add('show');
}

function closeEntrepriseModal() {
    document.getElementById('entrepriseModal').classList.remove('show');
}

function renderEntrepriseList() {
    const list = document.getElementById('entrepriseList');
    if (!list) return;
    if (state.entreprises.length === 0) {
        list.innerHTML = '<div class="empty-absences"><i class="fas fa-building" style="font-size:32px;display:block;margin-bottom:8px;color:var(--gray-300);"></i>Aucune entreprise. Créez-en une ci-dessous.</div>';
        return;
    }
    let html = '';
    state.entreprises.forEach(e => {
        const active = e.id === state.entrepriseActiveId;
        const nbSal = (e.salaries || []).length;
        html += '<div class="entreprise-list-item ' + (active ? 'active' : '') + '">' +
            '<div class="icon"><i class="fas fa-building"></i></div>' +
            '<div class="info" onclick="selectEntreprise(\'' + e.id + '\')">' +
                '<div class="name">' + escapeHtml(e.nom) + (active ? ' <span style="color:var(--primary);font-size:11px;">● ACTIVE</span>' : '') + '</div>' +
                '<div class="meta">' + nbSal + ' salarié(s)' + (e.adresse ? ' • ' + escapeHtml(e.adresse) : '') + '</div>' +
            '</div>' +
            '<div class="actions">' +
                '<button class="btn-edit" onclick="event.stopPropagation();editEntreprise(\'' + e.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-del" onclick="event.stopPropagation();deleteEntreprise(\'' + e.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    });
    list.innerHTML = html;
}

function saveEntreprise() {
    const id = document.getElementById('entId').value;
    const nom = document.getElementById('entNom').value.trim();
    const adresse = document.getElementById('entAdresse').value.trim();
    const nif = document.getElementById('entNif').value.trim();
    const cnss = document.getElementById('entCnss').value.trim();
    if (!nom) { alert("Le nom de l'entreprise est obligatoire."); return; }

    if (id) {
        const e = state.entreprises.find(x => x.id === id);
        if (e) {
            e.nom = nom; e.adresse = adresse; e.nif = nif; e.cnss = cnss;
            showToast('✅ Entreprise modifiée');
        }
    } else {
        const newEnt = {
            id: generateId('ent'), nom: nom, adresse: adresse, nif: nif, cnss: cnss,
            salaries: [], archives: [], createdAt: new Date().toISOString()
        };
        state.entreprises.push(newEnt);
        if (!state.entrepriseActiveId) state.entrepriseActiveId = newEnt.id;
        if (!state.template.entreprise || state.template.entreprise === 'Votre Entreprise SARL') {
            state.template.entreprise = nom;
            state.template.adresse = adresse || 'Cotonou, Bénin';
            state.template.nif = nif;
            state.template.cnss = cnss;
        }
        showToast('✅ Entreprise créée');
    }
    saveState();
    renderEntrepriseList();
    updateEntrepriseName();
    refreshAllViews();
}

function editEntreprise(id) {
    const e = state.entreprises.find(x => x.id === id);
    if (!e) return;
    document.getElementById('entId').value = e.id;
    document.getElementById('entNom').value = e.nom || '';
    document.getElementById('entAdresse').value = e.adresse || '';
    document.getElementById('entNif').value = e.nif || '';
    document.getElementById('entCnss').value = e.cnss || '';
}

function deleteEntreprise(id) {
    const e = state.entreprises.find(x => x.id === id);
    if (!e) return;
    const nbSal = (e.salaries || []).length;
    if (!confirm('Supprimer "' + e.nom + '" ?\n\n' + nbSal + ' salarié(s) et toutes ses archives seront supprimés.')) return;
    state.entreprises = state.entreprises.filter(x => x.id !== id);
    if (state.entrepriseActiveId === id) {
        state.entrepriseActiveId = state.entreprises[0] ? state.entreprises[0].id : null;
    }
    saveState();
    renderEntrepriseList();
    updateEntrepriseName();
    refreshAllViews();
    showToast('🗑️ Entreprise supprimée');
}

function selectEntreprise(id) {
    state.entrepriseActiveId = id;
    saveState();
    updateEntrepriseName();
    renderEntrepriseList();
    closeEntrepriseModal();
    refreshAllViews();
    showToast('🏢 Entreprise changée');
}

function updateEntrepriseName() {
    const ent = getEntrepriseActive();
    const el = document.getElementById('currentEntrepriseName');
    if (el) el.textContent = ent ? ent.nom : 'Aucune entreprise';
}