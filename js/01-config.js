/* ============================================================
   01-CONFIG - Constantes globales
   ============================================================ */

const DEFAULT_ITS = [
    { min: 0, max: 60000, rate: 0, cumul: 0 },
    { min: 60001, max: 150000, rate: 0.10, cumul: 0 },
    { min: 150001, max: 250000, rate: 0.15, cumul: 9000 },
    { min: 250001, max: 500000, rate: 0.19, cumul: 24000 },
    { min: 500001, max: Infinity, rate: 0.30, cumul: 71500 }
];

const DEFAULT_TEMPLATE = {
    type: 'classic',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    logo: null,
    entreprise: 'Votre Entreprise SARL',
    adresse: 'Cotonou, Bénin',
    contact: '+229 00 00 00 00',
    nif: '',
    cnss: '',
    salarie: 'Jean DUPONT',
    matricule: '',
    fonction: 'Chef de projet',
    periode: 'Août 2026',
    datePaiement: '2026-08-28',
    signature: 'Le Directeur Général',
    signatureEmp: "L'Employé",
    footer: 'Document généré par Mon Salaire - Calculateur de paie Bénin',
    showLogo: true,
    showPrimes: true,
    showAbsences: true,
    showMentions: true,
    showSignature: true,
    showEmp: true,
    showNif: false,
    showMatricule: false,
    showDatePaiement: true,
    showConges: true,
    showYtd: false
};

const ABSENCE_TYPES = {
    conge_paye:     { label: 'Congés payés',     paye: true,  decompteCP: true  },
    maladie:        { label: 'Maladie',          paye: true,  decompteCP: false },
    maternite:      { label: 'Maternité',        paye: true,  decompteCP: false },
    familial:       { label: 'Événement fam.',   paye: true,  decompteCP: false },
    sans_solde:     { label: 'Sans solde',       paye: false, decompteCP: false },
    autre_paye:     { label: 'Autre (payé)',     paye: true,  decompteCP: false },
    autre_non_paye: { label: 'Autre (non payé)', paye: false, decompteCP: false }
};