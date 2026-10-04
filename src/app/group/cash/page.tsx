"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KPICard } from "@/components/ui/KPICard";
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
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function GroupCashPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
    selectEntity,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

  // Cash by country calculation
  const cashByCountry = React.useMemo(() => {
    const map = new Map<string, number>();
    entities.forEach((e) => {
      map.set(e.country, (map.get(e.country) || 0) + e.financials.cash);
    });
    return Array.from(map.entries()).map(([country, amount]) => ({
      country,
      amount,
      pct: ((amount / consolidatedSummary.totalGroupCash) * 100).toFixed(1),
    }));
  }, [entities, consolidatedSummary.totalGroupCash]);

  const deployableRatio = (
    (consolidatedSummary.actuallyDeployableLiquidity / consolidatedSummary.totalGroupCash) *
    100
  ).toFixed(1);

  return (
    <AppShell
      title={t.cash.title}
      subtitle={`${t.cash.subtitle} ${consolidationCurrency}`}
    >
      {/* Top Mobility Diagnostic Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6 card-accent-top">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold text-slate-900">
                {t.cash.diagnosticTitle}
              </h2>
              <Badge variant="green" size="sm" dot>
                {t.common.active}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {locale === "en" ? (
                <>
                  The group displays a gross bank balance of{" "}
                  <strong className="text-slate-900 font-bold">
                    {formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
                  </strong>
                  . After deducting mandatory operating buffers (
                  {formatMoney(consolidatedSummary.totalOperationalMinimum, consolidationCurrency)}) and ring-fenced escrow funds (
                  {formatMoney(consolidatedSummary.totalRestrictedCash, consolidationCurrency)}), unrestricted liquidity stands at{" "}
                  <strong className="text-emerald-700 font-bold">
                    {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)} ({deployableRatio}%)
                  </strong>
                  .
                </>
              ) : (
                <>
                  Le groupe affiche un solde bancaire brut de{" "}
                  <strong className="text-slate-900 font-bold">
                    {formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
                  </strong>
                  . Après déduction des tampons opérationnels obligatoires (
                  {formatMoney(consolidatedSummary.totalOperationalMinimum, consolidationCurrency)}) et des séquestres bancaires (
                  {formatMoney(consolidatedSummary.totalRestrictedCash, consolidationCurrency)}), la liquidité réellement mobilisable s&apos;établit à{" "}
                  <strong className="text-emerald-700 font-bold">
                    {formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)} ({deployableRatio}%)
                  </strong>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/group/forecast">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              {t.nav.forecast13Weeks}
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.cash.totalBankCash}
          value={formatMoney(consolidatedSummary.totalGroupCash, consolidationCurrency)}
          badge="100% Banks"
          badgeVariant="blue"
          description={locale === "en" ? "Cumulative gross across all entities" : "Solde brut cumulé de toutes les entités"}
          icon={<Wallet className="w-4 h-4 text-blue-600" />}
          sparklineData={[140, 145, 143, 148, 150, 153, 154]}
        />

        <KPICard
          title={t.cash.deployableLiquidity}
          value={formatMoney(consolidatedSummary.actuallyDeployableLiquidity, consolidationCurrency)}
          badge={`${deployableRatio}%`}
          badgeVariant="green"
          description={locale === "en" ? "Excludes operational buffers" : "Hors seuils d'exploitation minimaux"}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          sparklineData={[95, 98, 102, 104, 106, 107]}
        />

        <KPICard
          title={t.cash.minOperatingBuffer}
          value={formatMoney(consolidatedSummary.totalOperationalMinimum, consolidationCurrency)}
          badge={locale === "en" ? "Protected" : "Verrouillé"}
          badgeVariant="amber"
          description={locale === "en" ? "Working capital reserve" : "Fonds requis pour le cycle courant"}
          icon={<Lock className="w-4 h-4 text-amber-600" />}
          sparklineData={[47, 47, 47, 47, 47, 47]}
        />

        <KPICard
          title={locale === "en" ? "Entities under Cash Tension" : "Entités en Tension de Trésorerie"}
          value={locale === "en" ? "1 Entity (Beta)" : "1 entité (Beta)"}
          badge={locale === "en" ? "Week 4 Warning" : "Alerte Semaine 4"}
          badgeVariant="rose"
          description={locale === "en" ? "Projected shortfall within 30 days" : "Rupture prévisionnelle sous 30 jours"}
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          sparklineData={[30, 26, 20, 15, 8, -5]}
        />
      </div>

      {/* Detailed Entity Cash & Mobility Table */}
      <Card
        title={t.cash.entityBreakdownTitle}
        subtitle={locale === "en" ? "Granular view of immediate liquidity and mandatory operating covenants" : "Détail de la liquidité immédiate et des tampons d'exploitation requis"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.colEntity}</TableHead>
                <TableHead>{t.dashboard.colCountry}</TableHead>
                <TableHead align="right">{locale === "en" ? "Balance (Local Curr.)" : "Solde Brut en Devise"}</TableHead>
                <TableHead align="right">{locale === "en" ? `Equivalent (${consolidationCurrency})` : `Équivalent (${consolidationCurrency})`}</TableHead>
                <TableHead align="right">{locale === "en" ? "Operating Buffer" : "Minimum Opérationnel"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Deployable Cash" : "Cash Mobilisable"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Mobility Status" : "Statut de Mobilité"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Runway" : "Horizon / Runway"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => {
                const isCritical = ent.financials.cash < ent.financials.operationalMinimum;
                const deployable = Math.max(0, ent.financials.cash - ent.financials.operationalMinimum);

                return (
                  <TableRow
                    key={ent.id}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center font-bold text-xs text-slate-800">
                          {ent.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {ent.name}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {ent.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700">{ent.country}</span>
                        <Badge variant="outline" size="sm">
                          {ent.functionalCurrency}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-800 font-tabular">
                      {formatMoney(ent.financials.cash)} {ent.functionalCurrency}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                      {formatMoney(ent.financials.cash, consolidationCurrency)}
                    </TableCell>

                    <TableCell align="right" className="font-mono text-amber-700 font-tabular">
                      {formatMoney(ent.financials.operationalMinimum, consolidationCurrency)}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold font-tabular">
                      <span className={deployable > 0 ? "text-emerald-600" : "text-slate-400"}>
                        {formatMoney(deployable, consolidationCurrency)}
                      </span>
                    </TableCell>

                    <TableCell align="center">
                      {isCritical ? (
                        <Badge variant="rose" dot>
                          {locale === "en" ? "Below Buffer" : "Déficit sous seuil"}
                        </Badge>
                      ) : deployable > 1000000 ? (
                        <Badge variant="green" dot>
                          {locale === "en" ? "Freely Deployable" : "Librement disponible"}
                        </Badge>
                      ) : (
                        <Badge variant="amber" dot>
                          {locale === "en" ? "Covenant Protected" : "Réserve protégée"}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <span
                        className={cn(
                          "text-xs font-bold font-tabular px-2 py-0.5 rounded-md",
                          ent.financials.runwayMonths < 3
                            ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {ent.financials.runwayMonths.toFixed(1)} {locale === "en" ? "mo" : "mois"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Breakdown by Geography & Banking Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title={t.cash.cashByCountryTitle}
          subtitle={locale === "en" ? "Currency exposure and sovereign transfer rules" : "Exposition aux devises et juridictions fiscales"}
        >
          <div className="space-y-4">
            {cashByCountry.map((item) => (
              <div key={item.country} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 font-tabular">
                      {formatMoney(item.amount, consolidationCurrency)}
                    </span>
                    <span className="text-[11px] text-slate-400">({item.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title={locale === "en" ? "Banking Facilities & Credit Lines" : "Partenaires Bancaires & Covenants"}
          subtitle={locale === "en" ? "Main corporate accounts and active credit lines" : "Comptes principaux et facilités de caisse actives"}
        >
          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Attijariwafa Bank (Holding & Alpha)</span>
                <span className="text-[11px] text-slate-500">{locale === "en" ? "Group central treasury pool account" : "Compte pivot centralisateur de trésorerie"}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 font-tabular">7 250 000 MAD</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Banque Centrale Populaire (Gamma)</span>
                <span className="text-[11px] text-slate-500">{locale === "en" ? "Operating plant and equipment credit line" : "Comptes d'exploitation usine et ligne de crédit"}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 font-tabular">680 000 MAD</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">BNP Paribas Commercial (Beta Europe)</span>
                <span className="text-[11px] text-slate-500">{locale === "en" ? "Factoring line and EUR current account" : "Ligne d'affacturage et compte courant EUR"}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 font-tabular">420 000 MAD (38.7K €)</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Emirates NBD (SPV Delta)</span>
                <span className="text-[11px] text-slate-500">{locale === "en" ? "Escrow account for solar project" : "Compte séquestre projet solaire international"}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 font-tabular">720 000 MAD (72.3K $)</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
