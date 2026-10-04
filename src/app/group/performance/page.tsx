"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HealthPillarStatus } from "@/lib/group/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Building2,
} from "lucide-react";

export default function EntityPerformancePage() {
  const { entities, consolidationCurrency } = useGroup();
  const { t, locale, formatMoney } = useLanguage();

  const [selectedEntityIds, setSelectedEntityIds] = React.useState<string[]>([
    "ent_alpha",
    "ent_beta",
    "ent_gamma",
  ]);

  const [period, setPeriod] = React.useState<string>("ytd");

  const toggleSelectEntity = (id: string) => {
    setSelectedEntityIds((prev) =>
      prev.includes(id)
        ? prev.length > 2
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const comparedEntities = entities.filter((e) => selectedEntityIds.includes(e.id));

  // Health Status Badge helper
  const renderHealthBadge = (pillar: { status: HealthPillarStatus; reason: string }) => {
    switch (pillar.status) {
      case "healthy":
        return (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t.common.healthy}</span>
          </div>
        );
      case "watch":
        return (
          <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t.common.watch}</span>
          </div>
        );
      case "critical":
        return (
          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 text-[11px] font-bold">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{t.common.critical}</span>
          </div>
        );
      case "insufficient_data":
      default:
        return (
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-[11px] font-medium">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{t.common.insufficientData}</span>
          </div>
        );
    }
  };

  return (
    <AppShell
      title={t.nav.performanceBenchmarking}
      subtitle={locale === "en" ? `Multi-subsidiary benchmarking, normalized financial ratios, and 6-pillar health scorecard • Currency: ${consolidationCurrency}` : `Benchmarking multi-filiales, ratios normalisés et grille de santé à 6 piliers • Devise : ${consolidationCurrency}`}
    >
      {/* Entity Selector Ribbon */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            {locale === "en" ? "Select subsidiaries to benchmark (2 to 5 entities):" : "Sélectionner les filiales à comparer (2 à 5 entités) :"}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {entities.map((ent) => {
              const isSelected = selectedEntityIds.includes(ent.id);
              return (
                <button
                  key={ent.id}
                  onClick={() => toggleSelectEntity(ent.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{ent.name}</span>
                  <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>({ent.code})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs font-semibold"
          >
            <option value="current">{locale === "en" ? "Current Month" : "Mois en cours"}</option>
            <option value="last_month">{locale === "en" ? "Previous Month" : "Mois précédent"}</option>
            <option value="ytd">{locale === "en" ? "Year-to-Date (YTD)" : "Cumul annuel (YTD)"}</option>
            <option value="12m">{locale === "en" ? "Trailing 12 Months (LTM)" : "12 derniers mois glissants"}</option>
          </select>
        </div>
      </div>

      {/* Side-by-Side Normalized Comparison Matrix */}
      <Card
        title={locale === "en" ? "Normalized Financial Benchmarking Matrix" : "Matrice de Comparaison Financière Normalisée"}
        subtitle={locale === "en" ? "Comparative ratios independent of entity absolute size" : "Ratios financiers comparables indépendamment de la taille absolue de chaque entité"}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-left w-56">{locale === "en" ? "Financial Indicator" : "Indicateur Financier"}</th>
                {comparedEntities.map((ent) => (
                  <th key={ent.id} className="p-3 text-right">
                    <div>
                      <span className="block text-slate-900 font-extrabold">{ent.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {ent.country} • {ent.functionalCurrency}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Chiffre d'affaires */}
              <tr className="hover:bg-slate-50 font-semibold transition-colors">
                <td className="p-3 text-slate-700 font-bold">{t.dashboard.colRevenue} (MAD)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-bold text-slate-900 font-tabular">
                    {e.operationalStatus === "pre_opening" ? (
                      <span className="text-slate-400 italic font-normal text-xs">{locale === "en" ? "Pre-Revenue" : "Pré-revenu"}</span>
                    ) : (
                      formatMoney(e.financials.revenue)
                    )}
                  </td>
                ))}
              </tr>

              {/* Marge EBITDA % */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{t.dashboard.colEbitda} Margin (%)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-tabular">
                    {e.operationalStatus === "pre_opening" ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={
                          e.financials.ebitdaMargin > 20
                            ? "text-emerald-700 font-bold"
                            : e.financials.ebitdaMargin < 10
                            ? "text-amber-700 font-bold"
                            : "text-slate-800"
                        }
                      >
                        {e.financials.ebitdaMargin.toFixed(1)}%
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Trésorerie Brute */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{t.dashboard.kpiCashTotal} (MAD)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-bold font-tabular">
                    <span
                      className={
                        e.financials.cash < e.financials.operationalMinimum
                          ? "text-rose-600"
                          : "text-slate-900"
                      }
                    >
                      {formatMoney(e.financials.cash)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Cash Réellement Mobilisable */}
              <tr className="hover:bg-slate-50 bg-slate-50/50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{t.cash.deployableLiquidity}</td>
                {comparedEntities.map((e) => {
                  const deployable = Math.max(0, e.financials.cash - e.financials.operationalMinimum);
                  return (
                    <td key={e.id} className="p-3 text-right font-mono font-bold font-tabular">
                      <span className={deployable > 0 ? "text-emerald-600" : "text-slate-400"}>
                        {formatMoney(deployable)}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* DSO - Délai de paiement clients */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">DSO ({locale === "en" ? "Days Sales Outstanding" : "Délai crédit clients"})</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-tabular">
                    {e.operationalStatus === "pre_opening" ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={
                          e.financials.dso > 75
                            ? "text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                            : "text-slate-800"
                        }
                      >
                        {e.financials.dso} {locale === "en" ? "days" : "jours"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* DPO - Délai fournisseurs */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">DPO ({locale === "en" ? "Days Payable Outstanding" : "Crédit fournisseurs"})</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800 font-tabular">
                    {e.financials.dpo} {locale === "en" ? "days" : "jours"}
                  </td>
                ))}
              </tr>

              {/* Dette Brute */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{t.dashboard.colGrossDebt}</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800 font-tabular">
                    {formatMoney(e.financials.grossDebt)} MAD
                  </td>
                ))}
              </tr>

              {/* CAPEX Engagé */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{locale === "en" ? "Committed CAPEX" : "CAPEX Engagé"}</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800 font-tabular">
                    {formatMoney(e.financials.capexCommitted)} MAD
                  </td>
                ))}
              </tr>

              {/* Écart vs Budget */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700 font-medium">{locale === "en" ? "Budget Variance OPEX" : "Écart Budgétaire OPEX"}</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-semibold font-tabular">
                    <span
                      className={
                        e.financials.budgetVariancePct < -5
                          ? "text-rose-600 font-bold"
                          : e.financials.budgetVariancePct > 0
                          ? "text-emerald-700 font-bold"
                          : "text-slate-700"
                      }
                    >
                      {e.financials.budgetVariancePct >= 0 ? "+" : ""}
                      {e.financials.budgetVariancePct}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Runway */}
              <tr className="hover:bg-slate-50 font-semibold bg-slate-50/50 transition-colors">
                <td className="p-3 text-slate-900 font-bold">{t.dashboard.kpiRunway}</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-tabular">
                    <span
                      className={
                        e.financials.runwayMonths < 3
                          ? "text-rose-600 font-bold"
                          : "text-emerald-700 font-bold"
                      }
                    >
                      {e.financials.runwayMonths.toFixed(1)} {locale === "en" ? "months" : "mois"}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6-Pillar Health Scorecard */}
      <Card
        title={locale === "en" ? "6-Pillar Explainable Financial Health Grid" : "Grille de Santé Financière à 6 Piliers (Explainable Health)"}
        subtitle={locale === "en" ? "Objective, fact-grounded assessment without opaque scoring • Each pillar documented with verifiable criteria" : "Évaluation factuelle et objective sans note opaque • Chaque statut est documenté et vérifiable"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.common.entity}</TableHead>
                <TableHead>1. {t.dashboard.pillarCash}</TableHead>
                <TableHead>2. {t.dashboard.pillarRentability}</TableHead>
                <TableHead>3. {t.dashboard.pillarBFR}</TableHead>
                <TableHead>4. {t.dashboard.pillarBudget}</TableHead>
                <TableHead>5. {t.dashboard.pillarSolvency}</TableHead>
                <TableHead>6. {t.dashboard.pillarQuality}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => (
                <TableRow key={ent.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-slate-900">{ent.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {ent.operationalStatus} • {ent.country}
                    </div>
                  </TableCell>

                  <TableCell title={ent.healthPillars.liquidity.reason}>
                    {renderHealthBadge(ent.healthPillars.liquidity)}
                  </TableCell>

                  <TableCell title={ent.healthPillars.profitability.reason}>
                    {renderHealthBadge(ent.healthPillars.profitability)}
                  </TableCell>

                  <TableCell title={ent.healthPillars.workingCapital.reason}>
                    {renderHealthBadge(ent.healthPillars.workingCapital)}
                  </TableCell>

                  <TableCell title={ent.healthPillars.budgetControl.reason}>
                    {renderHealthBadge(ent.healthPillars.budgetControl)}
                  </TableCell>

                  <TableCell title={ent.healthPillars.debtSolvency.reason}>
                    {renderHealthBadge(ent.healthPillars.debtSolvency)}
                  </TableCell>

                  <TableCell title={ent.healthPillars.dataQuality.reason}>
                    {renderHealthBadge(ent.healthPillars.dataQuality)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{locale === "en" ? "Hover over any health pillar to view the automated diagnosis written by the financial engine." : "Survolez chaque pilier pour consulter l'explication détaillée rédigée par le moteur d'analyse."}</span>
          <Link href="/group/health" className="font-bold text-blue-600 hover:underline">
            {locale === "en" ? "Data Quality Center →" : "Centre de qualité des données →"}
          </Link>
        </div>
      </Card>
    </AppShell>
  );
}
