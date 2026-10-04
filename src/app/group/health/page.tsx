"use client";

import * as React from "react";
import Link from "next/link";
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
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowRight,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function GroupHealthDataQualityPage() {
  const { entities, consolidationCurrency } = useGroup();
  const { t, locale } = useLanguage();

  return (
    <AppShell
      title={t.health.title}
      subtitle={`${t.health.subtitle}${consolidationCurrency}`}
    >
      {/* Top Warning Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {t.health.bannerTitle}
              </h2>
              <Badge variant="blue" size="sm" dot>
                {locale === "en" ? "Real-Time Audit" : "Audit Actif"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {t.health.bannerDesc}
            </p>
          </div>
        </div>

        <Link href="/group/intercompany" className="shrink-0">
          <Button
            variant="secondary"
            size="sm"
            className="border-slate-300 font-semibold"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {t.health.resolveDiscrepancy}
          </Button>
        </Link>
      </div>

      {/* Top 4 Data Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t.health.kpiFreshness}
          value="95.2%"
          badge={t.health.statusCompliant}
          badgeVariant="green"
          description={t.health.kpiFreshnessDesc}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          sparklineData={[91, 92, 92, 94, 95, 95.2]}
        />

        <KPICard
          title={t.health.kpiMissingPeriods}
          value={`0 ${locale === "en" ? "periods" : "période"}`}
          badge={locale === "en" ? "Complete" : "Complet"}
          badgeVariant="green"
          description={t.health.kpiMissingPeriodsDesc}
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title={t.health.kpiPendingIntercompany}
          value={`1 ${locale === "en" ? "item" : "transaction"}`}
          badge={`20 000 ${consolidationCurrency}`}
          badgeVariant="warning"
          description={t.health.kpiPendingIntercompanyDesc}
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title={t.health.kpiBankFeeds}
          value={`4 / 5 ${locale === "en" ? "entities" : "entités"}`}
          badge="80% Direct API"
          badgeVariant="blue"
          description={t.health.kpiBankFeedsDesc}
          icon={<Wifi className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Entity Audit Table */}
      <Card
        title={t.health.tableTitle}
        subtitle={t.health.tableSubtitle}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead>{t.health.colEntity}</TableHead>
                <TableHead align="center">{t.health.colLastImport}</TableHead>
                <TableHead align="center">{t.health.colBankFeed}</TableHead>
                <TableHead align="center">{t.health.colMissingPeriods}</TableHead>
                <TableHead align="center">{t.health.colIntercompanyGaps}</TableHead>
                <TableHead align="center">{t.health.colBudgetConfig}</TableHead>
                <TableHead align="right">{t.health.colFreshnessScore}</TableHead>
                <TableHead align="center">{t.health.colIntegrityStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => (
                <TableRow key={ent.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell>
                    <div className="font-extrabold text-slate-900">{ent.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize font-medium">
                      {ent.country} • {ent.functionalCurrency}
                    </div>
                  </TableCell>

                  <TableCell align="center" className="font-mono text-xs text-slate-700 font-medium">
                    {ent.dataQuality.lastUpdate}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.bankFeedConnected ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                        <Wifi className="w-3 h-3 text-emerald-600" />
                        <span>{t.health.statusConnected}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        <WifiOff className="w-3 h-3 text-slate-400" />
                        <span>{t.health.statusFlatFile}</span>
                      </span>
                    )}
                  </TableCell>

                  <TableCell align="center" className="font-mono text-xs font-bold font-tabular">
                    {ent.dataQuality.missingPeriodsCount === 0 ? (
                      <span className="text-emerald-700">0</span>
                    ) : (
                      <span className="text-rose-600 font-extrabold">{ent.dataQuality.missingPeriodsCount}</span>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.unmatchedIntercompanyCount > 0 ? (
                      <Badge variant="rose" size="sm" dot>
                        {ent.dataQuality.unmatchedIntercompanyCount} {locale === "en" ? "gap (20K)" : "écart (20K)"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        0 {locale === "en" ? "gap" : "écart"}
                      </span>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.budgetConfigured ? (
                      <Badge variant="green" size="sm">
                        {t.health.statusConfigured}
                      </Badge>
                    ) : (
                      <Badge variant="slate" size="sm">
                        {t.health.statusNotConfigured}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-black text-slate-900 font-tabular text-sm">
                    {ent.dataQuality.freshnessScorePct}%
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.freshnessScorePct >= 95 ? (
                      <Badge variant="green" dot>
                        {t.health.statusCompliant}
                      </Badge>
                    ) : (
                      <Badge variant="amber" dot>
                        {t.health.statusReview}
                      </Badge>
                    )}
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
