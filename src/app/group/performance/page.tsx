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
import { HealthPillarStatus } from "@/lib/group/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";

export default function EntityPerformancePage() {
  const { entities } = useGroup();

  const [selectedEntityIds, setSelectedEntityIds] = React.useState<string[]>([
    "ent_alpha",
    "ent_beta",
    "ent_gamma",
  ]);

  const [period, setPeriod] = React.useState<string>("ytd");

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

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
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Sain</span>
          </div>
        );
      case "watch":
        return (
          <div className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Surveillance</span>
          </div>
        );
      case "critical":
        return (
          <div className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px] font-semibold">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Critique</span>
          </div>
        );
      case "insufficient_data":
      default:
        return (
          <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Données insuf.</span>
          </div>
        );
    }
  };

  return (
    <AppShell
      title="Performance des Entités & Comparateur"
      subtitle="Benchmarking multi-filiales, ratios normalisés et grille de santé à 6 piliers"
    >
      {/* Entity Selector Ribbon */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Sélectionner les filiales à comparer (2 à 5 entités) :
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {entities.map((ent) => {
              const isSelected = selectedEntityIds.includes(ent.id);
              return (
                <button
                  key={ent.id}
                  onClick={() => toggleSelectEntity(ent.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 text-blue-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{ent.name}</span>
                  <span className="text-[10px] text-slate-400">({ent.code})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="current">Mois en cours</option>
            <option value="last_month">Mois précédent</option>
            <option value="ytd">Cumul annuel (YTD)</option>
            <option value="12m">12 derniers mois glissants</option>
          </select>
        </div>
      </div>

      {/* Side-by-Side Normalized Comparison Matrix */}
      <Card
        title="Matrice de Comparaison Financière Normalisée"
        subtitle="Ratios financiers comparables indépendamment de la taille absolue de chaque entité"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-left w-52">Indicateur Financier</th>
                {comparedEntities.map((ent) => (
                  <th key={ent.id} className="p-3 text-right">
                    <div>
                      <span className="block text-slate-900">{ent.name}</span>
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
              <tr className="hover:bg-slate-50 font-semibold">
                <td className="p-3 text-slate-700">Chiffre d&apos;Affaires (MAD)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-bold text-slate-900">
                    {e.operationalStatus === "pre_opening" ? (
                      <span className="text-slate-400 italic font-normal">Pré-revenu</span>
                    ) : (
                      `${formatMoney(e.financials.revenue)}`
                    )}
                  </td>
                ))}
              </tr>

              {/* Marge EBITDA % */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">Marge EBITDA (%)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono">
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
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">Trésorerie Actuelle (MAD)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-bold">
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
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="p-3 text-slate-700 font-medium">Liquidité Mobilisable (Hors seuil min)</td>
                {comparedEntities.map((e) => {
                  const deployable = Math.max(0, e.financials.cash - e.financials.operationalMinimum);
                  return (
                    <td key={e.id} className="p-3 text-right font-mono font-semibold">
                      <span className={deployable > 0 ? "text-emerald-600" : "text-slate-400"}>
                        {formatMoney(deployable)}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* DSO - Délai de paiement clients */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">DSO (Délai crédit clients)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono">
                    {e.operationalStatus === "pre_opening" ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={
                          e.financials.dso > 75
                            ? "text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded"
                            : "text-slate-800"
                        }
                      >
                        {e.financials.dso} jours
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* DPO - Délai fournisseurs */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">DPO (Crédit fournisseurs)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800">
                    {e.financials.dpo} jours
                  </td>
                ))}
              </tr>

              {/* Dette Brute */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">Dette Financière Brute</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800">
                    {formatMoney(e.financials.grossDebt)} MAD
                  </td>
                ))}
              </tr>

              {/* CAPEX Engagé */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">CAPEX Engagé</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono text-slate-800">
                    {formatMoney(e.financials.capexCommitted)} MAD
                  </td>
                ))}
              </tr>

              {/* Écart vs Budget */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-700 font-medium">Écart Budgétaire OPEX</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono font-semibold">
                    <span
                      className={
                        e.financials.budgetVariancePct < -5
                          ? "text-rose-600"
                          : e.financials.budgetVariancePct > 0
                          ? "text-emerald-700"
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
              <tr className="hover:bg-slate-50 font-semibold bg-slate-50/50">
                <td className="p-3 text-slate-900">Autonomie de Trésorerie (Runway)</td>
                {comparedEntities.map((e) => (
                  <td key={e.id} className="p-3 text-right font-mono">
                    <span
                      className={
                        e.financials.runwayMonths < 3
                          ? "text-rose-600 font-bold"
                          : "text-emerald-700"
                      }
                    >
                      {e.financials.runwayMonths.toFixed(1)} mois
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
        title="Grille de Santé Financière à 6 Piliers (Explainable Health)"
        subtitle="Évaluation factuelle et objective sans note opaque • Chaque statut est documenté et vérifiable"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité</TableHead>
                <TableHead>1. Liquidité</TableHead>
                <TableHead>2. Rentabilité</TableHead>
                <TableHead>3. BFR & Crédit</TableHead>
                <TableHead>4. Budget</TableHead>
                <TableHead>5. Solvabilité / Dette</TableHead>
                <TableHead>6. Qualité Données</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => (
                <TableRow key={ent.id} className="hover:bg-slate-50">
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

        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Survolez chaque pilier pour consulter l&apos;explication détaillée rédigée par le moteur d&apos;analyse.</span>
          <Link href="/group/health" className="font-bold text-blue-600 hover:underline">
            Centre de qualité des données →
          </Link>
        </div>
      </Card>
    </AppShell>
  );
}
