"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KPICard } from "@/components/ui/KPICard";
import { useGroup } from "@/lib/group/GroupContext";
import { financialEngine } from "@/lib/group/financial-engine";
import {
  CalendarRange,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function GroupForecastPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
    selectEntity,
  } = useGroup();

  const [selectedEntityFilter, setSelectedEntityFilter] = React.useState<string>("all");

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  const allocationAnalysis = React.useMemo(() => {
    return financialEngine.getLiquidityAllocationAnalysis(entities);
  }, [entities]);

  // Weeks 1 through 13
  const weeks = Array.from({ length: 13 }, (_, i) => `S${i + 1}`);

  // Calculate weekly consolidated cash numbers
  const weeklyTotals = React.useMemo(() => {
    const totals = new Array(13).fill(0);
    entities.forEach((ent) => {
      ent.financials.cashTrendWeekly.forEach((val, i) => {
        totals[i] += val * 1000;
      });
    });
    return totals;
  }, [entities]);

  const activeEntities = React.useMemo(() => {
    if (selectedEntityFilter === "all") return entities;
    return entities.filter((e) => e.id === selectedEntityFilter);
  }, [entities, selectedEntityFilter]);

  return (
    <AppShell
      title="Prévisions de Trésorerie à 13 Semaines"
      subtitle={`Consolidation hebdomadaire et allocation prévisionnelle de liquidité • Devise : ${consolidationCurrency}`}
    >
      {/* AI CFO Liquidity Allocation Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  Analyse d&apos;Allocation de Liquidité & Arbitrage AI CFO
                </span>
                <Badge variant="blue" size="sm">Aide à la Décision</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
                {allocationAnalysis.recommendationSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/group/intercompany">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Convention d&apos;Avance Intercompany
              </Button>
            </Link>
          </div>
        </div>

        {/* Breakdown of Surplus vs Shortfall entities */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="font-bold text-emerald-400 block">
              Entités à Excédent de Liquidité Mobilisable (+{formatMoney(allocationAnalysis.totalSurplus)} MAD)
            </span>
            <div className="mt-1 space-y-1 text-slate-300 text-[11px]">
              <div>• <strong>Entity Alpha :</strong> +3 600 000 MAD mobilisables (Cash 4,8M - Min 1,2M)</div>
              <div>• <strong>Holding Corp :</strong> +1 950 000 MAD mobilisables (Cash 2,45M - Min 0,5M)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="font-bold text-rose-400 block">
              Entités en Déficit / Besoin de Financement Projeté (-{formatMoney(allocationAnalysis.totalDeficit)} MAD)
            </span>
            <div className="mt-1 space-y-1 text-slate-300 text-[11px]">
              <div>• <strong>Entity Beta :</strong> Rupture projetée en Semaine 6 (-780 000 MAD) sans relance client</div>
              <div>• <strong>SPV Delta :</strong> Besoin de tirage intercompany pour jalons CAPEX (-350 000 MAD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Trésorerie Consolidée Fin S13"
          value={`${formatMoney(weeklyTotals[12])} ${consolidationCurrency}`}
          badge="+3.1% vs S1"
          badgeVariant="green"
          description="Solde agrégé au terme du trimestre"
          icon={<CalendarRange className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="Point Bas de Trésorerie Groupe"
          value={`${formatMoney(Math.min(...weeklyTotals))} ${consolidationCurrency}`}
          badge="Semaine 1"
          badgeVariant="blue"
          description="Niveau de sécurité préservé"
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Besoin d'Arbitrage Inter-Filiales"
          value="780 000 MAD"
          badge="Entity Beta"
          badgeVariant="rose"
          description="Déficit d'exploitation sous 4 à 6 semaines"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
        />

        <KPICard
          title="Excédent Net Théorique"
          value={`${formatMoney(allocationAnalysis.totalSurplus - allocationAnalysis.totalDeficit)} MAD`}
          badge="Couverture 100%"
          badgeVariant="green"
          description="Liquidité groupe suffisante"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* 13-Week Consolidated Forecast Matrix */}
      <Card
        title="Grille Prévisionnelle Hebdomadaire (13 Semaines)"
        subtitle="Évolution du solde de trésorerie par entité (en milliers de MAD)"
        headerAction={
          <div className="flex items-center gap-2">
            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">Toutes les entités du groupe</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5 text-left min-w-[180px]">Entité / Période</th>
                <th className="p-2.5 text-right font-mono bg-slate-200/60">Actuel</th>
                {weeks.map((w, idx) => (
                  <th
                    key={w}
                    className={cn(
                      "p-2.5 text-right font-mono min-w-[70px]",
                      idx === 3 || idx === 5 ? "bg-amber-100/50 text-amber-900" : ""
                    )}
                  >
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeEntities.map((ent) => {
                return (
                  <tr
                    key={ent.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <td className="p-2.5 font-bold text-slate-900 flex items-center justify-between">
                      <span>{ent.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({ent.code})</span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold bg-slate-50 text-slate-800">
                      {formatMoney(ent.financials.cash / 1000)}k
                    </td>
                    {ent.financials.cashTrendWeekly.map((val, wIndex) => {
                      const isNegative = val < 0;
                      const isBelowMin = val * 1000 < ent.financials.operationalMinimum;
                      return (
                        <td
                          key={wIndex}
                          className={cn(
                            "p-2.5 text-right font-mono",
                            isNegative
                              ? "bg-rose-100/80 font-bold text-rose-700"
                              : isBelowMin
                              ? "bg-amber-50 text-amber-800 font-semibold"
                              : "text-slate-700"
                          )}
                        >
                          {val}k
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Consolidated Group Row */}
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <td className="p-3">TOTAL CONSOLIDÉ GROUPE</td>
                <td className="p-3 text-right font-mono text-emerald-400">
                  {formatMoney(consolidatedSummary.totalGroupCash / 1000)}k
                </td>
                {weeklyTotals.map((tot, idx) => (
                  <td key={idx} className="p-3 text-right font-mono text-emerald-400">
                    {formatMoney(tot / 1000)}k
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400" />
              <span>Déficit / Rupture de cash</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300" />
              <span>Sous le seuil minimal de sécurité</span>
            </span>
          </div>
          <span>Unité : k MAD (Milliers de Dirhams)</span>
        </div>
      </Card>
    </AppShell>
  );
}
