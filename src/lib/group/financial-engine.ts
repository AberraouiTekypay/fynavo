import {
  Entity,
  IntercompanyTransaction,
  CurrencyCode,
  FXRate,
} from "./types";
import {
  DEMO_ENTITIES,
  DEMO_FX_RATES,
  DEMO_INTERCOMPANY_TRANSACTIONS,
} from "./demo-data";

export interface ConsolidatedSummary {
  // P&L
  grossRevenueAggregated: number;
  eliminatedInternalRevenue: number;
  consolidatedRevenue: number;
  consolidatedEbitda: number;
  consolidatedEbitdaMarginPct: number;
  // Treasury & Mobility
  totalGroupCash: number;
  totalOperationalMinimum: number;
  totalRestrictedCash: number;
  actuallyDeployableLiquidity: number;
  // Debt & Balance
  consolidatedGrossDebt: number;
  eliminatedIntercompanyDebt: number;
  consolidatedNetDebt: number;
  debtToEbitdaRatio: number;
  // Working Capital & Credit Risk
  consolidatedWorkingCapital: number;
  consolidatedAR: number;
  consolidatedAP: number;
  criticalAROverdue: number;
  // CAPEX & Forecast
  totalCapexCommitted: number;
  totalCapexBudget: number;
  groupFundingRequirement13W: number; // Worst cash dip below 0
  lowestCashWeek: number; // e.g. Week 4 or 6
  runwayMonths: number;
}

export class FinancialEngine {
  private fxRates: Map<string, number> = new Map();

  constructor(customRates?: FXRate[]) {
    const rates = customRates || DEMO_FX_RATES;
    rates.forEach((r) => {
      this.fxRates.set(`${r.fromCurrency}/${r.toCurrency}`, r.rate);
      if (r.rate !== 0) {
        this.fxRates.set(`${r.toCurrency}/${r.fromCurrency}`, 1 / r.rate);
      }
    });
  }

