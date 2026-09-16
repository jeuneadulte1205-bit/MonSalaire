/* ============================================================
   05-THEME - Mode sombre
   ============================================================ */

function toggleTheme() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode', state.darkMode);
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = state.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    saveState();
    showToast(state.darkMode ? '🌙 Mode sombre activé' : '☀️ Mode clair activé');
}

function initTheme() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = state.darkMode ? 'fas fa-sun' : 'fas fa-moon';
}