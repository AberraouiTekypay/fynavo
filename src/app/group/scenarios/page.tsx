"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  GitBranch,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function GroupScenariosPage() {
  const { consolidatedSummary, consolidationCurrency } = useGroup();
  const { t, locale, formatMoney } = useLanguage();

  // Scenario input assumptions
  const [alphaRevenueShockPct, setAlphaRevenueShockPct] = React.useState<number>(0);
  const [betaCollectionDelayDays, setBetaCollectionDelayDays] = React.useState<number>(0);
  const [payrollInflationPct, setPayrollInflationPct] = React.useState<number>(0);
  const [newCapexMillions, setNewCapexMillions] = React.useState<number>(0);
  const [newDebtFacilityMillions, setNewDebtFacilityMillions] = React.useState<number>(0);

  // Dynamic calculations based on assumptions
  const simulatedRevenueImpact = (28500000 * alphaRevenueShockPct) / 100;
  const simulatedConsolidatedRevenue = Math.max(
    0,
    consolidatedSummary.consolidatedRevenue + simulatedRevenueImpact
  );

  const payrollCostImpact = (12850000 * payrollInflationPct) / 100;
  const simulatedEbitda = Math.max(
    0,
    consolidatedSummary.consolidatedEbitda + simulatedRevenueImpact * 0.45 - payrollCostImpact
  );

  const arWorkingCapitalDrag = (betaCollectionDelayDays / 30) * 1500000;
  const capexCashDrain = newCapexMillions * 1000000;
  const debtCashInjection = newDebtFacilityMillions * 1000000;

  const simulatedCash = Math.max(
    0,
    consolidatedSummary.totalGroupCash +
      debtCashInjection -
      capexCashDrain -
      arWorkingCapitalDrag -
      payrollCostImpact * 0.5
  );

  const simulatedDeployableCash = Math.max(
    0,
    simulatedCash - consolidatedSummary.totalOperationalMinimum
  );

  const simulatedGrossDebt =
    consolidatedSummary.consolidatedGrossDebt + newDebtFacilityMillions * 1000000;
  const simulatedNetDebt = simulatedGrossDebt - simulatedCash;
  const simulatedRunway =
    simulatedConsolidatedRevenue > 0
      ? (simulatedCash / (simulatedConsolidatedRevenue / 12)) * 1.5
      : 0;

  const hasBreachedThreshold = simulatedCash < consolidatedSummary.totalOperationalMinimum;

  const resetScenarios = () => {
    setAlphaRevenueShockPct(0);
    setBetaCollectionDelayDays(0);
    setPayrollInflationPct(0);
    setNewCapexMillions(0);
    setNewDebtFacilityMillions(0);
  };

  const applyStressTestPreset = () => {
    setAlphaRevenueShockPct(-10);
    setBetaCollectionDelayDays(30);
    setPayrollInflationPct(5);
    setNewCapexMillions(3);
    setNewDebtFacilityMillions(0);
  };

  const applyGrowthPreset = () => {
    setAlphaRevenueShockPct(15);
    setBetaCollectionDelayDays(0);
    setPayrollInflationPct(3);
    setNewCapexMillions(2);
    setNewDebtFacilityMillions(5);
  };

  return (
    <AppShell
      title={t.scenarios.title}
      subtitle={`${t.scenarios.subtitle}${consolidationCurrency}`}
    >
      {/* Top Controls Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shadow-2xs border border-purple-100">
            <GitBranch className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {t.scenarios.bannerTitle}
              </h2>
              <Badge variant="purple" size="sm">
                Monte Carlo v2.4
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.scenarios.bannerDesc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={resetScenarios}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {t.scenarios.reset}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={applyGrowthPreset}
            leftIcon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
          >
            {locale === "en" ? "Expansion Case" : "Scénario Croissance"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={applyStressTestPreset}
            className="bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-500/20"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {t.scenarios.applyCrisis}
          </Button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Simulated KPIs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Assumption Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title={t.scenarios.hypothesesTitle}
            subtitle={t.scenarios.hypothesesSubtitle}
          >
            <div className="space-y-5 text-xs">
              {/* Slider 1: Alpha Revenue Shock */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">{t.scenarios.sliderAlphaRevenue}</span>
                  <span
                    className={`font-mono text-xs ${
                      alphaRevenueShockPct < 0
                        ? "text-rose-600 font-extrabold"
                        : alphaRevenueShockPct > 0
                        ? "text-emerald-700 font-extrabold"
                        : "text-slate-700"
                    }`}
                  >
                    {alphaRevenueShockPct > 0 ? `+${alphaRevenueShockPct}` : alphaRevenueShockPct}% (
                    {formatMoney(simulatedRevenueImpact)} {consolidationCurrency})
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={25}
                  step={5}
                  value={alphaRevenueShockPct}
                  onChange={(e) => setAlphaRevenueShockPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.scenarios.sliderAlphaRevenueHint}
                </span>
              </div>

              {/* Slider 2: Beta Collection Delay */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">{t.scenarios.sliderBetaDso}</span>
                  <span
                    className={`font-mono text-xs ${
                      betaCollectionDelayDays > 0 ? "text-rose-600 font-extrabold" : "text-slate-700"
                    }`}
                  >
                    +{betaCollectionDelayDays} {locale === "en" ? "days" : "jours"} (WCR +
                    {formatMoney(arWorkingCapitalDrag)} {consolidationCurrency})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={10}
                  value={betaCollectionDelayDays}
                  onChange={(e) => setBetaCollectionDelayDays(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.scenarios.sliderBetaDsoHint} (DSO: 88d ➔ {88 + betaCollectionDelayDays}d)
                </span>
              </div>

              {/* Slider 3: Payroll Inflation */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">{t.scenarios.sliderPayroll}</span>
                  <span
                    className={`font-mono text-xs ${
                      payrollInflationPct > 0 ? "text-rose-600 font-extrabold" : "text-slate-700"
                    }`}
                  >
                    +{payrollInflationPct}% (+{formatMoney(payrollCostImpact)} {consolidationCurrency}/yr)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={payrollInflationPct}
                  onChange={(e) => setPayrollInflationPct(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.scenarios.sliderPayrollHint}
                </span>
              </div>

              {/* Slider 4: New CAPEX Program */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">{t.scenarios.sliderCapex}</span>
                  <span className="font-mono text-xs text-slate-900 font-extrabold">
                    +{newCapexMillions.toFixed(1)} M {consolidationCurrency}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={newCapexMillions}
                  onChange={(e) => setNewCapexMillions(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.scenarios.sliderCapexHint}
                </span>
              </div>

              {/* Slider 5: New Debt Facility */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">{t.scenarios.sliderDebt}</span>
                  <span className="font-mono text-xs text-emerald-700 font-extrabold">
                    +{newDebtFacilityMillions.toFixed(1)} M {consolidationCurrency}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={newDebtFacilityMillions}
                  onChange={(e) => setNewDebtFacilityMillions(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block font-medium">
                  {t.scenarios.sliderDebtHint}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Simulated Results & Impact Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title={t.scenarios.simulatedResultsTitle}
            subtitle={t.scenarios.simulatedResultsSubtitle}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 1: Revenue */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.scenarios.simRevenue}
                  </span>
                  {simulatedRevenueImpact < 0 ? (
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                  ) : simulatedRevenueImpact > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  ) : null}
                </div>
                <span className="text-2xl font-black text-slate-900 mt-2 block font-tabular">
                  {formatMoney(simulatedConsolidatedRevenue)} {consolidationCurrency}
                </span>
                <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{t.scenarios.simRevenueVariance} :</span>
                  <span
                    className={
                      simulatedRevenueImpact < 0
                        ? "text-rose-600 font-bold"
                        : simulatedRevenueImpact > 0
                        ? "text-emerald-700 font-bold"
                        : "text-slate-600"
                    }
                  >
                    {simulatedRevenueImpact > 0 ? "+" : ""}
                    {formatMoney(simulatedRevenueImpact)} {consolidationCurrency}
                  </span>
                </div>
              </div>

              {/* Metric 2: EBITDA */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.scenarios.simEbitda}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">
                    {simulatedConsolidatedRevenue > 0
                      ? ((simulatedEbitda / simulatedConsolidatedRevenue) * 100).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-700 mt-2 block font-tabular">
                  {formatMoney(simulatedEbitda)} {consolidationCurrency}
                </span>
                <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{t.scenarios.simEbitdaMargin} :</span>
                  <span className="font-bold text-slate-700">
                    {simulatedConsolidatedRevenue > 0
                      ? ((simulatedEbitda / simulatedConsolidatedRevenue) * 100).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
              </div>

              {/* Metric 3: Cash & Deployable */}
              <div
                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                  hasBreachedThreshold
                    ? "bg-rose-50/70 border-rose-200 shadow-sm shadow-rose-500/10"
                    : "bg-slate-50/80 border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.scenarios.simCash}
                  </span>
                  {hasBreachedThreshold ? (
                    <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <span
                  className={`text-2xl font-black mt-2 block font-tabular ${
                    hasBreachedThreshold ? "text-rose-600" : "text-slate-900"
                  }`}
                >
                  {formatMoney(simulatedCash)} {consolidationCurrency}
                </span>
                <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{t.scenarios.simDeployable} :</span>
                  <span
                    className={`font-bold font-tabular ${
                      simulatedDeployableCash > 0 ? "text-blue-600" : "text-rose-600"
                    }`}
                  >
                    {formatMoney(simulatedDeployableCash)} {consolidationCurrency}
                  </span>
                </div>
              </div>

              {/* Metric 4: Net Debt & Leverage */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.scenarios.simNetDebt}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">
                    {(simulatedGrossDebt / (simulatedEbitda || 1)).toFixed(1)}x
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900 mt-2 block font-tabular">
                  {formatMoney(simulatedNetDebt)} {consolidationCurrency}
                </span>
                <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{t.scenarios.simLeverage} :</span>
                  <span className="font-bold text-slate-700">
                    Runway: {simulatedRunway.toFixed(1)} {locale === "en" ? "months" : "mois"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stress Test Diagnostics Warning */}
            {hasBreachedThreshold && (
              <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">
                      {t.scenarios.stressWarningTitle}
                    </strong>
                    <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                      {t.scenarios.stressWarningDesc} (
                      {locale === "en" ? "Shortfall" : "Déficit"} :{" "}
                      <strong>
                        {formatMoney(consolidatedSummary.totalOperationalMinimum - simulatedCash)}{" "}
                        {consolidationCurrency}
                      </strong>
                      ).
                    </p>
                  </div>
                </div>

                <Link href="/group/intercompany" className="shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {locale === "en" ? "Bridge Loan" : "Prêt Relais"}
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
