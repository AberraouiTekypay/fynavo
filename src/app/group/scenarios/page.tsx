"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGroup } from "@/lib/group/GroupContext";
import {
  GitBranch,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function GroupScenariosPage() {
  const { consolidatedSummary, consolidationCurrency } = useGroup();

  // Scenario input assumptions
  const [alphaRevenueShockPct, setAlphaRevenueShockPct] = React.useState<number>(0); // e.g. -10%
  const [betaCollectionDelayDays, setBetaCollectionDelayDays] = React.useState<number>(0); // e.g. +30 days
  const [payrollInflationPct, setPayrollInflationPct] = React.useState<number>(0); // e.g. +5%
  const [newCapexMillions, setNewCapexMillions] = React.useState<number>(0); // e.g. +3.0M
  const [newDebtFacilityMillions, setNewDebtFacilityMillions] = React.useState<number>(0); // e.g. +5.0M

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  // Dynamic calculations based on assumptions
  const simulatedRevenueImpact = (28500000 * alphaRevenueShockPct) / 100;
  const simulatedConsolidatedRevenue = Math.max(
    0,
    consolidatedSummary.consolidatedRevenue + simulatedRevenueImpact
  );

  // EBITDA impact: Revenue drop on Alpha flows through margin (say 40% contribution margin)
  // Payroll inflation impacts group payroll base (~12.8M MAD)
  const payrollCostImpact = (12850000 * payrollInflationPct) / 100;
  const simulatedEbitda = Math.max(
    0,
    consolidatedSummary.consolidatedEbitda + simulatedRevenueImpact * 0.45 - payrollCostImpact
  );

  // Cash Impact:
  // Collection delay on Beta (+30 days on ~18.2M revenue = ~1.5M MAD stuck in AR)
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

  return (
    <AppShell
      title="Moteur de Scénarios Groupe & Stress-Test"
      subtitle={`Simulation dynamique multi-variables et impact instantané sur le cash, l'EBITDA et le besoin de financement • Devise : ${consolidationCurrency}`}
    >
      {/* Top Controls Banner */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Simulateur de Chocs Financiers Groupe</h2>
            <p className="text-xs text-slate-500">
              Modélisez des hypothèses conjointes et visualisez la résilience de la liquidité consolidée
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={resetScenarios} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Réinitialiser
          </Button>
          <Button variant="primary" size="sm" onClick={applyStressTestPreset} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Appliquer Scénario de Crise
          </Button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Simulated KPIs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Assumption Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="Hypothèses de Simulation Groupe" subtitle="Ajustez les curseurs pour recalculer le modèle en temps réel">
            <div className="space-y-5 text-xs">
              {/* Slider 1: Alpha Revenue Shock */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">1. Choc de CA Entity Alpha</span>
                  <span className={alphaRevenueShockPct < 0 ? "text-rose-600 font-bold" : "text-slate-900"}>
                    {alphaRevenueShockPct}% ({formatMoney(simulatedRevenueImpact)} MAD)
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={20}
                  step={5}
                  value={alphaRevenueShockPct}
                  onChange={(e) => setAlphaRevenueShockPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Simulation de perte de contrats institutionnels</span>
              </div>

              {/* Slider 2: Beta Collection Delay */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">2. Allongement Délai Clients Beta</span>
                  <span className={betaCollectionDelayDays > 0 ? "text-rose-600 font-bold" : "text-slate-900"}>
                    +{betaCollectionDelayDays} jours (BFR +{formatMoney(arWorkingCapitalDrag)} MAD)
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
                <span className="text-[10px] text-slate-400">DSO passe de 88j à {88 + betaCollectionDelayDays}j</span>
              </div>

              {/* Slider 3: Payroll Inflation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">3. Inflation Masse Salariale Groupe</span>
                  <span className={payrollInflationPct > 0 ? "text-rose-600 font-bold" : "text-slate-900"}>
                    +{payrollInflationPct}% (+{formatMoney(payrollCostImpact)} MAD/an)
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
                <span className="text-[10px] text-slate-400">Hausse SMIG, revalorisation générale des filiales</span>
              </div>

              {/* Slider 4: New CAPEX Program */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">4. Nouveau Programme CAPEX Non Budgété</span>
                  <span className="text-slate-900 font-bold">
                    +{newCapexMillions.toFixed(1)} M MAD
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
                <span className="text-[10px] text-slate-400">Décaissements d&apos;investissements supplémentaires</span>
              </div>

              {/* Slider 5: New Debt Facility */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">5. Nouvelle Ligne de Financement / Emprunt</span>
                  <span className="text-emerald-700 font-bold">
                    +{newDebtFacilityMillions.toFixed(1)} M MAD
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
                <span className="text-[10px] text-slate-400">Injection de trésorerie par endettement bancaire</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Simulated Results & Impact Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card title="Impact Consolidé Simulé" subtitle="Résultats prévisionnels après application des chocs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chiffre d&apos;Affaires Consolidé
                </span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {formatMoney(simulatedConsolidatedRevenue)} MAD
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Écart : {formatMoney(simulatedRevenueImpact)} MAD
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  EBITDA Consolidé Simulé
                </span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {formatMoney(simulatedEbitda)} MAD
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Marge : {((simulatedEbitda / simulatedConsolidatedRevenue) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trésorerie Groupe Projetée
                </span>
                <span className={`text-xl font-extrabold mt-1 block ${simulatedCash < consolidatedSummary.totalOperationalMinimum ? "text-rose-600" : "text-emerald-700"}`}>
                  {formatMoney(simulatedCash)} MAD
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Déployable : {formatMoney(simulatedDeployableCash)} MAD
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dette Nette Consolidée
                </span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {formatMoney(simulatedNetDebt)} MAD
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Levier : {(simulatedGrossDebt / (simulatedEbitda || 1)).toFixed(1)}x • Runway : {simulatedRunway.toFixed(1)} mois
                </span>
              </div>
            </div>

            {/* Stress Test Diagnostics Warning */}
            {simulatedCash < consolidatedSummary.totalOperationalMinimum && (
              <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Alerte Résilience Groupe :</strong> Sous ce scénario, la trésorerie globale passe sous le seuil minimal de sécurité ({formatMoney(consolidatedSummary.totalOperationalMinimum)} MAD). Un besoin de financement bancaire ou une injection d&apos;actionnaires de{" "}
                  <strong>{formatMoney(consolidatedSummary.totalOperationalMinimum - simulatedCash)} MAD</strong> serait impératif pour éviter la cessation de paiement sur Beta.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
