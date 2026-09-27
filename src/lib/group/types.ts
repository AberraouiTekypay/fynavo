// Fynavo Multi-Entity & Multi-Asset Hierarchy Types
// Industry-Agnostic Management Platform Architecture

export type EntityType =
  | "group"
  | "holding"
  | "management_company"
  | "company"
  | "subsidiary"
  | "spv"
  | "branch"
  | "business_unit"
  | "asset"
  | "project"
  | "other";

export type OperationalStatus =
  | "formation"
  | "pre_opening"
  | "operating"
  | "mature"
  | "closed";

export type LegalStatus =
  | "active"
  | "inactive"
  | "in_liquidation"
  | "dormant";

export type ConsolidationMethod =
  | "full" // Intégration globale (100% ou contrôle exclusif)
  | "proportional" // Intégration proportionnelle (partage de contrôle)
  | "equity" // Mise en équivalence (influence notable)
  | "excluded"; // Hors périmètre de consolidation

export type CurrencyCode = "MAD" | "EUR" | "USD" | "GBP" | "XOF" | string;

export type CashMobilityStatus =
  | "freely_available" // Trésorerie librement transférable
  | "operational_minimum" // Réserve de sécurité opérationnelle
  | "restricted" // Restreinte par covenants bancaires
  | "reserved" // Réservée (impôts, dividendes votés, projet)
  | "legally_constrained" // Contrôle des changes / restrictions légales
  | "unknown";

export type IntercompanyType =
  | "management_fee"
  | "intercompany_loan"
  | "shareholder_loan"
  | "current_account" // Compte courant d'associé
  | "capital_contribution"
  | "cost_recharge"
  | "shared_services"
  | "procurement_recharge"
  | "capex_funding"
  | "internal_sales"
  | "dividend"
  | "cash_advance"
  | "other";

export type ReconciliationStatus =
  | "matched"
  | "partial_match"
  | "unmatched"
  | "eliminated"
  | "review_required";

export type DebtFacilityType =
  | "bank_loan"
  | "shareholder_loan"
  | "bond"
  | "leasing"
  | "overdraft"
  | "credit_line"
  | "intercompany_debt"
  | "other";

export type CapexCategory =
  | "construction"
  | "fit_out"
  | "equipment"
  | "technology"
  | "licences"
  | "vehicles"
  | "renovation"
  | "other";

export type CapexStatus =
  | "planned"
  | "approved"
  | "committed"
  | "paid"
  | "completed"
  | "cancelled";

export type AllocationMethod =
  | "revenue_pct"
  | "headcount"
  | "fixed_pct"
  | "equal_split"
  | "manual";

export type HealthPillarStatus = "healthy" | "watch" | "critical" | "insufficient_data";

export interface Group {
  id: string;
  name: string;
  code: string;
  consolidationCurrency: CurrencyCode;
  description: string;
  headquartersCountry: string;
  createdAt: string;
}

export interface Entity {
  id: string;
  groupId: string;
  parentId: string | null;
  name: string;
  legalName: string;
  code: string;
  type: EntityType;
  country: string;
  functionalCurrency: CurrencyCode;
  reportingCurrency: CurrencyCode;
  ownershipPercentage: number; // e.g. 100, 80, 60
  consolidationMethod: ConsolidationMethod;
  operationalStatus: OperationalStatus;
  legalStatus: LegalStatus;
  taxId?: string;
  sector: string;
  description?: string;
  // Financial Snapshot
  financials: {
    revenue: number;
    ebitda: number;
    ebitdaMargin: number;
    cash: number;
    operationalMinimum: number;
    deployableCash: number;
    grossDebt: number;
    netDebt: number;
    workingCapital: number;
    dso: number; // Days sales outstanding
    dpo: number; // Days payables outstanding
    arOverdue: number; // Overdue receivables
    apBalance: number; // Suppliers payables
    capexCommitted: number;
    budgetVariancePct: number; // e.g. +4.2% or -1.5%
    runwayMonths: number;
    cashTrendWeekly: number[]; // 13-week cash trend
  };
  healthPillars: {
    liquidity: { status: HealthPillarStatus; reason: string };
    profitability: { status: HealthPillarStatus; reason: string };
    workingCapital: { status: HealthPillarStatus; reason: string };
    budgetControl: { status: HealthPillarStatus; reason: string };
    debtSolvency: { status: HealthPillarStatus; reason: string };
    dataQuality: { status: HealthPillarStatus; reason: string };
  };
  dataQuality: {
    lastUpdate: string;
    missingPeriodsCount: number;
    unmatchedIntercompanyCount: number;
    bankFeedConnected: boolean;
    budgetConfigured: boolean;
    freshnessScorePct: number;
  };
}

export interface AssetOrProject {
  id: string;
  entityId: string;
  name: string;
  code: string;
  type: "asset" | "project" | "business_unit" | "branch";
  status: OperationalStatus;
  revenue: number;
  costs: number;
  ebitda: number;
  capexBudget: number;
  capexSpent: number;
  description: string;
}

export interface IntercompanyTransaction {
  id: string;
  groupId: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: IntercompanyType;
  amount: number;
  currency: CurrencyCode;
  convertedAmountMAD: number;
  date: string;
  period: string;
  description: string;
  status: ReconciliationStatus;
  isRecurring: boolean;
  reconciliationNotes?: string;
  supportingDocumentUrl?: string;
  counterpartyTransactionId?: string;
  discrepancyAmount?: number; // E.g. 20,000 MAD
}

export interface EliminationEntry {
  id: string;
  groupId: string;
  period: string;
  account: string;
  debit: number;
  credit: number;
  sourceEntityId: string;
  targetEntityId: string;
  eliminationType: "management_fee" | "intercompany_loan" | "cost_recharge" | "dividend" | "internal_sale";
  status: "eliminated" | "review_required" | "pending";
  notes: string;
}

export interface DebtFacility {
  id: string;
  entityId: string;
  lenderName: string;
  facilityType: DebtFacilityType;
  originalAmount: number;
  outstandingAmount: number;
  currency: CurrencyCode;
  interestRatePct: number;
  maturityDate: string;
  annualService: number;
  covenantDescription: string;
  collateralNotes: string;
}

export interface CapexItem {
  id: string;
  entityId: string;
  assetProjectId?: string;
  name: string;
  category: CapexCategory;
  supplier: string;
  budgetAmount: number;
  committedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  expectedPaymentDate: string;
  fundingSource: "cash" | "intercompany_loan" | "bank_debt" | "leasing" | "equity";
  status: CapexStatus;
}

export interface CostAllocationRule {
  id: string;
  groupId: string;
  sourceEntityId: string;
  costPoolName: string;
  annualPoolAmount: number;
  method: AllocationMethod;
  splits: {
    entityId: string;
    percentage: number;
    allocatedAmount: number;
  }[];
  active: boolean;
}

export interface ManagementFeeRule {
  id: string;
  holdingEntityId: string;
  subsidiaryEntityId: string;
  calculationBasis: "fixed_monthly" | "pct_revenue" | "pct_ebitda";
  rateOrAmount: number;
  annualBilledMAD: number;
  annualCollectedMAD: number;
  outstandingMAD: number;
  status: "active" | "paused";
}

export interface ShareholderCapital {
  id: string;
  entityId: string;
  shareholderName: string;
  ownershipPct: number;
  shareCapitalAmount: number;
  currentAccountBalance: number; // Compte courant d'associé
  shareholderType: "holding" | "individual" | "institution" | "co_investor";
}

export interface FXRate {
  pair: string; // e.g. "EUR/MAD"
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  effectiveMonth: string;
  manualOverride: boolean;
}
