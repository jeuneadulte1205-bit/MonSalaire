/* ============================================================
   16-AIDE - Centre d'aide
   ============================================================ */

function showAideSection(sectionId) {
    document.querySelectorAll('.aide-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById('aide-' + sectionId);
    if (section) section.classList.add('active');
    document.querySelectorAll('.aide-nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector('.aide-nav-btn[data-aide="' + sectionId + '"]');
    if (btn) btn.classList.add('active');
}