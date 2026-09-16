/* ============================================================
   VIEWS - Navigation (onglets)
   + initialisation de VIEWS_HTML
   ============================================================ */

let VIEWS_HTML = '';

const NAV_TABS_HTML = 
    '<button class="nav-tab active" data-tab="dashboard"><i class="fas fa-chart-pie"></i> Dashboard</button>' +
    '<button class="nav-tab" data-tab="salaries"><i class="fas fa-users"></i> Salariés</button>' +
    '<button class="nav-tab" data-tab="absences"><i class="fas fa-calendar-times"></i> Absences</button>' +
    '<button class="nav-tab" data-tab="calcul"><i class="fas fa-calculator"></i> Calcul</button>' +
    '<button class="nav-tab" data-tab="registre"><i class="fas fa-calendar-alt"></i> Registre</button>' +
    '<button class="nav-tab" data-tab="archives"><i class="fas fa-archive"></i> Archives</button>' +
    '<button class="nav-tab" data-tab="fiche"><i class="fas fa-palette"></i> Studio Fiche</button>' +
    '<button class="nav-tab" data-tab="aide"><i class="fas fa-question-circle"></i> Aide</button>' +
    '<button class="nav-tab" data-tab="params"><i class="fas fa-sliders-h"></i> Paramètres</button>';