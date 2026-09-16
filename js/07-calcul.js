/* ============================================================
   07-CALCUL - Moteur de calcul ITS/CNSS
   ============================================================ */

function getITS() { return state.itsBrackets; }
function getCnssRate() { return state.cnssRate / 100; }
function getCnssCeil() { return state.cnssCeil > 0 ? state.cnssCeil : Infinity; }

function calculerITS(base) {
    for (let b of getITS()) {
        if (base >= b.min && base <= b.max) {
            const imp = Math.round(((base - b.min) * b.rate) + b.cumul);
            return {
                amount: imp, rate: b.rate, min: b.min,
                cumul: b.cumul, bracketIndex: getITS().indexOf(b)
            };
        }
    }
    return { amount: 0, rate: 0, min: 0, cumul: 0, bracketIndex: -1 };
}

function calculerBrutToNet(brut) {
    if (isNaN(brut) || brut <= 0) return null;
    const baseImposable = Math.floor(brut / 1000) * 1000;
    const cnss = Math.round(Math.min(brut, getCnssCeil()) * getCnssRate());
    const itsResult = calculerITS(baseImposable);
    const its = itsResult.amount;
    const net = brut - cnss - its;
    return { brut, baseImposable, cnss, its, itsResult, net };
}

function calculerNetToBrut(netSouhaite) {
    if (isNaN(netSouhaite) || netSouhaite <= 0) return null;
    let low = netSouhaite, high = netSouhaite * 2;
    let resultHigh = calculerBrutToNet(high), iterCheck = 0;
    while (resultHigh && resultHigh.net < netSouhaite && iterCheck < 50) {
        high *= 2;
        resultHigh = calculerBrutToNet(high);
        iterCheck++;
    }
    if (!resultHigh) return null;
    let bestResult = null, bestDiff = Infinity, iter = 0;
    while (low <= high && iter < 200) {
        const mid = Math.floor((low + high) / 2);
        const result = calculerBrutToNet(mid);
        if (!result) { low = mid + 1; iter++; continue; }
        const diff = Math.abs(result.net - netSouhaite);
        if (diff < bestDiff) { bestDiff = diff; bestResult = result; }
        if (result.net < netSouhaite) low = mid + 1;
        else if (result.net > netSouhaite) high = mid - 1;
        else return result;
        iter++;
    }
    return bestResult;
}

function calculerSalariePourMois(salaireBase, primes, absences, mois) {
    const totalPrimes = (primes.transport || 0) + (primes.logement || 0) +
                        (primes.anciennete || 0) + (primes.heuresSup || 0);
    const salaireBaseNum = salaireBase || 0;
    const absencesMois = (absences || []).filter(a => a.mois === mois);
    const joursAbsentsTotal = absencesMois.reduce((s, a) => s + (a.jours || 0), 0);
    const joursNonPayes = absencesMois.filter(a => !a.paye).reduce((s, a) => s + (a.jours || 0), 0);
    const salaireMensuel = salaireBaseNum + totalPrimes;
    const tauxJournalier = salaireMensuel / (state.joursOuvrables || 30);
    const retenueAbsence = Math.round(tauxJournalier * joursNonPayes);
    const brutTotal = Math.max(0, salaireMensuel - retenueAbsence);
    const result = calculerBrutToNet(brutTotal);
    return {
        totalPrimes,
        brutSansAbsence: salaireMensuel,
        retenueAbsence,
        joursAbsentsTotal,
        joursNonPayes,
        brutTotal,
        result,
        absencesMois
    };
}

function getBracketDescription(index) {
    const b = state.itsBrackets[index];
    if (!b) return 'Aucune tranche';
    if (b.max === Infinity) return '+ de ' + b.min.toLocaleString() + ' F : ' + (b.rate * 100) + '%';
    return b.min.toLocaleString() + ' - ' + b.max.toLocaleString() + ' F : ' + (b.rate * 100) + '%';
}