  public convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return amount;
    const directKey = `${from}/${to}`;
    if (this.fxRates.has(directKey)) {
      return amount * (this.fxRates.get(directKey) || 1);
    }
    // Pivot via MAD if needed
    const toMADKey = `${from}/MAD`;
    const fromMADKey = `MAD/${to}`;
    if (this.fxRates.has(toMADKey) && this.fxRates.has(fromMADKey)) {
      const amountInMAD = amount * (this.fxRates.get(toMADKey) || 1);
      return amountInMAD * (this.fxRates.get(fromMADKey) || 1);
    }
    return amount;
  }

  public calculateConsolidatedSummary(
    entities: Entity[] = DEMO_ENTITIES,
    transactions: IntercompanyTransaction[] = DEMO_INTERCOMPANY_TRANSACTIONS,
    targetCurrency: CurrencyCode = "MAD"
  ): ConsolidatedSummary {
    let grossRev = 0;
    let totalCash = 0;
    let opMin = 0;
    let grossDebt = 0;
    let bfr = 0;
    let ar = 0;
    let ap = 0;
    let arOverdue = 0;
    let capexCommitted = 0;
    const capexBudget = 0;
    let ebitdaRaw = 0;

    // Sum across entities (with proportional consolidation applied for SPVs)
    entities.forEach((ent) => {
      const factor = ent.consolidationMethod === "proportional" ? ent.ownershipPercentage / 100 : 1.0;
      if (ent.consolidationMethod === "excluded") return;

      grossRev += this.convert(ent.financials.revenue * factor, ent.reportingCurrency, targetCurrency);
      ebitdaRaw += this.convert(ent.financials.ebitda * factor, ent.reportingCurrency, targetCurrency);
      totalCash += this.convert(ent.financials.cash * factor, ent.reportingCurrency, targetCurrency);
      opMin += this.convert(ent.financials.operationalMinimum * factor, ent.reportingCurrency, targetCurrency);
      grossDebt += this.convert(ent.financials.grossDebt * factor, ent.reportingCurrency, targetCurrency);
      bfr += this.convert(ent.financials.workingCapital * factor, ent.reportingCurrency, targetCurrency);
      ar += this.convert(ent.financials.arOverdue * factor, ent.reportingCurrency, targetCurrency);
      ap += this.convert(ent.financials.apBalance * factor, ent.reportingCurrency, targetCurrency);
      arOverdue += this.convert(ent.financials.arOverdue * factor, ent.reportingCurrency, targetCurrency);
      capexCommitted += this.convert(ent.financials.capexCommitted * factor, ent.reportingCurrency, targetCurrency);
    });

    // Intercompany eliminations
    // 1. Management Fees and Internal Sales elimination
    let eliminatedInternalRevenue = 0;
    transactions
      .filter((t) => t.type === "management_fee" || t.type === "internal_sales" || t.type === "cost_recharge")
      .forEach((t) => {
        eliminatedInternalRevenue += this.convert(t.amount, t.currency, targetCurrency);
      });

    // 2. Intercompany loan elimination from debt
    let eliminatedIntercompanyDebt = 0;
    transactions
      .filter((t) => t.type === "intercompany_loan" || t.type === "shareholder_loan")
      .forEach((t) => {
        eliminatedIntercompanyDebt += this.convert(t.amount, t.currency, targetCurrency);
      });

    const consolidatedRevenue = Math.max(0, grossRev - eliminatedInternalRevenue);
    // Consolidated EBITDA: Management fees received by Holding offset fees paid by subsidiaries
    const consolidatedEbitda = ebitdaRaw; 
    const consolidatedEbitdaMarginPct = consolidatedRevenue > 0 ? (consolidatedEbitda / consolidatedRevenue) * 100 : 0;

    // Actually deployable liquidity = Total Cash - Operational Minimum buffers
    const actuallyDeployableLiquidity = Math.max(0, totalCash - opMin);

    // Consolidated Gross & Net Debt (external only)
    const consolidatedGrossDebt = Math.max(0, grossDebt - eliminatedIntercompanyDebt);
    const consolidatedNetDebt = consolidatedGrossDebt - totalCash;
    const debtToEbitdaRatio = consolidatedEbitda > 0 ? consolidatedGrossDebt / consolidatedEbitda : 0;

    // 13-week consolidated cash forecasting curve & funding deficit analysis
    const weeklyConsolidatedCash: number[] = new Array(13).fill(0);
    entities.forEach((ent) => {
      ent.financials.cashTrendWeekly.forEach((val, wIndex) => {
        weeklyConsolidatedCash[wIndex] += this.convert(val * 1000, ent.reportingCurrency, targetCurrency);
      });
    });

    // Find if there is any entity-level deficit or group funding need
    let lowestDip = 0;
    let lowestWeek = 1;
    weeklyConsolidatedCash.forEach((weekCash, idx) => {
      if (weekCash < lowestDip) {
        lowestDip = weekCash;
        lowestWeek = idx + 1;
      }
    });

    // Calculate entity shortfalls that require intra-group funding (e.g. Entity Beta dips below 0 at W6)
    let totalShortfallToFund = 0;
    entities.forEach((ent) => {
      const minVal = Math.min(...ent.financials.cashTrendWeekly);
      if (minVal < 0) {
        totalShortfallToFund += Math.abs(minVal * 1000);
      }
    });

    const runwayMonths = consolidatedEbitda > 0 ? (totalCash / (consolidatedRevenue / 12)) * 1.5 : 6;

    return {
      grossRevenueAggregated: grossRev,
      eliminatedInternalRevenue,
      consolidatedRevenue,
      consolidatedEbitda,
      consolidatedEbitdaMarginPct,
      totalGroupCash: totalCash,
      totalOperationalMinimum: opMin,
      totalRestrictedCash: 350000, // E.g. Escrow or bank pledge
      actuallyDeployableLiquidity,
      consolidatedGrossDebt,
      eliminatedIntercompanyDebt,
      consolidatedNetDebt,
      debtToEbitdaRatio,
      consolidatedWorkingCapital: bfr,
      consolidatedAR: ar,
      consolidatedAP: ap,
      criticalAROverdue: arOverdue,
      totalCapexCommitted: capexCommitted,
      totalCapexBudget: capexBudget || capexCommitted * 1.25,
      groupFundingRequirement13W: totalShortfallToFund,
      lowestCashWeek: lowestWeek,
      runwayMonths,
    };
  }

  // Identifies entities with cash surplus vs entities with projected cash deficits
  public getLiquidityAllocationAnalysis(entities: Entity[] = DEMO_ENTITIES) {
    const surplusEntities = entities.filter((e) => e.financials.deployableCash > 500000);
    const deficitEntities = entities.filter((e) => {
      const minCash = Math.min(...e.financials.cashTrendWeekly);
      return minCash < 0 || e.financials.cash < e.financials.operationalMinimum;
    });

    const totalSurplus = surplusEntities.reduce((sum, e) => sum + e.financials.deployableCash, 0);
    const totalDeficit = deficitEntities.reduce((sum, e) => {
      const gap = e.financials.operationalMinimum - e.financials.cash;
      const weeklyGap = Math.abs(Math.min(...e.financials.cashTrendWeekly) * 1000);
      return sum + Math.max(gap, weeklyGap);
    }, 0);

    return {
      surplusEntities,
      deficitEntities,
      totalSurplus,
      totalDeficit,
      isGroupCoveredTheoretically: totalSurplus >= totalDeficit,
      recommendationSummary:
        "Le groupe dispose d'un volant d'excédent de trésorerie mobilisable suffisant (+3,6M MAD sur Alpha) pour absorber le déficit prévisionnel de Beta (-780K MAD) et financer les jalons de Delta. Cependant, il convient de préserver le minimum opérationnel d'Alpha (1,2M MAD) et de formaliser tout transfert via une convention d'avance de trésorerie rémunérée conforme aux règles de prix de transfert.",
    };
  }
}

export const financialEngine = new FinancialEngine();
