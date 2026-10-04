"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  Building2,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Search,
  GitBranch,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function GroupDashboardPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
    selectEntity,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

  const [sortField, setSortField] = React.useState<string>("revenue");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [filterCountry, setFilterCountry] = React.useState<string>("all");
  const [filterTab, setFilterTab] = React.useState<"all" | "operating" | "holding_spv" | "attention">("all");
  const [tableSearch, setTableSearch] = React.useState<string>("");

  // Sort and filter entities
  const filteredEntities = React.useMemo(() => {
    let list = [...entities];

    // Filter by Tab
    if (filterTab === "operating") {
      list = list.filter((e) => e.type === "subsidiary" && e.operationalStatus === "operating");
    } else if (filterTab === "holding_spv") {
      list = list.filter((e) => e.type === "holding" || e.type === "spv");
    } else if (filterTab === "attention") {
      list = list.filter(
        (e) =>
          e.healthPillars.liquidity.status === "critical" ||
          e.healthPillars.debtSolvency.status === "critical" ||
          e.financials.arOverdue > 500000
      );
    }

    // Filter by Country
    if (filterCountry !== "all") {
      list = list.filter((e) => e.country.toLowerCase().includes(filterCountry.toLowerCase()));
    }

    // Filter by Search Query
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q) ||
          e.legalName.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      switch (sortField) {
        case "revenue":
          valA = a.financials.revenue;
          valB = b.financials.revenue;
          break;
        case "ebitda":
          valA = a.financials.ebitda;
          valB = b.financials.ebitda;
          break;
        case "cash":
          valA = a.financials.cash;
          valB = b.financials.cash;
          break;
        case "debt":
          valA = a.financials.grossDebt;
          valB = b.financials.grossDebt;
          break;
        case "bfr":
          valA = a.financials.workingCapital;
          valB = b.financials.workingCapital;
          break;
        case "variance":
          valA = a.financials.budgetVariancePct;
          valB = b.financials.budgetVariancePct;
          break;
        default:
          valA = a.financials.revenue;
          valB = b.financials.revenue;
      }
      return sortDirection === "desc" ? valB - valA : valA - valB;
    });

    return list;
  }, [entities, sortField, sortDirection, filterCountry, filterTab, tableSearch]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const deployableRatio = (
    (consolidatedSummary.actuallyDeployableLiquidity / consolidatedSummary.totalGroupCash) *
    100
  ).toFixed(1);

  return (
    <AppShell
      title={t.dashboard.heroTitle}
      subtitle={`${t.dashboard.heroSubtitle} • Currency : ${consolidationCurrency}`}
    >
      {/* Top Advisory Banner / Executive AI Brief */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#1E293B] p-6 text-white border border-white/10 shadow-xl">
        {/* Subtle decorative mesh background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {locale === "en" ? "Executive AI Financial Brief" : "Synthèse IA CFO Groupe"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {t.common.liveSync}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Atlas Alliance Group SA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
                {locale === "en" ? (
                  <>
                    The group holds a gross treasury balance of{" "}
                    <strong className="text-white font-semibold">
                      {formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
                    </strong>
                    , with{" "}
                    <strong className="text-emerald-400 font-semibold">
                      {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)} ({deployableRatio}%)
                    </strong>{" "}
                    unrestricted and immediately deployable after mandatory operating buffers. Consolidated EBITDA stands at{" "}
                    <strong className="text-white font-semibold">
                      {formatMoney(consolidatedSummary.consolidatedEbitda, consolidationCurrency)}
                    </strong>{" "}
                    ({consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% margin).
                  </>
                ) : (
                  <>
                    Le groupe affiche une trésorerie globale de{" "}
                    <strong className="text-white font-semibold">
                      {formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
                    </strong>
                    , dont{" "}
                    <strong className="text-emerald-400 font-semibold">
                      {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)} ({deployableRatio}%)
                    </strong>{" "}
                    sont immédiatement mobilisables après déduction des réserves de sécurité. L&apos;EBITDA consolidé s&apos;établit à{" "}
                    <strong className="text-white font-semibold">
                      {formatMoney(consolidatedSummary.consolidatedEbitda, consolidationCurrency)}
                    </strong>{" "}
                    ({consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% de marge).
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link href="/group/forecast">
              <Button
                variant="blue"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="shadow-md shadow-blue-600/30"
              >
                {locale === "en" ? "13-Week Cash Runway" : "Allocation Trésorerie"}
              </Button>
            </Link>
            <Link href="/group/scenarios">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<GitBranch className="w-3.5 h-3.5" />}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {t.dashboard.runStressTest}
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Critical Alert Notice */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <span className="font-semibold text-white">
              {locale === "en" ? "Entity Beta:" : "Entity Beta :"}
            </span>
            <span>
              {locale === "en"
                ? "Critical cash tension in 4 weeks (DSO 88d, 6.4M MAD overdue AR)."
                : "Tension de trésorerie critique sous 4 semaines (DSO 88j, 6,4M MAD échues)."}
            </span>
            <Link
              href="/group/cash"
              className="text-blue-400 hover:text-blue-300 underline font-semibold ml-1 inline-flex items-center gap-0.5"
            >
              <span>{locale === "en" ? "Simulate Bridge Facility" : "Simuler un prêt relais"}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
              <strong>{locale === "en" ? "20,000 MAD Mismatch:" : "Écart de 20 000 MAD :"}</strong> Alpha vs Beta
            </span>
            <Link
              href="/group/intercompany"
              className="text-amber-200 hover:text-white underline font-semibold"
            >
              {locale === "en" ? "Reconcile →" : "Rapprocher →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Consolidated Level) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.dashboard.kpiRevenue}
          value={formatMoney(consolidatedSummary.consolidatedRevenue, consolidationCurrency)}
          change={8.4}
          changeLabel={locale === "en" ? "vs FY25" : "vs N-1"}
          description={t.dashboard.kpiRevenueDesc}
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          sparklineData={[38, 42, 45, 43, 49, 52, 54, 58]}
        />

        <KPICard
          title={t.dashboard.kpiEbitda}
          value={formatMoney(consolidatedSummary.consolidatedEbitda, consolidationCurrency)}
          badge={`${consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}%`}
          badgeVariant="green"
          description={t.dashboard.kpiEbitdaDesc}
          icon={<Activity className="w-4 h-4 text-emerald-600" />}
          sparklineData={[12, 14, 13, 16, 15, 17, 18, 20]}
        />

        <KPICard
          title={t.dashboard.kpiCashTotal}
          value={formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
          badge={`${deployableRatio}% ${t.dashboard.deployableSuffix}`}
          badgeVariant="blue"
          description={`Deployable: ${formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)}`}
          icon={<Wallet className="w-4 h-4 text-indigo-600" />}
          sparklineData={[140, 148, 145, 150, 153, 151, 155, 154]}
        />

        <KPICard
          title={t.dashboard.kpiNetDebt}
          value={formatMoney(consolidatedSummary.consolidatedNetDebt, consolidationCurrency)}
          badge={`Leverage ${consolidatedSummary.debtToEbitdaRatio.toFixed(1)}x`}
          badgeVariant={consolidatedSummary.debtToEbitdaRatio > 3 ? "warning" : "default"}
          description={t.dashboard.kpiNetDebtDesc}
          icon={<ShieldAlert className="w-4 h-4 text-slate-600" />}
          sparklineData={[24, 23, 22, 21, 20, 20, 19, 19]}
        />
      </div>

      {/* Secondary Financial Micro-Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{t.dashboard.kpiCashDeployable}</span>
            <span className="text-emerald-600 font-semibold">{deployableRatio}%</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-600 font-tabular">
              {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${deployableRatio}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            {locale === "en" ? "Excludes operating buffer (" : "Tampon sécurité déduit ("}
            {formatMoney(consolidatedSummary.totalOperationalMinimum, consolidationCurrency)})
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{locale === "en" ? "Overdue Receivables" : "Créances Échues"}</span>
            <Badge variant="rose" size="sm">DSO 58d</Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-rose-600 font-tabular">
              {formatMoney(consolidatedSummary.criticalAROverdue, consolidationCurrency)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {locale === "en" ? "80% concentrated on Entity Beta" : "80% concentré sur Entity Beta"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{locale === "en" ? "Committed CAPEX" : "CAPEX Engagé"}</span>
            <span className="text-slate-500 font-semibold">2 Projects</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-tabular">
              {formatMoney(consolidatedSummary.totalCapexCommitted, consolidationCurrency)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {locale === "en" ? "Gamma Robotics & Delta Solar Hub" : "Gamma Robotique & Delta Solaire"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{t.dashboard.kpiRunway}</span>
            <Badge variant="green" size="sm">Healthy</Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-tabular">
              18.4 {locale === "en" ? "Months" : "Mois"}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {locale === "en" ? "Projected horizon across 5 entities" : "Horizon simulé sur 5 entités"}
          </p>
        </div>
      </div>

      {/* Main Section: Performance by Entity Table */}
      <Card
        title={t.dashboard.tableTitle}
        subtitle={t.dashboard.tableSubtitle}
        headerAction={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder={locale === "en" ? "Filter entities..." : "Filtrer les entités..."}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Country Selector */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            >
              <option value="all">{t.common.allCountries}</option>
              <option value="maroc">Morocco (MAD)</option>
              <option value="france">France (EUR)</option>
              <option value="emirats">UAE / Intl (USD)</option>
            </select>

            <Link href="/group/structure">
              <Button variant="secondary" size="sm" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
                {t.structure.title.split("&")[0]}
              </Button>
            </Link>
          </div>
        }
      >
        {/* Segmented Tab Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 mb-4 rounded-xl bg-slate-100 border border-slate-200/80 w-fit text-xs font-semibold">
          <button
            onClick={() => setFilterTab("all")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all",
              filterTab === "all"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {t.dashboard.filterAll}
          </button>
          <button
            onClick={() => setFilterTab("operating")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all",
              filterTab === "operating"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {t.dashboard.filterOperating}
          </button>
          <button
            onClick={() => setFilterTab("holding_spv")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all",
              filterTab === "holding_spv"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {t.dashboard.filterHoldingSpv}
          </button>
          <button
            onClick={() => setFilterTab("attention")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
              filterTab === "attention"
                ? "bg-rose-50 text-rose-800 shadow-sm font-bold border border-rose-200/80"
                : "text-rose-600 hover:text-rose-800"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {t.dashboard.filterAttention}
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.colEntity}</TableHead>
                <TableHead>{locale === "en" ? "Type & Ownership" : "Type & Détention"}</TableHead>
                <TableHead>{t.dashboard.colCountry}</TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("revenue")}
                >
                  {t.dashboard.colRevenue} ({consolidationCurrency}) {sortField === "revenue" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("ebitda")}
                >
                  {t.dashboard.colEbitda} {sortField === "ebitda" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("cash")}
                >
                  {t.dashboard.colCash} {sortField === "cash" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("debt")}
                >
                  {t.dashboard.colGrossDebt} {sortField === "debt" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("bfr")}
                >
                  {t.dashboard.colWorkingCapital} {sortField === "bfr" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="center"
                  className="cursor-pointer hover:text-blue-600 select-none font-bold"
                  onClick={() => handleSort("variance")}
                >
                  vs Budget {sortField === "variance" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead align="center">{t.dashboard.colHealthScore}</TableHead>
                <TableHead align="right">{t.dashboard.colActions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.map((ent) => {
                const isPreOpening = ent.operationalStatus === "pre_opening";
                const isTension = ent.healthPillars.liquidity.status === "critical";

                return (
                  <TableRow
                    key={ent.id}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center font-bold text-xs text-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {ent.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight group-hover:text-blue-600 transition-colors">
                            {ent.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {ent.legalName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-slate-800 capitalize">
                          {ent.type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {locale === "en" ? "Ownership: " : "Détention : "}
                          <strong className="text-slate-800">{ent.ownershipPercentage}%</strong> ({ent.consolidationMethod})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-700">{ent.country}</span>
                        <Badge variant="outline" size="sm">
                          {ent.functionalCurrency}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                      {isPreOpening ? (
                        <span className="text-slate-400 italic font-normal text-xs">
                          {locale === "en" ? "Pre-Revenue" : "Pré-revenu"}
                        </span>
                      ) : (
                        formatMoney(ent.financials.revenue)
                      )}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-tabular">
                      {isPreOpening ? (
                        <span className="text-slate-400 italic text-[11px] font-normal">
                          {locale === "en" ? "Development" : "Développement"}
                        </span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-slate-900">
                            {formatMoney(ent.financials.ebitda)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {ent.financials.ebitdaMargin.toFixed(1)}% margin
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-tabular">
                      <div className="flex flex-col items-end">
                        <span
                          className={cn(
                            "font-bold",
                            isTension ? "text-rose-600" : "text-emerald-700"
                          )}
                        >
                          {formatMoney(ent.financials.cash)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Min: {formatMoney(ent.financials.operationalMinimum)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-700 font-tabular">
                      {formatMoney(ent.financials.grossDebt)}
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-700 font-tabular">
                      {formatMoney(ent.financials.workingCapital)}
                    </TableCell>

                    <TableCell align="center">
                      <span
                        className={cn(
                          "text-xs font-bold font-tabular px-2 py-0.5 rounded-md",
                          ent.financials.budgetVariancePct >= 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        )}
                      >
                        {ent.financials.budgetVariancePct >= 0 ? "+" : ""}
                        {ent.financials.budgetVariancePct}%
                      </span>
                    </TableCell>

                    <TableCell align="center">
                      {isTension ? (
                        <Badge variant="rose" dot>
                          {locale === "en" ? "Cash Tension" : "Tension Cash"}
                        </Badge>
                      ) : isPreOpening ? (
                        <Badge variant="blue" dot>
                          {locale === "en" ? "Pre-Operational" : "Pré-ouverture"}
                        </Badge>
                      ) : ent.healthPillars.debtSolvency.status === "critical" ? (
                        <Badge variant="amber" dot>
                          {locale === "en" ? "High Leverage" : "Dette élevée"}
                        </Badge>
                      ) : (
                        <Badge variant="green" dot>
                          {locale === "en" ? "Healthy" : "Sain"}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectEntity(ent.id);
                        }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            {locale === "en" ? "Displaying " : "Affichage de "}
            <strong className="text-slate-900">{filteredEntities.length} entities</strong>{" "}
            {locale === "en" ? "consolidated according to group rules." : "consolidées selon les règles du groupe."}
          </span>
          <div className="flex items-center gap-3">
            <Link href="/group/performance" className="font-semibold text-blue-600 hover:underline">
              {locale === "en" ? "Detailed subsidiary benchmarking →" : "Comparateur détaillé des filiales →"}
            </Link>
          </div>
        </div>
      </Card>

      {/* Two Column Section: Cash Mobility Breakdown & Intercompany Eliminations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Mobility & Deployable Liquidity Card */}
        <Card
          title={t.cash.title}
          subtitle={t.cash.subtitle}
          headerAction={
            <Link href="/group/cash">
              <Button variant="outline" size="sm">
                {locale === "en" ? "Cash Matrix →" : "Voir détails trésorerie →"}
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {t.cash.deployableLiquidity}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {locale === "en" ? "Unrestricted transferable liquidity" : "Fonds transférables sans contrainte de seuil minimal"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600 font-tabular">
                    {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {deployableRatio}% of gross cash
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {t.cash.minOperatingBuffer}
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMoney(consolidatedSummary.totalOperationalMinimum, consolidationCurrency)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{
                    width: `${(consolidatedSummary.totalOperationalMinimum / consolidatedSummary.totalGroupCash) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-medium">
                  {t.cash.restrictedCash}
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMoney(consolidatedSummary.totalRestrictedCash, consolidationCurrency)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{
                    width: `${(consolidatedSummary.totalRestrictedCash / consolidatedSummary.totalGroupCash) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <strong>{locale === "en" ? "Group Treasury Covenant:" : "Règle de gouvernance groupe :"}</strong>{" "}
              {locale === "en"
                ? "Maintain minimum 1.2M MAD operating buffer on Entity Alpha prior to intercompany dividend distribution or cash pool pooling."
                : "Ne pas ordonner de transfert de trésorerie depuis l'entité Alpha sans préserver son seuil d'exploitation de 1,2 M MAD et sans convention formalisée."}
            </div>
          </div>
        </Card>

        {/* Intercompany & Eliminations Snapshot */}
        <Card
          title={t.nav.intercompanyEliminations}
          subtitle={locale === "en" ? "Cross-entity reconciliation & double-count eliminations" : "Contrôle des flux croisés et élimination des doubles comptes"}
          headerAction={
            <Link href="/group/intercompany">
              <Button variant="outline" size="sm">
                {locale === "en" ? "Intercompany Module →" : "Module Intercompany →"}
              </Button>
            </Link>
          }
        >
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  {t.dashboard.discrepancyAlertTitle}
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  {t.dashboard.discrepancyAlertDesc}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Link href="/group/intercompany">
                    <Button variant="secondary" size="sm" className="h-7 text-xs">
                      {t.dashboard.resolveButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {locale === "en" ? "Management Fees Eliminated (P&L)" : "Management Fees Éliminés (P&L)"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {locale === "en" ? "Holding revenue vs Subsidiary expense" : "Produits Holding contre Charges Filiales"}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  -1 050 000 {consolidationCurrency}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {locale === "en" ? "Seed Loan Holding → SPV Delta" : "Prêt d'Amorçage Holding → SPV Delta"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {locale === "en" ? "Intra-group loan neutralized from balance sheet" : "Créance financière neutralisée du bilan consolidé"}
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-600">
                  -1 500 000 {consolidationCurrency}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {locale === "en" ? "Internal IT & Shared Services" : "Prestations & Refacturations Internes"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {locale === "en" ? "Alpha IT engineering recharge" : "Services informatiques & ingénierie partagée"}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700">
                  -680 000 {consolidationCurrency}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
