"use client";

import * as React from "react";
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
  DEMO_COST_ALLOCATIONS,
  DEMO_MANAGEMENT_FEE_RULES,
} from "@/lib/group/demo-data";
import {
  Split,
  FileText,
  Coins,
  Plus,
} from "lucide-react";

export default function GroupAllocationsPage() {
  const { entities, consolidationCurrency } = useGroup();
  const { t, locale, formatMoney } = useLanguage();

  const [allocations] = React.useState(DEMO_COST_ALLOCATIONS);
  const [feeRules] = React.useState(DEMO_MANAGEMENT_FEE_RULES);

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  return (
    <AppShell
      title={t.allocations.title}
      subtitle={`${t.allocations.subtitle}${consolidationCurrency}`}
    >
      {/* Top Advisory Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100 shadow-2xs">
            <Split className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {t.allocations.bannerTitle}
              </h2>
              <Badge variant="blue" size="sm" dot>
                {locale === "en" ? "OECD Compliant" : "Règles Actives"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {t.allocations.bannerDesc}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 shrink-0 font-semibold"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {t.allocations.newRuleBtn}
        </Button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title={t.allocations.kpiCentralPool}
          value={`890 000 ${consolidationCurrency} / ${locale === "en" ? "yr" : "an"}`}
          badge={locale === "en" ? "HQ & IT" : "Direction & IT"}
          badgeVariant="blue"
          description={t.allocations.kpiCentralPoolDesc}
          icon={<Split className="w-4 h-4 text-indigo-600" />}
          sparklineData={[700, 750, 800, 820, 870, 890]}
        />

        <KPICard
          title={t.allocations.kpiFeesBilled}
          value={`865 500 ${consolidationCurrency} / ${locale === "en" ? "yr" : "an"}`}
          badge={locale === "en" ? "100% Contracted" : "100% Conventionné"}
          badgeVariant="green"
          description={t.allocations.kpiFeesBilledDesc}
          icon={<FileText className="w-4 h-4 text-emerald-600" />}
          sparklineData={[600, 650, 720, 800, 840, 865]}
        />

        <KPICard
          title={t.allocations.kpiFeesCollected}
          value={`745 500 ${consolidationCurrency}`}
          badge="86.1% Collected"
          badgeVariant="warning"
          description={t.allocations.kpiFeesCollectedDesc}
          icon={<Coins className="w-4 h-4 text-amber-600" />}
          sparklineData={[500, 560, 610, 680, 710, 745]}
        />
      </div>

      {/* Shared Costs Allocation Table */}
      <Card
        title={t.allocations.costPoolsTitle}
        subtitle={t.allocations.costPoolsSubtitle}
      >
        <div className="space-y-4">
          {allocations.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    {rule.costPoolName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {locale === "en" ? "Source" : "Source"} : {getEntityName(rule.sourceEntityId)} • {locale === "en" ? "Driver Key" : "Méthode"} : {rule.method.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-sm font-tabular">
                    {formatMoney(rule.annualPoolAmount)} {consolidationCurrency} / {locale === "en" ? "yr" : "an"}
                  </span>
                  <Badge variant="green" size="sm" dot>
                    {locale === "en" ? "Active" : "Active"}
                  </Badge>
                </div>
              </div>

              {/* Split Breakdown Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rule.splits.map((s) => (
                  <div
                    key={s.entityId}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs hover:border-blue-200 transition-colors"
                  >
                    <span className="font-extrabold text-slate-800 block text-xs">
                      {getEntityName(s.entityId)}
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                        {s.percentage}%
                      </span>
                      <span className="font-mono font-black text-slate-900 font-tabular">
                        {formatMoney(s.allocatedAmount)} {consolidationCurrency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Management Fees Table */}
      <Card
        title={t.allocations.managementFeesTitle}
        subtitle={t.allocations.managementFeesSubtitle}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead>{t.allocations.colSubsidiary}</TableHead>
                <TableHead>{t.allocations.colBasis}</TableHead>
                <TableHead align="center">{t.allocations.colRateFormula}</TableHead>
                <TableHead align="right">{t.allocations.colBilled}</TableHead>
                <TableHead align="right">{t.allocations.colCollected}</TableHead>
                <TableHead align="right">{t.allocations.colOutstanding}</TableHead>
                <TableHead align="center">{t.allocations.colStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeRules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="font-extrabold text-slate-900">
                    {getEntityName(rule.subsidiaryEntityId)}
                  </TableCell>

                  <TableCell className="capitalize text-slate-700 font-medium text-xs">
                    {rule.calculationBasis.replace("_", " ")}
                  </TableCell>

                  <TableCell align="center" className="font-mono font-bold text-blue-600 text-xs">
                    {rule.calculationBasis === "pct_revenue" || rule.calculationBasis === "pct_ebitda"
                      ? `${rule.rateOrAmount}%`
                      : `${formatMoney(rule.rateOrAmount)} ${consolidationCurrency} / mo`}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                    {formatMoney(rule.annualBilledMAD)} {consolidationCurrency}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-extrabold text-emerald-700 font-tabular">
                    {formatMoney(rule.annualCollectedMAD)} {consolidationCurrency}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-black font-tabular">
                    <span className={rule.outstandingMAD > 0 ? "text-rose-600" : "text-slate-400"}>
                      {formatMoney(rule.outstandingMAD)} {consolidationCurrency}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <Badge variant={rule.outstandingMAD > 0 ? "amber" : "green"} size="sm" dot>
                      {rule.outstandingMAD > 0 ? t.allocations.statusOverdue : t.allocations.statusUpToDate}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}
