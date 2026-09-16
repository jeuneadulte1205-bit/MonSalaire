/* ============================================================
   06-AUTH - Authentification PIN + Session
   ============================================================ */

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkPinSetup() {
    if (!auth.pinHash) {
        document.getElementById('setupCard').style.display = 'block';
        document.getElementById('loginCard').style.display = 'none';
    } else {
        document.getElementById('setupCard').style.display = 'none';
        document.getElementById('loginCard').style.display = 'block';
        auth.inputBuffer = '';
        updatePinDots();
    }
    document.getElementById('loginOverlay').classList.add('show');
    document.getElementById('appContent').style.display = 'none';
}

async function setupPin() {
    const pin1 = document.getElementById('setupPin1').value.trim();
    const pin2 = document.getElementById('setupPin2').value.trim();
    const err = document.getElementById('setupError');
    err.textContent = '';
    if (!/^\d{6}$/.test(pin1)) { err.textContent = 'Le PIN doit contenir exactement 6 chiffres.'; return; }
    if (pin1 !== pin2) { err.textContent = 'Les deux codes ne correspondent pas.'; return; }
    if (['123456', '000000', '111111', '654321', '012345', '121212'].includes(pin1)) {
        err.textContent = 'Ce PIN est trop simple.'; return;
    }
    const hash = await sha256(pin1);
    auth.pinHash = hash;
    localStorage.setItem(STORAGE_KEY_PIN, hash);
    showToast('✅ Code PIN créé');
    unlockApp();
}

function pinPress(n) {
    if (auth.inputBuffer.length >= 6) return;
    auth.inputBuffer += n;
    updatePinDots();
    if (auth.inputBuffer.length === 6) setTimeout(verifyPin, 200);
}
function pinDelete() { auth.inputBuffer = auth.inputBuffer.slice(0, -1); updatePinDots(); }
function pinClear() { auth.inputBuffer = ''; updatePinDots(); }

function updatePinDots() {
    document.querySelectorAll('#pinDisplay .pin-dot').forEach((dot, i) => {
        dot.classList.remove('filled', 'error');
        if (i < auth.inputBuffer.length) dot.classList.add('filled');
    });
}

async function verifyPin() {
    const err = document.getElementById('loginError');
    err.textContent = '';
    const hash = await sha256(auth.inputBuffer);
    if (hash === auth.pinHash) {
        auth.inputBuffer = '';
        updatePinDots();
        unlockApp();
    } else {
        document.querySelectorAll('#pinDisplay .pin-dot').forEach(d => d.classList.add('error'));
        err.textContent = 'Code PIN incorrect';
        setTimeout(() => {
            auth.inputBuffer = '';
            updatePinDots();
            err.textContent = '';
        }, 700);
        if (navigator.vibrate) navigator.vibrate(200);
    }
}

function unlockApp() {
    auth.unlocked = true;
    auth.lastActivity = Date.now();
    document.getElementById('loginOverlay').classList.remove('show');
    document.getElementById('appContent').style.display = 'flex';
    startSessionTimer();
    ['oldPin','newPin1','newPin2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function lockApp() {
    auth.unlocked = false;
    auth.inputBuffer = '';
    stopSessionTimer();
    document.getElementById('appContent').style.display = 'none';
    checkPinSetup();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function lockNow() {
    if (confirm("Verrouiller l'application maintenant ?")) lockApp();
}

/* ----- Session timer ----- */
function startSessionTimer() {
    stopSessionTimer();
    updateSessionUI();
    auth.timerInterval = setInterval(() => {
        const elapsed = (Date.now() - auth.lastActivity) / 1000;
        const remaining = Math.max(0, state.sessionDuration * 60 - elapsed);
        if (remaining <= 0) { stopSessionTimer(); lockApp(); return; }
        updateSessionUI(remaining);
    }, 1000);
}

function stopSessionTimer() {
    if (auth.timerInterval) { clearInterval(auth.timerInterval); auth.timerInterval = null; }
}

function updateSessionUI(remainingSec) {
    const badge = document.getElementById('sessionBadge');
    const timer = document.getElementById('sessionTimer');
    if (!badge || !timer) return;
    if (remainingSec === undefined) {
        const elapsed = (Date.now() - auth.lastActivity) / 1000;
        remainingSec = Math.max(0, state.sessionDuration * 60 - elapsed);
    }
    const m = Math.floor(remainingSec / 60);
    const s = Math.floor(remainingSec % 60);
    timer.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    badge.classList.remove('warning', 'expired');
    if (remainingSec < 60) badge.classList.add('expired');
    else if (remainingSec < 300) badge.classList.add('warning');
}

function resetActivity() {
    if (auth.unlocked) auth.lastActivity = Date.now();
}

/* ----- Changement PIN ----- */
function openChangePinModal() {
    ['oldPin','newPin1','newPin2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('changePinError').textContent = '';
    document.getElementById('changePinModal').classList.add('show');
}
function closeChangePinModal() {
    document.getElementById('changePinModal').classList.remove('show');
}

async function submitChangePin() {
    const oldPin = document.getElementById('oldPin').value.trim();
    const newPin1 = document.getElementById('newPin1').value.trim();
    const newPin2 = document.getElementById('newPin2').value.trim();
    const err = document.getElementById('changePinError');
    err.textContent = '';
    const oldHash = await sha256(oldPin);
    if (oldHash !== auth.pinHash) { err.textContent = 'PIN actuel incorrect.'; return; }
    if (!/^\d{6}$/.test(newPin1)) { err.textContent = 'Nouveau PIN : 6 chiffres requis.'; return; }
    if (newPin1 !== newPin2) { err.textContent = 'Les nouveaux PIN ne correspondent pas.'; return; }
    if (['123456', '000000', '111111', '654321'].includes(newPin1)) {
        err.textContent = 'Ce PIN est trop simple.'; return;
    }
    const newHash = await sha256(newPin1);
    auth.pinHash = newHash;
    localStorage.setItem(STORAGE_KEY_PIN, newHash);
    closeChangePinModal();
    showToast('✅ Code PIN modifié');
}

function saveSessionDuration() {
    const val = parseInt(document.getElementById('paramSessionDuration').value) || 30;
    state.sessionDuration = Math.max(1, Math.min(120, val));
    saveState();
    if (auth.unlocked) startSessionTimer();
    showToast('✅ Durée : ' + state.sessionDuration + ' min');
}

function saveParamsConges() {
    state.cpJoursMois = parseFloat(document.getElementById('paramCPJoursMois').value) || 2;
    state.joursOuvrables = parseFloat(document.getElementById('paramJoursOuvrables').value) || 30;
    saveState();
    showToast('✅ Paramètres congés sauvegardés');
}