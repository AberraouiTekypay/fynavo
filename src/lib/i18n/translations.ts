// src/lib/i18n/translations.ts

export type Locale = "en" | "fr";

export interface Translations {
  common: {
    consolidated: string;
    group: string;
    entity: string;
    subsidiary: string;
    holding: string;
    spv: string;
    asset: string;
    actions: string;
    search: string;
    filter: string;
    all: string;
    allCountries: string;
    allEntities: string;
    allTypes: string;
    healthy: string;
    watch: string;
    critical: string;
    insufficientData: string;
    active: string;
    operating: string;
    preOperating: string;
    inLiquidation: string;
    save: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    export: string;
    viewDetails: string;
    drillDown: string;
    refresh: string;
    liveSync: string;
    lastUpdate: string;
    learnMore: string;
    settings: string;
    helpDocs: string;
    systemFreshness: string;
  };
  nav: {
    groupPilotage: string;
    systemFoundations: string;
    executiveCockpit: string;
    groupStructure: string;
    performanceBenchmarking: string;
    cashMobility: string;
    forecast13Weeks: string;
    intercompanyEliminations: string;
    debtCapital: string;
    capexPipeline: string;
    consolidatedBudget: string;
    scenarioEngine: string;
    healthAudit: string;
    consolidatedReports: string;
    allocationsFees: string;
    designSystem: string;
    treeBadge: string;
    aiBadge: string;
    alertBadge: string;
    proBadge: string;
  };
  header: {
    commandSearch: string;
    commandShortcut: string;
    liveSyncTooltip: string;
    currencyMAD: string;
    currencyEUR: string;
    currencyUSD: string;
    currencyGBP: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    userRole: string;
    userGroup: string;
    switchLanguage: string;
    viewProfile: string;
    logOut: string;
  };
  command: {
    placeholder: string;
    quickLinks: string;
    entitiesSection: string;
    modulesSection: string;
    noResults: string;
    tipEsc: string;
  };
  dashboard: {
    heroTitle: string;
    heroSubtitle: string;
    activeSprint: string;
    quickActions: string;
    runStressTest: string;
    reconcileIntercompany: string;
    exportCFOBoardPack: string;
    newSubsidiary: string;
    // KPIs
    kpiRevenue: string;
    kpiRevenueDesc: string;
    kpiEbitda: string;
    kpiEbitdaDesc: string;
    kpiCashTotal: string;
    kpiCashDeployable: string;
    kpiCashDesc: string;
    kpiNetDebt: string;
    kpiNetDebtDesc: string;
    kpiWorkingCapital: string;
    kpiWorkingCapitalDesc: string;
    kpiRunway: string;
    kpiRunwayDesc: string;
    // Banners
    criticalAlertTitle: string;
    criticalAlertDesc: string;
    discrepancyAlertTitle: string;
    discrepancyAlertDesc: string;
    resolveButton: string;
    simulateBridgeLoan: string;
    // Table
    tableTitle: string;
    tableSubtitle: string;
    filterAll: string;
    filterOperating: string;
    filterHoldingSpv: string;
    filterAttention: string;
    colEntity: string;
    colCountry: string;
    colOwnership: string;
    colRevenue: string;
    colEbitda: string;
    colCash: string;
    colGrossDebt: string;
    colNetDebt: string;
    colWorkingCapital: string;
    colHealthScore: string;
    colActions: string;
    deployableSuffix: string;
    operationalBufferSuffix: string;
    // Health Pillars
    pillarRentability: string;
    pillarCash: string;
    pillarBFR: string;
    pillarSolvency: string;
    pillarBudget: string;
    pillarQuality: string;
  };
  structure: {
    title: string;
    subtitle: string;
    addEntityBtn: string;
    searchPlaceholder: string;
    totalEntities: string;
    fullConsolidation: string;
    equityMethod: string;
    proportionalMethod: string;
    createNewEntityModalTitle: string;
    createNewEntityModalDesc: string;
    fieldName: string;
    fieldLegalName: string;
    fieldType: string;
    fieldParent: string;
    fieldCountry: string;
    fieldCurrency: string;
    fieldOwnership: string;
    fieldConsolidationMethod: string;
    fieldStatus: string;
    fieldSector: string;
    submitCreate: string;
  };
  cash: {
    title: string;
    subtitle: string;
    diagnosticTitle: string;
    diagnosticDesc: string;
    totalBankCash: string;
    minOperatingBuffer: string;
    restrictedCash: string;
    deployableLiquidity: string;
    mobilityRatio: string;
    cashByCountryTitle: string;
    entityBreakdownTitle: string;
  };
  scenarios: {
    title: string;
    subtitle: string;
    bannerTitle: string;
    bannerDesc: string;
    reset: string;
    applyCrisis: string;
    applyBase: string;
    hypothesesTitle: string;
    hypothesesSubtitle: string;
    sliderAlphaRevenue: string;
    sliderAlphaRevenueHint: string;
    sliderBetaDso: string;
    sliderBetaDsoHint: string;
    sliderPayroll: string;
    sliderPayrollHint: string;
    sliderCapex: string;
    sliderCapexHint: string;
    sliderDebt: string;
    sliderDebtHint: string;
    simulatedResultsTitle: string;
    simulatedResultsSubtitle: string;
    simRevenue: string;
    simRevenueVariance: string;
    simEbitda: string;
    simEbitdaMargin: string;
    simCash: string;
    simDeployable: string;
    simNetDebt: string;
    simLeverage: string;
    stressWarningTitle: string;
    stressWarningDesc: string;
  };
  health: {
    title: string;
    subtitle: string;
    bannerTitle: string;
    bannerDesc: string;
    resolveDiscrepancy: string;
    kpiFreshness: string;
    kpiFreshnessDesc: string;
    kpiMissingPeriods: string;
    kpiMissingPeriodsDesc: string;
    kpiPendingIntercompany: string;
    kpiPendingIntercompanyDesc: string;
    kpiBankFeeds: string;
    kpiBankFeedsDesc: string;
    tableTitle: string;
    tableSubtitle: string;
    colEntity: string;
    colLastImport: string;
    colBankFeed: string;
    colMissingPeriods: string;
    colIntercompanyGaps: string;
    colBudgetConfig: string;
    colFreshnessScore: string;
    colIntegrityStatus: string;
    statusConnected: string;
    statusFlatFile: string;
    statusCompliant: string;
    statusReview: string;
    statusConfigured: string;
    statusNotConfigured: string;
  };
  reports: {
    title: string;
    subtitle: string;
    bannerTitle: string;
    bannerDesc: string;
    printPdf: string;
    downloadReport: string;
    docHeaderTitle: string;
    docHeaderPeriod: string;
    docHeaderCurrency: string;
    docHeaderIssued: string;
    sec1Title: string;
    sec2Title: string;
    sec3Title: string;
    sec4Title: string;
    sec5Title: string;
    sec12Title: string;
    sec13Title: string;
    colEntity: string;
    colTypeCountry: string;
    colRevenue: string;
    colEbitda: string;
    colCash: string;
    colDso: string;
    colStatus: string;
    pnlGross: string;
    pnlElim: string;
    pnlConsolidated: string;
    pnlEbitda: string;
    cashGross: string;
    cashOperational: string;
    cashDeployable: string;
    disclaimer: string;
  };
  allocations: {
    title: string;
    subtitle: string;
    bannerTitle: string;
    bannerDesc: string;
    newRuleBtn: string;
    kpiCentralPool: string;
    kpiCentralPoolDesc: string;
    kpiFeesBilled: string;
    kpiFeesBilledDesc: string;
    kpiFeesCollected: string;
    kpiFeesCollectedDesc: string;
    costPoolsTitle: string;
    costPoolsSubtitle: string;
    managementFeesTitle: string;
    managementFeesSubtitle: string;
    colSubsidiary: string;
    colBasis: string;
    colRateFormula: string;
    colBilled: string;
    colCollected: string;
    colOutstanding: string;
    colStatus: string;
    statusUpToDate: string;
    statusOverdue: string;
  };
  home: {
    heroBadgeCompany: string;
    heroBadgeOS: string;
    heroBadgeSprint: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaCockpit: string;
    ctaStructure: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    previewTitle: string;
    previewConsolidatedNet: string;
    previewDeployableRatio: string;
    previewIntercompanyZero: string;
    footerText: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      consolidated: "Consolidated Group",
      group: "Group",
      entity: "Entity",
      subsidiary: "Subsidiary",
      holding: "Holding",
      spv: "SPV / Project Vehicle",
      asset: "Asset / Business Unit",
      actions: "Actions",
      search: "Search",
      filter: "Filter",
      all: "All",
      allCountries: "All Countries",
      allEntities: "All Entities",
      allTypes: "All Types",
      healthy: "Healthy",
      watch: "Watch",
      critical: "Critical Tension",
      insufficientData: "Under Review",
      active: "Active",
      operating: "Operational",
      preOperating: "Pre-Operational",
      inLiquidation: "In Liquidation",
      save: "Save Changes",
      cancel: "Cancel",
      close: "Close",
      edit: "Edit",
      delete: "Delete",
      export: "Export Data",
      viewDetails: "View Details",
      drillDown: "Drill Down",
      refresh: "Refresh",
      liveSync: "Live Sync",
      lastUpdate: "Last update",
      learnMore: "Learn More",
      settings: "Settings",
      helpDocs: "Documentation & API",
      systemFreshness: "Data Freshness",
    },
    nav: {
      groupPilotage: "GROUP PILOTAGE",
      systemFoundations: "SYSTEM & FOUNDATIONS",
      executiveCockpit: "Executive Cockpit",
      groupStructure: "Group Structure & Tree",
      performanceBenchmarking: "Performance & Benchmarks",
      cashMobility: "Cash & Mobility Matrix",
      forecast13Weeks: "13-Week Cash Forecast",
      intercompanyEliminations: "Intercompany & Eliminations",
      debtCapital: "Debt & Capital Structure",
      capexPipeline: "CAPEX Investment Pipeline",
      consolidatedBudget: "Consolidated Budget vs Actual",
      scenarioEngine: "Scenario & Stress Simulator",
      healthAudit: "Data Quality & Audit Trail",
      consolidatedReports: "CFO Board Reports",
      allocationsFees: "Cost Allocations & Fees",
      designSystem: "Fintech Design System",
      treeBadge: "Tree",
      aiBadge: "13W AI",
      alertBadge: "Alert 20K",
      proBadge: "CFO Pro",
    },
    header: {
      commandSearch: "Search entities, KPIs, accounts...",
      commandShortcut: "⌘K",
      liveSyncTooltip: "Real-time feed connected • Zero latency",
      currencyMAD: "MAD (Moroccan Dirham)",
      currencyEUR: "EUR (Euro)",
      currencyUSD: "USD (US Dollar)",
      currencyGBP: "GBP (British Pound)",
      notifications: "Notifications & Warnings",
      markAllRead: "Mark all as read",
      noNotifications: "All systems running smoothly. No unresolved alerts.",
      userRole: "Chief Financial Officer",
      userGroup: "Atlas Alliance Group SA",
      switchLanguage: "Switch Language",
      viewProfile: "Executive Profile",
      logOut: "Sign Out",
    },
    command: {
      placeholder: "Type a command or search entities, KPIs, modules...",
      quickLinks: "Quick Navigation",
      entitiesSection: "Group Entities & SPVs",
      modulesSection: "Financial Modules",
      noResults: "No matching results found.",
      tipEsc: "Press ESC to close",
    },
    dashboard: {
      heroTitle: "Consolidated Financial Cockpit",
      heroSubtitle: "Real-time multi-entity management, intercompany reconciliations, mobile liquidity, and 13-week runway.",
      activeSprint: "Active Multi-Entity Engine",
      quickActions: "Quick Actions",
      runStressTest: "Run Stress Scenario",
      reconcileIntercompany: "Intercompany Reconcile",
      exportCFOBoardPack: "Export CFO Board Pack",
      newSubsidiary: "Add Subsidiary / SPV",
      // KPIs
      kpiRevenue: "Consolidated Revenue",
      kpiRevenueDesc: "Net of 1.05M internal eliminations",
      kpiEbitda: "Group EBITDA",
      kpiEbitdaDesc: "Consolidated margin: 23.9%",
      kpiCashTotal: "Gross Cash Balance",
      kpiCashDeployable: "Deployable Cash",
      kpiCashDesc: "Excludes 4.75M operating buffers",
      kpiNetDebt: "Consolidated Net Debt",
      kpiNetDebtDesc: "1.50M intra-group loan eliminated",
      kpiWorkingCapital: "Group Working Capital (WCR)",
      kpiWorkingCapitalDesc: "DSO: 58 days • Beta under tension",
      kpiRunway: "Group Cash Runway",
      kpiRunwayDesc: "Simulated 13-week stress horizon",
      // Banners
      criticalAlertTitle: "Entity Beta: Critical cash tension projected within 4 weeks",
      criticalAlertDesc: "High DSO (88 days) and 6.4M overdue receivables create an estimated 820K cash deficit in Week 5. Recommended action: bridge facility from Entity Alpha or shareholder advance.",
      discrepancyAlertTitle: "Intercompany Reciprocity Discrepancy: 20,000 MAD (Alpha vs Beta)",
      discrepancyAlertDesc: "Entity Alpha declared 500,000 MAD receivable vs Entity Beta's 480,000 MAD recorded debt. 20,000 MAD timing difference requires reconciliation before formal consolidation.",
      resolveButton: "Resolve Discrepancy",
      simulateBridgeLoan: "Simulate Intra-Group Loan",
      // Table
      tableTitle: "Subsidiary & Entity Performance Matrix",
      tableSubtitle: "Comprehensive comparison across P&L, balance sheet, liquidity, debt ratios, and multi-pillar financial health scores.",
      filterAll: "All Entities (5)",
      filterOperating: "Operating Subsidiaries",
      filterHoldingSpv: "Holding & SPVs",
      filterAttention: "Requires Attention (2)",
      colEntity: "Legal Entity",
      colCountry: "Country & Curr.",
      colOwnership: "Ownership %",
      colRevenue: "Revenue",
      colEbitda: "EBITDA (Margin)",
      colCash: "Cash / Deployable",
      colGrossDebt: "Gross Debt",
      colNetDebt: "Net Debt",
      colWorkingCapital: "WCR (BFR)",
      colHealthScore: "Health Score",
      colActions: "Actions",
      deployableSuffix: "deployable",
      operationalBufferSuffix: "operational buffer",
      // Health Pillars
      pillarRentability: "Profitability",
      pillarCash: "Liquidity & Runway",
      pillarBFR: "Working Capital & DSO",
      pillarSolvency: "Debt Solvency",
      pillarBudget: "Budget Discipline",
      pillarQuality: "Data Freshness",
    },
    structure: {
      title: "Group Hierarchy & Legal Architecture",
      subtitle: "Interactive ownership tree, consolidation methodologies, and subsidiary governance • Currency: ",
      addEntityBtn: "Add Entity / SPV",
      searchPlaceholder: "Search by company name, ICE, or legal code...",
      totalEntities: "Entities in Perimeter",
      fullConsolidation: "Full Consolidation (Global)",
      equityMethod: "Equity Method (Mise en équivalence)",
      proportionalMethod: "Proportional Consolidation",
      createNewEntityModalTitle: "Register New Group Entity / SPV",
      createNewEntityModalDesc: "Configure legal attributes, ownership percentage, consolidation rules, and initial financial parameters.",
      fieldName: "Commercial Name",
      fieldLegalName: "Corporate Legal Name",
      fieldType: "Entity Classification",
      fieldParent: "Direct Parent Company",
      fieldCountry: "Jurisdiction / Country",
      fieldCurrency: "Functional Currency",
      fieldOwnership: "Direct Ownership Percentage (%)",
      fieldConsolidationMethod: "Consolidation Method",
      fieldStatus: "Operational Status",
      fieldSector: "Industry Sector / Domain",
      submitCreate: "Create & Link Entity",
    },
    cash: {
      title: "Group Cash & Capital Mobility Matrix",
      subtitle: "Real-time visibility into unrestricted deployable capital, trapped funds, and minimum operating buffers • Currency: ",
      diagnosticTitle: "Deployable Liquidity Analysis",
      diagnosticDesc: "Total bank holdings stand at",
      totalBankCash: "Gross Treasury Balance",
      minOperatingBuffer: "Mandatory Operational Buffer",
      restrictedCash: "Ring-Fenced / Escrow Cash",
      deployableLiquidity: "Unrestricted Deployable Cash",
      mobilityRatio: "Liquidity Mobility Ratio",
      cashByCountryTitle: "Geographic Cash Distribution",
      entityBreakdownTitle: "Subsidiary Liquidity & Transfer Friction",
    },
    scenarios: {
      title: "Group Scenario Engine & Stress-Test",
      subtitle: "Dynamic multi-variable sensitivity modeling and real-time impact on liquidity, EBITDA, and debt covenants • Currency: ",
      bannerTitle: "Group Financial Shock & Resilience Simulator",
      bannerDesc: "Model simultaneous macroeconomic shocks, working capital stress, and liquidity constraints across subsidiaries.",
      reset: "Reset Simulation",
      applyCrisis: "Apply Crisis Shock",
      applyBase: "Base Case",
      hypothesesTitle: "Simulation Assumptions & Stress Parameters",
      hypothesesSubtitle: "Adjust sliders to stress-test your consolidated balance sheet and cash runway in real time",
      sliderAlphaRevenue: "1. Entity Alpha Revenue Shock",
      sliderAlphaRevenueHint: "Simulates sudden loss of key institutional accounts or volume drop",
      sliderBetaDso: "2. Entity Beta Collection Delay (DSO)",
      sliderBetaDsoHint: "DSO expands, trapping working capital in delayed accounts receivable",
      sliderPayroll: "3. Group Payroll & Wage Inflation",
      sliderPayrollHint: "Annual wage indexation, minimum wage increase, and executive hiring",
      sliderCapex: "4. Unbudgeted Strategic CAPEX Program",
      sliderCapexHint: "Discretionary asset acquisitions or unplanned facility investments",
      sliderDebt: "5. New Bank Debt Facility Injected",
      sliderDebtHint: "Liquidity injection from new credit lines or senior facility drawdowns",
      simulatedResultsTitle: "Projected Consolidated Financial Impact",
      simulatedResultsSubtitle: "Consolidated outcome after stress factors are simultaneously applied",
      simRevenue: "Consolidated Revenue",
      simRevenueVariance: "Variance vs Base",
      simEbitda: "Simulated Group EBITDA",
      simEbitdaMargin: "Consolidated Margin",
      simCash: "Projected Group Cash",
      simDeployable: "Unrestricted Deployable",
      simNetDebt: "Consolidated Net Debt",
      simLeverage: "Leverage Ratio",
      stressWarningTitle: "Liquidity Resilience Breach Detected",
      stressWarningDesc: "Under this scenario, aggregate group cash falls below the mandatory operational security threshold. An immediate intercompany bridge loan or shareholder equity injection would be required to prevent technical default at Entity Beta.",
    },
    health: {
      title: "Data Quality Center & Audit Trail",
      subtitle: "Accounting completeness audit, ERP synchronization freshness, and consolidation integrity • Currency: ",
      bannerTitle: "Group Financial Reporting Integrity Guarantee",
      bannerDesc: "Consolidated reporting never silently merges stale or incomplete periods. All entities are synchronized with a consolidated freshness score of 95.2%. One 20,000 MAD intercompany discrepancy is currently under arbitration.",
      resolveDiscrepancy: "Arbitrate 20K Discrepancy",
      kpiFreshness: "Data Freshness Score",
      kpiFreshnessDesc: "Last close within T+2 days",
      kpiMissingPeriods: "Missing Accounting Periods",
      kpiMissingPeriodsDesc: "Zero chronological gaps detected",
      kpiPendingIntercompany: "Unresolved Intercompany Items",
      kpiPendingIntercompanyDesc: "Alpha vs Beta in active review",
      kpiBankFeeds: "Direct Banking Feeds Connected",
      kpiBankFeedsDesc: "Real-time automated bank APIs",
      tableTitle: "Completeness Audit & Technical Sync Status by Subsidiary",
      tableSubtitle: "Verification of ERP synchronization, budget imports, and automated bilateral reconciliations",
      colEntity: "Legal Entity",
      colLastImport: "Last Sync / Import",
      colBankFeed: "Live Bank Feed",
      colMissingPeriods: "Missing Periods",
      colIntercompanyGaps: "Intercompany Gaps",
      colBudgetConfig: "Budget Status",
      colFreshnessScore: "Freshness Score",
      colIntegrityStatus: "Audit Status",
      statusConnected: "Connected",
      statusFlatFile: "Flat File / Manual",
      statusCompliant: "Certified Compliant",
      statusReview: "Audit Review Required",
      statusConfigured: "Active",
      statusNotConfigured: "Not Configured",
    },
    reports: {
      title: "Consolidated Group Board Reports",
      subtitle: "Institutional management report and executive pack for Board, investors, and rating agencies • Currency: ",
      bannerTitle: "Consolidated Executive Management Pack (Q3 2026)",
      bannerDesc: "Official audit-ready presentation document for Board of Directors, shareholder meetings, and syndicated lenders.",
      printPdf: "Print / Export PDF",
      downloadReport: "Download Pack",
      docHeaderTitle: "Consolidated Group Financial Report",
      docHeaderPeriod: "Reporting Period: Q3 2026",
      docHeaderCurrency: "Reporting Currency: ",
      docHeaderIssued: "Issued: September 27, 2026",
      sec1Title: "1. Executive Summary & CFO Synthesis",
      sec2Title: "2. Key Consolidated Performance Indicators (KPIs)",
      sec3Title: "3. Detailed Subsidiary Performance Breakdown",
      sec4Title: "4. Consolidated Income Statement (P&L)",
      sec5Title: "5. Treasury Position & Ring-Fenced Reserves",
      sec12Title: "12. Key Identified Financial Risks & Exposures",
      sec13Title: "13. CFO Strategic Recommendations & Action Plan",
      colEntity: "Subsidiary",
      colTypeCountry: "Type & Country",
      colRevenue: "Revenue",
      colEbitda: "EBITDA",
      colCash: "Cash Balance",
      colDso: "DSO",
      colStatus: "Status",
      pnlGross: "Gross Aggregated Revenue",
      pnlElim: "Less: Intercompany Eliminations",
      pnlConsolidated: "= Net Consolidated Revenue",
      pnlEbitda: "= Group EBITDA",
      cashGross: "Gross Cash at Bank",
      cashOperational: "Less: Minimum Operational Buffer",
      cashDeployable: "= Unrestricted Deployable Cash",
      disclaimer: "This report is an internal executive management consolidation tool. It does not replace statutory audited financial statements prepared in accordance with IFRS or local GAAP standards.",
    },
    allocations: {
      title: "Headquarters Cost Allocations & Management Fees",
      subtitle: "Shared service allocation keys, cost pool distributions, and intercompany management fee agreements • Currency: ",
      bannerTitle: "Auditable Extra-Accounting Management Allocation Layer",
      bannerDesc: "Headquarters cost allocations operate as an analytical management layer: subsidiaries' underlying local statutory books remain strictly untouched. Rules are fully compliant with OECD transfer pricing guidelines.",
      newRuleBtn: "New Allocation Rule",
      kpiCentralPool: "Allocated Central Cost Pool",
      kpiCentralPoolDesc: "Shared HQ executive & IT expenses",
      kpiFeesBilled: "Annual Management Fees Billed",
      kpiFeesBilledDesc: "100% formalized under contract",
      kpiFeesCollected: "Management Fees Collected",
      kpiFeesCollectedDesc: "120K MAD overdue from Beta",
      costPoolsTitle: "Shared Headquarters Cost Pools & Split Keys",
      costPoolsSubtitle: "Distribution of headquarters costs using objective driver keys (Revenue share, headcount, fixed allocation)",
      managementFeesTitle: "Bilateral Intercompany Management Fee Agreements",
      managementFeesSubtitle: "Remuneration of parent company for strategic management, shared infrastructure, and oversight",
      colSubsidiary: "Debtor Subsidiary",
      colBasis: "Calculation Basis",
      colRateFormula: "Rate / Formula",
      colBilled: "Annual Billed Amount",
      colCollected: "Collected Amount",
      colOutstanding: "Outstanding Balance",
      colStatus: "Payment Status",
      statusUpToDate: "Current & Paid",
      statusOverdue: "Payment Overdue",
    },
    home: {
      heroBadgeCompany: "An EM300.co Company",
      heroBadgeOS: "Fynavo FinanceOS v2.4",
      heroBadgeSprint: "Multi-Entity Engine Active",
      heroTitle: "The Intelligent Financial Cockpit for Modern Holdings & Groups",
      heroSubtitle: "Empower CFOs, CEOs, and investment funds with consolidated real-time analytics, automated intercompany reconciliation, trapped cash detection, and 13-week runway forecasts.",
      ctaCockpit: "Launch Executive Cockpit",
      ctaStructure: "Explore Group Architecture",
      feature1Title: "Multi-Entity Consolidation",
      feature1Desc: "Instantly aggregate P&L, balance sheets, and cash across parent companies, operating subsidiaries, and project SPVs.",
      feature2Title: "Trapped vs Mobile Cash",
      feature2Desc: "Distinguish gross bank balances from genuinely deployable liquidity after deducting operational covenants and ring-fenced funds.",
      feature3Title: "Intercompany Elimination",
      feature3Desc: "Automatic detection of bilateral reciprocity discrepancies (e.g. 20K mismatch) with instant one-click reconciliation journals.",
      feature4Title: "13-Week Cash Forecast",
      feature4Desc: "Predictive short-term liquidity simulations detecting surplus vs deficit entities with intra-group loan balancing.",
      previewTitle: "Live Consolidation Cockpit Preview",
      previewConsolidatedNet: "Consolidated Revenue",
      previewDeployableRatio: "Deployable Cash Ratio",
      previewIntercompanyZero: "Intra-Group Debt Neutralized",
      footerText: "© 2026 Fynavo Technologies. All rights reserved. Built for institutional CFOs and enterprise holdings.",
    },
  },
  fr: {
    common: {
      consolidated: "Groupe Consolidé",
      group: "Groupe",
      entity: "Entité",
      subsidiary: "Filiale",
      holding: "Holding",
      spv: "SPV / Véhicule Projet",
      asset: "Actif / Business Unit",
      actions: "Actions",
      search: "Rechercher",
      filter: "Filtrer",
      all: "Tous",
      allCountries: "Tous les pays",
      allEntities: "Toutes les entités",
      allTypes: "Tous les types",
      healthy: "Sain",
      watch: "Sous surveillance",
      critical: "Tension critique",
      insufficientData: "En examen",
      active: "Actif",
      operating: "En exploitation",
      preOperating: "Pré-opérationnel",
      inLiquidation: "En liquidation",
      save: "Enregistrer les modifications",
      cancel: "Annuler",
      close: "Fermer",
      edit: "Modifier",
      delete: "Supprimer",
      export: "Exporter",
      viewDetails: "Voir détails",
      drillDown: "Explorer",
      refresh: "Actualiser",
      liveSync: "Synchronisation en direct",
      lastUpdate: "Dernière mise à jour",
      learnMore: "En savoir plus",
      settings: "Paramètres",
      helpDocs: "Documentation & API",
      systemFreshness: "Fraîcheur des données",
    },
    nav: {
      groupPilotage: "PILOTAGE GROUPE",
      systemFoundations: "SYSTÈME & FONDATIONS",
      executiveCockpit: "Cockpit Exécutif",
      groupStructure: "Structure du groupe",
      performanceBenchmarking: "Performance & Comparaison",
      cashMobility: "Trésorerie & Mobilité",
      forecast13Weeks: "Prévisions 13 semaines",
      intercompanyEliminations: "Intercompany & Éliminations",
      debtCapital: "Dette Financière & Capital",
      capexPipeline: "CAPEX Pipeline",
      consolidatedBudget: "Budget Consolidé vs Réel",
      scenarioEngine: "Moteur de Scénarios",
      healthAudit: "Santé & Qualité Données",
      consolidatedReports: "Rapports Consolidés",
      allocationsFees: "Allocations & Frais de Siège",
      designSystem: "Design System Financier",
      treeBadge: "Arborescence",
      aiBadge: "IA 13S",
      alertBadge: "Alerte 20K",
      proBadge: "CFO Pro",
    },
    header: {
      commandSearch: "Rechercher une entité, un KPI, un compte...",
      commandShortcut: "⌘K",
      liveSyncTooltip: "Flux temps réel connecté • Latence nulle",
      currencyMAD: "MAD (Dirham Marocain)",
      currencyEUR: "EUR (Euro)",
      currencyUSD: "USD (Dollar US)",
      currencyGBP: "GBP (Livre Sterling)",
      notifications: "Notifications & Alertes",
      markAllRead: "Tout marquer comme lu",
      noNotifications: "Tous les indicateurs sont au vert. Aucune anomalie en attente.",
      userRole: "Directeur Financier (CFO)",
      userGroup: "Atlas Alliance Group SA",
      switchLanguage: "Changer de langue",
      viewProfile: "Profil Exécutif",
      logOut: "Déconnexion",
    },
    command: {
      placeholder: "Tapez une commande ou cherchez une entité, un KPI...",
      quickLinks: "Navigation Rapide",
      entitiesSection: "Entités & SPVs du Groupe",
      modulesSection: "Modules Financiers",
      noResults: "Aucun résultat trouvé.",
      tipEsc: "Appuyez sur Échap pour fermer",
    },
    dashboard: {
      heroTitle: "Cockpit Financier Consolidé",
      heroSubtitle: "Pilotage multi-entités en temps réel, éliminations intercompany, trésorerie mobilisable et prévisions 13 semaines.",
      activeSprint: "Sprint Multi-Entités Actif",
      quickActions: "Actions Rapides",
      runStressTest: "Lancer un Stress-Test",
      reconcileIntercompany: "Rapprochement Intercompany",
      exportCFOBoardPack: "Dossier Conseil (PDF)",
      newSubsidiary: "Ajouter une Filiale / SPV",
      // KPIs
      kpiRevenue: "Chiffre d'Affaires Consolidé",
      kpiRevenueDesc: "Net des éliminations internes (1,05M)",
      kpiEbitda: "EBITDA Groupe",
      kpiEbitdaDesc: "Marge consolidée : 23,9%",
      kpiCashTotal: "Trésorerie Brute Totale",
      kpiCashDeployable: "Liquidité Mobilisable",
      kpiCashDesc: "Hors réserves d'exploitation (4,75M)",
      kpiNetDebt: "Dette Nette Consolidée",
      kpiNetDebtDesc: "Neutralisation du prêt interne (1,50M)",
      kpiWorkingCapital: "Besoin en Fonds de Roulement (BFR)",
      kpiWorkingCapitalDesc: "DSO moyen : 58j • Beta sous tension",
      kpiRunway: "Runway Moyen Groupe",
      kpiRunwayDesc: "Horizon de trésorerie simulé à 13 sem.",
      // Banners
      criticalAlertTitle: "Entity Beta : Tension de trésorerie critique sous 4 semaines",
      criticalAlertDesc: "Un DSO élevé (88 jours) et 6,4 M MAD de créances échues créent un découvert prévisionnel de 820 K MAD en semaine 5. Action conseillée : prêt relais depuis Alpha ou apport en CCA.",
      discrepancyAlertTitle: "Écart de réconciliation intercompany : 20 000 MAD (Alpha vs Beta)",
      discrepancyAlertDesc: "Alpha a déclaré une créance de 500 000 MAD contre une dette de 480 000 MAD enregistrée chez Beta. Ce décalage temporel nécessite un arbitrage comptable avant clôture.",
      resolveButton: "Résoudre l'Écart",
      simulateBridgeLoan: "Simuler un Prêt Relais",
      // Table
      tableTitle: "Matrice de Performance des Filiales & Entités",
      tableSubtitle: "Comparatif complet P&L, bilan, trésorerie, ratios d'endettement et score de santé financier explicable.",
      filterAll: "Toutes les entités (5)",
      filterOperating: "Filiales Opérationnelles",
      filterHoldingSpv: "Holding & SPVs",
      filterAttention: "Sous surveillance (2)",
      colEntity: "Entité Juridique",
      colCountry: "Pays & Devise",
      colOwnership: "Détention %",
      colRevenue: "Chiffre d'Affaires",
      colEbitda: "EBITDA (Marge)",
      colCash: "Trésorerie / Mobilisable",
      colGrossDebt: "Dette Brute",
      colNetDebt: "Dette Nette",
      colWorkingCapital: "BFR",
      colHealthScore: "Score Santé",
      colActions: "Actions",
      deployableSuffix: "mobilisable",
      operationalBufferSuffix: "tampon opérationnel",
      // Health Pillars
      pillarRentability: "Rentabilité",
      pillarCash: "Trésorerie & Runway",
      pillarBFR: "BFR & DSO",
      pillarSolvency: "Solvabilité & Dettes",
      pillarBudget: "Discipline Budgétaire",
      pillarQuality: "Qualité des Données",
    },
    structure: {
      title: "Structure du Groupe & Arborescence Juridique",
      subtitle: "Organigramme dynamique des participations, méthodes de consolidation et gouvernance • Devise : ",
      addEntityBtn: "Ajouter une Entité / SPV",
      searchPlaceholder: "Rechercher par nom, ICE, code comptable...",
      totalEntities: "Entités dans le périmètre",
      fullConsolidation: "Intégration Globale (IG)",
      equityMethod: "Mise en Équivalence (ME)",
      proportionalMethod: "Intégration Proportionnelle (IP)",
      createNewEntityModalTitle: "Création d'une Nouvelle Entité / SPV",
      createNewEntityModalDesc: "Renseignez les informations juridiques, capitalistiques, comptables et le rattachement hiérarchique.",
      fieldName: "Nom Commercial",
      fieldLegalName: "Raison Sociale Juridique",
      fieldType: "Type d'Entité",
      fieldParent: "Société Mère Directe",
      fieldCountry: "Pays / Juridiction",
      fieldCurrency: "Devise Fonctionnelle",
      fieldOwnership: "Pourcentage de Détention Directe (%)",
      fieldConsolidationMethod: "Méthode de Consolidation",
      fieldStatus: "Statut Opérationnel",
      fieldSector: "Secteur d'Activité",
      submitCreate: "Créer et Rapprocher l'Entité",
    },
    cash: {
      title: "Trésorerie Groupe & Mobilité de Liquidité",
      subtitle: "Séparation stricte du disponible réel, réserves d'exploitation obligatoires et contraintes de transfert • Devise : ",
      diagnosticTitle: "Diagnostic de Liquidité Mobilisable",
      diagnosticDesc: "Le groupe affiche un solde bancaire brut de",
      totalBankCash: "Solde Bancaire Brut",
      minOperatingBuffer: "Tampon Opérationnel Obligatoire",
      restrictedCash: "Fonds Bloqués / Cantonnés SPV",
      deployableLiquidity: "Liquidité Réellement Mobilisable",
      mobilityRatio: "Ratio de Mobilité de Trésorerie",
      cashByCountryTitle: "Répartition Géographique du Cash",
      entityBreakdownTitle: "Liquidités par Filiale & Frictions de Transfert",
    },
    scenarios: {
      title: "Moteur de Scénarios Groupe & Stress-Test",
      subtitle: "Simulation dynamique multi-variables et impact instantané sur la liquidité, l'EBITDA et les covenants • Devise : ",
      bannerTitle: "Simulateur de Chocs Financiers Groupe",
      bannerDesc: "Modélisez des hypothèses conjointes de crise, tension BFR et contraintes de liquidité consolidée.",
      reset: "Réinitialiser",
      applyCrisis: "Appliquer Scénario de Crise",
      applyBase: "Scénario Central",
      hypothesesTitle: "Hypothèses de Simulation Groupe",
      hypothesesSubtitle: "Ajustez les curseurs pour recalculer le modèle et la résilience en temps réel",
      sliderAlphaRevenue: "1. Choc de CA Entity Alpha",
      sliderAlphaRevenueHint: "Simulation de perte de contrats institutionnels majeurs",
      sliderBetaDso: "2. Allongement Délai Clients Beta (DSO)",
      sliderBetaDsoHint: "DSO s'allonge et piège du cash dans les créances clients",
      sliderPayroll: "3. Inflation Masse Salariale Groupe",
      sliderPayrollHint: "Hausse SMIG, revalorisation générale et recrutements holding",
      sliderCapex: "4. Programme CAPEX Non Budgété",
      sliderCapexHint: "Décaissements d'investissements stratégiques imprévus",
      sliderDebt: "5. Nouvelle Ligne de Financement / Emprunt",
      sliderDebtHint: "Injection de trésorerie par tirage sur nouvelle ligne senior",
      simulatedResultsTitle: "Impact Consolidé Simulé",
      simulatedResultsSubtitle: "Résultats prévisionnels après application simultanée des chocs",
      simRevenue: "Chiffre d'Affaires Consolidé",
      simRevenueVariance: "Écart vs Budget",
      simEbitda: "EBITDA Consolidé Simulé",
      simEbitdaMargin: "Marge EBITDA",
      simCash: "Trésorerie Groupe Projetée",
      simDeployable: "Trésorerie Déployable",
      simNetDebt: "Dette Nette Consolidée",
      simLeverage: "Levier d'Endettement",
      stressWarningTitle: "Alerte Résilience & Seuil Critique Atteint",
      stressWarningDesc: "Sous ce scénario, la trésorerie globale passe sous le seuil minimal de sécurité opérationnelle. Un prêt relais intra-groupe ou une injection d'actionnaires est impératif pour éviter une cessation de paiement sur Beta.",
    },
    health: {
      title: "Santé des Entités & Qualité des Données (Data Quality Center)",
      subtitle: "Audit de complétude comptable, fraîcheur des imports et intégrité de consolidation • Devise : ",
      bannerTitle: "Garantie d'Intégrité Comptable du Reporting Groupe",
      bannerDesc: "Le reporting consolidé ne mélange jamais silencieusement des périodes incomplètes. Toutes les entités sont synchronisées avec un score moyen de 95.2%. Un écart intercompany de 20 000 MAD est sous arbitrage.",
      resolveDiscrepancy: "Résoudre l'écart 20K",
      kpiFreshness: "Score de Fraîcheur des Données",
      kpiFreshnessDesc: "Dernière clôture à J+2",
      kpiMissingPeriods: "Périodes Comptables Manquantes",
      kpiMissingPeriodsDesc: "Aucune rupture chronologique",
      kpiPendingIntercompany: "Flux Intercompany en Suspends",
      kpiPendingIntercompanyDesc: "Alpha vs Beta en réconciliation",
      kpiBankFeeds: "Flux Bancaires Directs Connectés",
      kpiBankFeedsDesc: "API bancaires temps réel",
      tableTitle: "Audit de Complétude & Statut Technique par Entité",
      tableSubtitle: "Vérification de l'état de synchronisation ERP, des budgets et des rapprochements",
      colEntity: "Entité / Société",
      colLastImport: "Dernier Import",
      colBankFeed: "Flux Bancaire Direct",
      colMissingPeriods: "Périodes Manquantes",
      colIntercompanyGaps: "Écarts Intercompany",
      colBudgetConfig: "Budget Paramétré",
      colFreshnessScore: "Score de Fraîcheur",
      colIntegrityStatus: "Statut d'Intégrité",
      statusConnected: "Connecté",
      statusFlatFile: "Fichier plat / Manuel",
      statusCompliant: "Certifié conforme",
      statusReview: "Revue requise",
      statusConfigured: "Actif",
      statusNotConfigured: "Non configuré",
    },
    reports: {
      title: "Rapports Financiers Consolidés du Groupe",
      subtitle: "Rapport de gestion institutionnel multi-entités pour Conseil d'Administration et banques • Devise : ",
      bannerTitle: "Rapport de Gestion Consolidé T3 2026",
      bannerDesc: "Document officiel de gouvernance pour Conseil d'Administration, investisseurs et partenaires financiers.",
      printPdf: "Imprimer / Exporter PDF",
      downloadReport: "Télécharger le Dossier",
      docHeaderTitle: "Rapport Financier Consolidé du Groupe",
      docHeaderPeriod: "Période : T3 2026",
      docHeaderCurrency: "Devise : ",
      docHeaderIssued: "Date d'émission : 27/09/2026",
      sec1Title: "1. Executive Summary & Synthèse DAF",
      sec2Title: "2. Indicateurs Consolidés Clés (Group KPIs)",
      sec3Title: "3. Performance Détaillée par Filiale",
      sec4Title: "4. Compte de Résultat Consolidé (P&L)",
      sec5Title: "5. Trésorerie & Réserves d'Exploitation",
      sec12Title: "12. Principaux Risques Financiers Identifiés",
      sec13Title: "13. Actions Recommandées par la Direction Financière",
      colEntity: "Entité",
      colTypeCountry: "Type & Pays",
      colRevenue: "CA",
      colEbitda: "EBITDA",
      colCash: "Trésorerie",
      colDso: "DSO",
      colStatus: "Statut",
      pnlGross: "Chiffre d'Affaires Brut Agrégé",
      pnlElim: "Moins : Élimination flux internes",
      pnlConsolidated: "= Chiffre d'Affaires Consolidé",
      pnlEbitda: "= EBITDA Consolidé",
      cashGross: "Trésorerie Brute en Banque",
      cashOperational: "Moins : Minimum opérationnel sécurité",
      cashDeployable: "= Trésorerie Réellement Mobilisable",
      disclaimer: "Ce rapport est un outil de gestion et de pilotage financier interne (Consolidation de gestion). Il ne remplace pas les états financiers de consolidation statutaire audités selon les normes IFRS.",
    },
    allocations: {
      title: "Allocations de Coûts Centraux & Management Fees",
      subtitle: "Règles de répartition des frais de siège et conventions d'honoraires de gestion • Devise : ",
      bannerTitle: "Couche de Gestion Extra-Comptable Auditable",
      bannerDesc: "Les allocations de charges de siège constituent une couche analytique de gestion : les écritures comptables d'origine des entités restent strictement intactes. Les règles respectent les normes OCDE sur les prix de transfert.",
      newRuleBtn: "Nouvelle règle d'allocation",
      kpiCentralPool: "Pool de Frais Centraux Réparti",
      kpiCentralPoolDesc: "Charges de holding mutualisées",
      kpiFeesBilled: "Management Fees Facturés",
      kpiFeesBilledDesc: "100% formalisés sous contrat",
      kpiFeesCollected: "Management Fees Recouvrés",
      kpiFeesCollectedDesc: "120K MAD en attente sur Beta",
      costPoolsTitle: "Règles d'Allocation des Coûts Partagés (Cost Pools)",
      costPoolsSubtitle: "Répartition des dépenses de siège selon des clés objectives (Chiffre d'affaires, effectifs, quote-part fixe)",
      managementFeesTitle: "Conventions de Management Fees Intra-Groupe",
      managementFeesSubtitle: "Rémunération de la société mère pour l'animation managériale et la stratégie des filiales",
      colSubsidiary: "Filiale Redevable",
      colBasis: "Base de Calcul",
      colRateFormula: "Taux / Formule",
      colBilled: "Montant Facturé Annuel",
      colCollected: "Montant Encaissé",
      colOutstanding: "Reste Dû",
      colStatus: "Statut",
      statusUpToDate: "À jour",
      statusOverdue: "Retard de paiement",
    },
    home: {
      heroBadgeCompany: "Une Entreprise EM300.co",
      heroBadgeOS: "Fynavo FinanceOS v2.4",
      heroBadgeSprint: "Moteur Multi-Entités Actif",
      heroTitle: "Le Cockpit Financier Intelligent des Groupes & Holdings Modernes",
      heroSubtitle: "Offrez aux CFOs, CEOs et fonds d'investissement une vision consolidée en temps réel, la réconciliation automatique intercompany, la détection des liquidités piégées et les prévisions de trésorerie à 13 semaines.",
      ctaCockpit: "Accéder au Cockpit Exécutif",
      ctaStructure: "Arborescence du Groupe",
      feature1Title: "Consolidation Multi-Entités",
      feature1Desc: "Agrégez instantanément P&L, bilans et flux de trésorerie entre holding mère, filiales opérationnelles et SPVs de projets.",
      feature2Title: "Liquidité Mobilisable vs Piégée",
      feature2Desc: "Distinguez immédiatement les soldes bancaires bruts de la trésorerie réellement utilisable après déduction des covenants et réserves.",
      feature3Title: "Éliminations Intercompany",
      feature3Desc: "Détection automatique des écarts de réciprocité (ex: divergence 20 000 MAD) et écritures de réconciliation en un clic.",
      feature4Title: "Prévisions de Cash à 13 Semaines",
      feature4Desc: "Modélisation dynamique de la trésorerie court terme détectant les entités en excédent vs déficit pour arbitrage interne.",
      previewTitle: "Aperçu Interactif du Cockpit Consolidé",
      previewConsolidatedNet: "Chiffre d'Affaires Consolidé",
      previewDeployableRatio: "Ratio Trésorerie Mobilisable",
      previewIntercompanyZero: "Dettes Intra-Groupe Neutralisées",
      footerText: "© 2026 Fynavo Technologies. Tous droits réservés. Conçu pour les directions financières institutionnelles et holdings.",
    },
  },
};
