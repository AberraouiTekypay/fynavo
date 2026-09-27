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
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

export default function GroupDashboardPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
    selectEntity,
  } = useGroup();

  const [sortField, setSortField] = React.useState<string>("revenue");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [filterCountry, setFilterCountry] = React.useState<string>("all");

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Sort and filter entities
  const filteredEntities = React.useMemo(() => {
    let list = [...entities];
    if (filterCountry !== "all") {
      list = list.filter((e) => e.country.toLowerCase().includes(filterCountry.toLowerCase()));
    }

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
        case "arOverdue":
          valA = a.financials.arOverdue;
          valB = b.financials.arOverdue;
          break;
        default:
          valA = a.financials.revenue;
          valB = b.financials.revenue;
      }
      return sortDirection === "desc" ? valB - valA : valA - valB;
    });

    return list;
  }, [entities, sortField, sortDirection, filterCountry]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <AppShell
      title="Vue Groupe Consolidée"
      subtitle={`Pilotage multi-entités institutionnel • Devise : ${consolidationCurrency}`}
    >
      {/* Top Advisory Banner / QA Scenario Alerts */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  Synthèse AI CFO Groupe
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Temps Réel
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
                Le groupe affiche une trésorerie globale de{" "}
                <span className="font-bold text-white">
                  {formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}
                </span>
                , mais seulement{" "}
                <span className="font-bold text-emerald-400">
                  {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
                </span>{" "}
                sont immédiatement mobilisables (déduction faite des réserves opérationnelles de sécurité).
                L&apos;EBITDA consolidé atteint{" "}
                <span className="font-bold text-white">
                  {formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}
                </span>{" "}
                après élimination des flux internes. Une tension de trésorerie critique est projetée sous 4 semaines sur{" "}
                <strong className="text-rose-400">Entity Beta</strong> (DSO 88 jours, créances en retard de 6,4M MAD).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/group/forecast">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Allocation de Liquidité
              </Button>
            </Link>
          </div>
        </div>

        {/* Noticeable Red Alert if Mismatch or Shortfall */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Écart intercompany :</strong> 20 000 MAD à réconcilier entre Alpha et Beta.
            </span>
          </div>
          <Link href="/group/intercompany" className="text-blue-400 underline hover:text-blue-300 text-[11px]">
            Résoudre l&apos;écart →
          </Link>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              <strong>Consolidation de gestion :</strong> Intégration globale (Holding, Alpha, Beta, Gamma) & proportionnelle (Delta 60%).
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Consolidated Level) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Chiffre d'Affaires Consolidé"
          value={`${formatMoney(consolidatedSummary.consolidatedRevenue)} ${consolidationCurrency}`}
          badge="+8.4% N-1"
          badgeVariant="green"
          description={`Élimination interne : -${formatMoney(consolidatedSummary.eliminatedInternalRevenue)} ${consolidationCurrency}`}
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="EBITDA Consolidé"
          value={`${formatMoney(consolidatedSummary.consolidatedEbitda)} ${consolidationCurrency}`}
          badge={`${consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% marge`}
          badgeVariant="green"
          description="Après neutralisation des management fees"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Trésorerie Groupe Totale"
          value={`${formatMoney(consolidatedSummary.totalGroupCash)} ${consolidationCurrency}`}
          badge="Global"
          badgeVariant="blue"
          description={`Mobilisable : ${formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} ${consolidationCurrency}`}
          icon={<Wallet className="w-4 h-4 text-indigo-600" />}
        />

        <KPICard
          title="Dette Nette Consolidée"
          value={`${formatMoney(consolidatedSummary.consolidatedNetDebt)} ${consolidationCurrency}`}
          badge={`Levier ${consolidatedSummary.debtToEbitdaRatio.toFixed(1)}x`}
          badgeVariant={consolidatedSummary.debtToEbitdaRatio > 3 ? "warning" : "default"}
          description="Prêts intercompany éliminés (-1,5M)"
          icon={<ShieldAlert className="w-4 h-4 text-slate-600" />}
        />
      </div>

      {/* Secondary Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Trésorerie Réellement Mobilisable
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-600">
              {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Réserves sécurité déduites ({formatMoney(consolidatedSummary.totalOperationalMinimum)} {consolidationCurrency})
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Créances Clients en Souffrance
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-rose-600">
              {formatMoney(consolidatedSummary.criticalAROverdue)} {consolidationCurrency}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Concentrées à 80% sur Entity Beta (DSO 88j)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            CAPEX Engagé Groupe
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              {formatMoney(consolidatedSummary.totalCapexCommitted)} {consolidationCurrency}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Gamma robotique (3,8M) & Delta solaire (2,1M)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Besoin de Financement 13s
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-amber-600">
              {formatMoney(consolidatedSummary.groupFundingRequirement13W)} {consolidationCurrency}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Déficit d&apos;exploitation Beta en Semaine 6
          </p>
        </div>
      </div>

      {/* Main Section: Performance by Entity Table */}
      <Card
        title="Performance par Entité & Filiale"
        subtitle="Classement et métriques clés • Cliquez sur une entité pour ouvrir son espace de travail financier"
        headerAction={
          <div className="flex items-center gap-2">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Tous pays (Maroc, France, EAU)</option>
              <option value="maroc">Maroc (MAD)</option>
              <option value="france">France (EUR)</option>
              <option value="emirats">Émirats / Intl (USD)</option>
            </select>

            <Link href="/group/structure">
              <Button variant="secondary" size="sm" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
                Arborescence
              </Button>
            </Link>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité / Société</TableHead>
                <TableHead>Type & Détention</TableHead>
                <TableHead>Pays / Devise</TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("revenue")}
                >
                  CA ({consolidationCurrency}) {sortField === "revenue" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("ebitda")}
                >
                  EBITDA {sortField === "ebitda" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("cash")}
                >
                  Trésorerie {sortField === "cash" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("debt")}
                >
                  Dette Brute {sortField === "debt" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="right"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("bfr")}
                >
                  BFR {sortField === "bfr" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead
                  align="center"
                  className="cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort("variance")}
                >
                  vs Budget {sortField === "variance" && (sortDirection === "desc" ? "↓" : "↑")}
                </TableHead>
                <TableHead align="center">Statut Santé</TableHead>
                <TableHead align="right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.map((ent) => {
                const isPreOpening = ent.operationalStatus === "pre_opening";
                const isTension = ent.healthPillars.liquidity.status === "critical";

                return (
                  <TableRow
                    key={ent.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                          {ent.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight hover:text-blue-600 transition-colors">
                            {ent.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {ent.legalName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-slate-700 capitalize">
                          {ent.type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Détention : <strong>{ent.ownershipPercentage}%</strong> ({ent.consolidationMethod})
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

                    <TableCell align="right" className="font-mono font-semibold">
                      {isPreOpening ? (
                        <span className="text-slate-400 italic">Pré-revenu</span>
                      ) : (
                        `${formatMoney(ent.financials.revenue)}`
                      )}
                    </TableCell>

                    <TableCell align="right" className="font-mono">
                      {isPreOpening ? (
                        <span className="text-slate-400 italic text-[11px]">Développement</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-slate-900">
                            {formatMoney(ent.financials.ebitda)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ent.financials.ebitdaMargin.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="right" className="font-mono">
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

                    <TableCell align="right" className="font-mono text-slate-700">
                      {formatMoney(ent.financials.grossDebt)}
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-700">
                      {formatMoney(ent.financials.workingCapital)}
                    </TableCell>

                    <TableCell align="center">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded",
                          ent.financials.budgetVariancePct >= 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        )}
                      >
                        {ent.financials.budgetVariancePct >= 0 ? "+" : ""}
                        {ent.financials.budgetVariancePct}%
                      </span>
                    </TableCell>

                    <TableCell align="center">
                      {isTension ? (
                        <Badge variant="rose" dot>
                          Tension Cash
                        </Badge>
                      ) : isPreOpening ? (
                        <Badge variant="blue" dot>
                          Pré-ouverture
                        </Badge>
                      ) : ent.healthPillars.debtSolvency.status === "critical" ? (
                        <Badge variant="amber" dot>
                          Dette élevée
                        </Badge>
                      ) : (
                        <Badge variant="green" dot>
                          Sain
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectEntity(ent.id);
                        }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            Affichage de <strong>{filteredEntities.length} entités</strong> consolidées selon les règles de gestion du groupe.
          </span>
          <div className="flex items-center gap-3">
            <Link href="/group/performance" className="font-semibold text-blue-600 hover:underline">
              Comparateur détaillé des filiales →
            </Link>
          </div>
        </div>
      </Card>

      {/* Two Column Section: Cash Mobility Breakdown & Debt / CAPEX Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Mobility & Deployable Liquidity Card */}
        <Card
          title="Mobilité de la Trésorerie & Réserves"
          subtitle="Distinction entre le cash total affiché et la liquidité réellement mobilisable"
          headerAction={
            <Link href="/group/cash">
              <Button variant="outline" size="sm">
                Voir détails trésorerie →
              </Button>
            </Link>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Liquidité Réellement Mobilisable
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Fonds transférables sans contrainte de seuil minimal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-600">
                    {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {(
                      (consolidatedSummary.actuallyDeployableLiquidity /
                        consolidatedSummary.totalGroupCash) *
                      100
                    ).toFixed(0)}
                    % du cash global
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Réserve opérationnelle minimale de sécurité (toutes entités)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMoney(consolidatedSummary.totalOperationalMinimum)} {consolidationCurrency}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{
                    width: `${(consolidatedSummary.totalOperationalMinimum / consolidatedSummary.totalGroupCash) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-medium">
                  Trésorerie restreinte (nantissements bancaires & séquestres)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMoney(consolidatedSummary.totalRestrictedCash)} {consolidationCurrency}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{
                    width: `${(consolidatedSummary.totalRestrictedCash / consolidatedSummary.totalGroupCash) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <strong>Règle de gouvernance groupe :</strong> Ne pas ordonner de transfert de trésorerie depuis l&apos;entité Alpha sans préserver son seuil d&apos;exploitation de 1,2 M MAD et sans convention de trésorerie formalisée.
            </div>
          </div>
        </Card>

        {/* Intercompany & Eliminations Snapshot */}
        <Card
          title="Intercompany & Réconciliations"
          subtitle="Contrôle des flux croisés et élimination des doubles comptes"
          headerAction={
            <Link href="/group/intercompany">
              <Button variant="outline" size="sm">
                Module Intercompany →
              </Button>
            </Link>
          }
        >
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Écart de réconciliation détecté : 20 000 MAD
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Alpha a comptabilisé une créance de 500 000 MAD sur Beta pour refacturation informatique, alors que Beta n&apos;a enregistré qu&apos;une dette de 480 000 MAD suite à une contestation de frais.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Link href="/group/intercompany">
                    <Button variant="secondary" size="sm" className="h-7 text-xs">
                      Arbitrer l&apos;écart
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Management Fees Éliminés (P&L)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Produits Holding contre Charges Filiales
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  -1 050 000 {consolidationCurrency}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Prêt d&apos;Amorçage Holding → SPV Delta
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Créance financière neutralisée du bilan consolidé
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-600">
                  -1 500 000 {consolidationCurrency}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Prestations & Refacturations Internes
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Services informatiques & ingénierie partagée
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
