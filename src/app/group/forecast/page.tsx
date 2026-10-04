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
import { useLanguage } from "@/lib/i18n/LanguageContext";
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

  const { t, locale, formatMoney } = useLanguage();

  const [selectedEntityFilter, setSelectedEntityFilter] = React.useState<string>("all");

  const allocationAnalysis = React.useMemo(() => {
    return financialEngine.getLiquidityAllocationAnalysis(entities);
  }, [entities]);

  // Weeks 1 through 13
  const weeks = Array.from({ length: 13 }, (_, i) => locale === "en" ? `W${i + 1}` : `S${i + 1}`);

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
      title={t.nav.forecast13Weeks}
      subtitle={locale === "en" ? `13-Week Cash Forecast & Liquidity Allocation • Currency: ${consolidationCurrency}` : `Consolidation hebdomadaire et allocation prévisionnelle de liquidité • Devise : ${consolidationCurrency}`}
    >
      {/* AI CFO Liquidity Allocation Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-white border border-white/10 shadow-xl card-accent-top">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {locale === "en" ? "AI CFO Liquidity Allocation & Arbitrage Engine" : "Analyse d'Allocation de Liquidité & Arbitrage AI CFO"}
                </span>
                <Badge variant="blue" size="sm">
                  {locale === "en" ? "Decision Support" : "Aide à la Décision"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
                {locale === "en"
                  ? "Surplus entities (Holding & Alpha: +5.55M MAD) have ample deployable liquidity to absorb projected deficits on Entity Beta (Week 5: -820K MAD). Recommended action: Establish an intra-group bridge loan of 1,000,000 MAD from Alpha to Beta with formal interest at market rate."
                  : allocationAnalysis.recommendationSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/group/intercompany">
              <Button variant="blue" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {locale === "en" ? "Intercompany Bridge Loan" : "Convention d'Avance Intercompany"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Breakdown of Surplus vs Shortfall entities */}
        <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="font-bold text-emerald-400 block text-xs">
              {locale === "en" ? "Surplus Entities (Deployable Cash: " : "Entités à Excédent de Liquidité Mobilisable (+"}
              {formatMoney(allocationAnalysis.totalSurplus, "MAD")})
            </span>
            <div className="mt-2 space-y-1.5 text-slate-300 text-[11px]">
              <div>• <strong>Entity Alpha:</strong> +3 600 000 MAD deployable (Cash 4.8M - Buffer 1.2M)</div>
              <div>• <strong>Holding Corp:</strong> +1 950 000 MAD deployable (Cash 2.45M - Buffer 0.5M)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="font-bold text-rose-400 block text-xs">
              {locale === "en" ? "Projected Shortfall Entities (-" : "Entités en Déficit Projeté (-"}
              {formatMoney(allocationAnalysis.totalDeficit, "MAD")})
            </span>
            <div className="mt-2 space-y-1.5 text-slate-300 text-[11px]">
              <div>• <strong>Entity Beta:</strong> Projected deficit in Week 5/6 (-780 000 MAD) due to DSO 88d</div>
              <div>• <strong>SPV Delta:</strong> Drawdown requirement for CAPEX solar milestone (-350 000 MAD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={locale === "en" ? "Consolidated Cash at W13" : "Trésorerie Consolidée Fin S13"}
          value={formatMoney(weeklyTotals[12], consolidationCurrency)}
          change={3.1}
          changeLabel={locale === "en" ? "vs W1" : "vs S1"}
          description={locale === "en" ? "Aggregated balance at quarter end" : "Solde agrégé au terme du trimestre"}
          icon={<CalendarRange className="w-4 h-4 text-blue-600" />}
          sparklineData={[154, 153, 151, 155, 156, 158, 160]}
        />

        <KPICard
          title={locale === "en" ? "Group Cash Trough (Low Point)" : "Point Bas de Trésorerie Groupe"}
          value={formatMoney(Math.min(...weeklyTotals), consolidationCurrency)}
          badge={locale === "en" ? "Week 1" : "Semaine 1"}
          badgeVariant="blue"
          description={locale === "en" ? "Minimum buffer fully preserved" : "Niveau de sécurité préservé"}
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
          sparklineData={[145, 148, 149, 152, 154, 156, 158]}
        />

        <KPICard
          title={locale === "en" ? "Inter-Subsidiary Arbitrage Need" : "Besoin d'Arbitrage Inter-Filiales"}
          value="780 000 MAD"
          badge="Entity Beta"
          badgeVariant="rose"
          description={locale === "en" ? "Operating deficit in W4-W6" : "Déficit d'exploitation sous 4 à 6 semaines"}
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          sparklineData={[20, 15, 10, -5, -12, -20]}
        />

        <KPICard
          title={locale === "en" ? "Net Theoretical Group Surplus" : "Excédent Net Théorique"}
          value={formatMoney(allocationAnalysis.totalSurplus - allocationAnalysis.totalDeficit, "MAD")}
          badge="Coverage 100%"
          badgeVariant="green"
          description={locale === "en" ? "Aggregate internal liquidity ample" : "Liquidité groupe suffisante"}
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
          sparklineData={[42, 43, 44, 45, 46, 47, 48]}
        />
      </div>

      {/* 13-Week Consolidated Forecast Matrix */}
      <Card
        title={locale === "en" ? "13-Week Consolidated Cash Forecast Grid" : "Grille Prévisionnelle Hebdomadaire (13 Semaines)"}
        subtitle={locale === "en" ? "Weekly projected cash balances by legal entity (in thousands of MAD)" : "Évolution du solde de trésorerie par entité (en milliers de MAD)"}
        headerAction={
          <div className="flex items-center gap-2">
            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs"
            >
              <option value="all">{t.common.allEntities}</option>
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
          <table className="w-full text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-left min-w-[200px]">{locale === "en" ? "Entity / Period" : "Entité / Période"}</th>
                <th className="p-3 text-right font-mono bg-slate-200/70 font-bold">{locale === "en" ? "Current" : "Actuel"}</th>
                {weeks.map((w, idx) => (
                  <th
                    key={w}
                    className={cn(
                      "p-3 text-right font-mono min-w-[70px]",
                      idx === 3 || idx === 5 ? "bg-amber-100/60 text-amber-900" : ""
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
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <td className="p-3 font-bold text-slate-900 flex items-center justify-between">
                      <span>{ent.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({ent.code})</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold bg-slate-50 text-slate-800 font-tabular">
                      {formatMoney(ent.financials.cash / 1000)}k
                    </td>
                    {ent.financials.cashTrendWeekly.map((val, wIndex) => {
                      const isNegative = val < 0;
                      const isBelowMin = val * 1000 < ent.financials.operationalMinimum;
                      return (
                        <td
                          key={wIndex}
                          className={cn(
                            "p-3 text-right font-mono font-tabular",
                            isNegative
                              ? "bg-rose-100 font-bold text-rose-700"
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
              <tr className="bg-slate-950 text-white font-bold border-t-2 border-slate-700">
                <td className="p-3.5 tracking-wide">{locale === "en" ? "TOTAL CONSOLIDATED GROUP" : "TOTAL CONSOLIDÉ GROUPE"}</td>
                <td className="p-3.5 text-right font-mono text-emerald-400 font-tabular">
                  {formatMoney(consolidatedSummary.totalGroupCash / 1000)}k
                </td>
                {weeklyTotals.map((tot, idx) => (
                  <td key={idx} className="p-3.5 text-right font-mono text-emerald-400 font-tabular">
                    {formatMoney(tot / 1000)}k
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400" />
              <span>{locale === "en" ? "Cash Deficit / Breach" : "Déficit / Rupture de cash"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300" />
              <span>{locale === "en" ? "Below Minimum Operating Buffer" : "Sous le seuil minimal de sécurité"}</span>
            </span>
          </div>
          <span>{locale === "en" ? "Unit: k MAD (Thousands of Dirhams)" : "Unité : k MAD (Milliers de Dirhams)"}</span>
        </div>
      </Card>
    </AppShell>
  );
}
