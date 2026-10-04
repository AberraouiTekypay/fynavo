"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Printer,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function GroupReportsPage() {
  const {
    group,
    entities,
    consolidationCurrency,
    consolidatedSummary,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell
      title={t.reports.title}
      subtitle={`${t.reports.subtitle}${consolidationCurrency}`}
    >
      {/* Top Action Bar (hidden when printing) */}
      <div className="print:hidden p-5 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100 shadow-2xs">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {t.reports.bannerTitle}
              </h2>
              <Badge variant="blue" size="sm">
                {locale === "en" ? "Official Board Pack" : "Dossier Officiel"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.reports.bannerDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            {t.reports.printPdf}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {t.reports.downloadReport}
          </Button>
        </div>
      </div>

      {/* Official 13-Section Management Report Document */}
      <div className="p-8 sm:p-12 bg-white rounded-2xl border border-slate-200/90 shadow-elevated text-slate-800 space-y-10 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
              Fynavo FinanceOS • {locale === "en" ? "Executive Management Consolidation" : "Consolidation de Gestion"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {t.reports.docHeaderTitle}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-bold text-slate-700">
                {group.name} ({group.code}) — {locale === "en" ? "Multi-Subsidiary & SPVs Perimeter" : "Périmètre Multi-Filiales & SPVs"}
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-extrabold text-slate-900 block">{t.reports.docHeaderPeriod}</span>
            <span className="text-slate-500 block font-medium">
              {t.reports.docHeaderCurrency} {consolidationCurrency}
            </span>
            <span className="text-slate-400 block text-[10px] mt-1 font-mono">
              {t.reports.docHeaderIssued}
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {t.reports.sec1Title}
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {locale === "en" ? (
              <>
                The group <strong>{group.name}</strong> delivered robust consolidated performance with net consolidated revenue reaching{" "}
                <strong>{formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}</strong>, up 8.4% compared to prior fiscal year. Consolidated EBITDA reached{" "}
                <strong>{formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}</strong> (representing a {consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% margin). Aggregate cash holdings stand at{" "}
                <strong>{formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}</strong>, of which{" "}
                <strong>{formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}</strong> represents unrestricted deployable liquidity after deducting operational covenants and ring-fenced escrow funds. The primary area of heightened vigilance remains{" "}
                <strong>Entity Beta</strong>, where extended receivable collection cycles (DSO 88 days) risk creating liquidity pressure within a 4-week window.
              </>
            ) : (
              <>
                Le groupe <strong>{group.name}</strong> enregistre une progression satisfaisante de son activité avec un chiffre d&apos;affaires consolidé de{" "}
                <strong>{formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}</strong>, en hausse de 8.4% par rapport à l&apos;exercice N-1. L&apos;EBITDA consolidé s&apos;établit à{" "}
                <strong>{formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}</strong> (soit {consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% de marge). La trésorerie totale s&apos;élève à{" "}
                <strong>{formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}</strong>, dont{" "}
                <strong>{formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}</strong> de liquidité mobilisable après préservation des réserves minimales. Le point de vigilance critique réside dans l&apos;entité{" "}
                <strong>Entity Beta</strong>, dont le retard de recouvrement (DSO 88 jours) risque d&apos;engendrer une tension de liquidité sous 4 semaines.
              </>
            )}
          </p>
        </div>

        {/* Section 2: Group KPIs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {t.reports.sec2Title}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.dashboard.kpiRevenue}
              </span>
              <span className="text-base font-black text-slate-900 block mt-1 font-tabular">
                {formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.dashboard.kpiEbitda}
              </span>
              <span className="text-base font-black text-emerald-700 block mt-1 font-tabular">
                {formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.dashboard.kpiCashDeployable}
              </span>
              <span className="text-base font-black text-blue-700 block mt-1 font-tabular">
                {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                {t.dashboard.kpiNetDebt}
              </span>
              <span className="text-base font-black text-slate-900 block mt-1 font-tabular">
                {formatMoney(consolidatedSummary.consolidatedNetDebt)} {consolidationCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Performance by Entity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {t.reports.sec3Title}
            </h2>
          </div>
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2.5 text-left">{t.reports.colEntity}</th>
                <th className="p-2.5 text-left">{t.reports.colTypeCountry}</th>
                <th className="p-2.5 text-right">{t.reports.colRevenue}</th>
                <th className="p-2.5 text-right">{t.reports.colEbitda}</th>
                <th className="p-2.5 text-right">{t.reports.colCash}</th>
                <th className="p-2.5 text-center">{t.reports.colDso}</th>
                <th className="p-2.5 text-center">{t.reports.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entities.map((e) => (
                <tr key={e.id}>
                  <td className="p-2.5 font-extrabold text-slate-900">{e.name}</td>
                  <td className="p-2.5 text-slate-500 capitalize">{e.type.replace("_", " ")} ({e.country})</td>
                  <td className="p-2.5 text-right font-mono font-tabular">{formatMoney(e.financials.revenue)}</td>
                  <td className="p-2.5 text-right font-mono font-semibold font-tabular">{formatMoney(e.financials.ebitda)}</td>
                  <td className="p-2.5 text-right font-mono text-emerald-700 font-bold font-tabular">{formatMoney(e.financials.cash)}</td>
                  <td className="p-2.5 text-center font-mono font-tabular">{e.financials.dso > 0 ? `${e.financials.dso}d` : "—"}</td>
                  <td className="p-2.5 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {e.operationalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4 & 5: Consolidated P&L and Cash */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1.5">
              {t.reports.sec4Title}
            </h3>
            <div className="divide-y divide-slate-200 space-y-1">
              <div className="flex justify-between pt-1">
                <span>{t.reports.pnlGross}</span>
                <span className="font-mono font-tabular">{formatMoney(consolidatedSummary.grossRevenueAggregated)} {consolidationCurrency}</span>
              </div>
              <div className="flex justify-between pt-1 text-rose-600 font-semibold">
                <span>{t.reports.pnlElim}</span>
                <span className="font-mono font-tabular">-{formatMoney(consolidatedSummary.eliminatedInternalRevenue)} {consolidationCurrency}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900">
                <span>{t.reports.pnlConsolidated}</span>
                <span className="font-mono font-tabular">{formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-700">
                <span>{t.reports.pnlEbitda}</span>
                <span className="font-mono font-tabular">{formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1.5">
              {t.reports.sec5Title}
            </h3>
            <div className="divide-y divide-slate-200 space-y-1">
              <div className="flex justify-between pt-1">
                <span>{t.reports.cashGross}</span>
                <span className="font-mono font-tabular">{formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}</span>
              </div>
              <div className="flex justify-between pt-1 text-amber-700">
                <span>{t.reports.cashOperational}</span>
                <span className="font-mono font-tabular">-{formatMoney(consolidatedSummary.totalOperationalMinimum)} {consolidationCurrency}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-700">
                <span>{t.reports.cashDeployable}</span>
                <span className="font-mono font-tabular">{formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 12 & 13: Risks and Recommended Actions */}
        <div className="space-y-4 pt-4 border-t border-slate-200 text-xs">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>{t.reports.sec12Title}</span>
            </h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-amber-900 text-[11px] leading-relaxed">
              {locale === "en" ? (
                <>
                  <li><strong>Subsidiary liquidity risk (Beta):</strong> High DSO (88 days) and 6.4M in overdue accounts receivable creating technical cash strain in weeks 4 to 6.</li>
                  <li><strong>Unreconciled intercompany gap:</strong> 20,000 {consolidationCurrency} timing discrepancy between Alpha and Beta requiring accounting arbitration.</li>
                  <li><strong>CAPEX cash commitment (Gamma):</strong> 900,000 {consolidationCurrency} robotics milestone payment due within 30 days under BCP financing facility.</li>
                </>
              ) : (
                <>
                  <li><strong>Risque de liquidité filiale (Beta) :</strong> DSO à 88 jours et 6,4M {consolidationCurrency} de créances créant une rupture de cash en semaine 4-6.</li>
                  <li><strong>Écart intercompany non rapproché :</strong> 20 000 {consolidationCurrency} en litige entre Alpha et Beta à régulariser.</li>
                  <li><strong>Pression CAPEX (Gamma) :</strong> Décaissement robotique de 900 000 {consolidationCurrency} sous 30 jours à sécuriser avec la BCP.</li>
                </>
              )}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t.reports.sec13Title}</span>
            </h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-emerald-900 text-[11px] leading-relaxed">
              {locale === "en" ? (
                <>
                  <li>Execute urgent collection plan targeting top 5 debtor accounts of Entity Beta to recover 1.5M {consolidationCurrency} within 15 days.</li>
                  <li>Arbitrate the 20,000 {consolidationCurrency} intercompany timing difference via headquarters management fee credit note.</li>
                  <li>Prepare 500,000 {consolidationCurrency} shareholder bridge advance from parent Holding if subsidiary collections experience slippage.</li>
                </>
              ) : (
                <>
                  <li>Lancer un plan de relance d&apos;urgence sur les 5 plus gros débiteurs de l&apos;entité Beta pour récupérer 1,5M {consolidationCurrency} sous 15 jours.</li>
                  <li>Arbitrer l&apos;écart intercompany de 20 000 {consolidationCurrency} par l&apos;émission d&apos;un avoir ou une prise en charge en frais de siège.</li>
                  <li>Activer un prêt d&apos;actionnaire relais de 500 000 {consolidationCurrency} depuis la Holding vers Beta si les encaissements tardent.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
          {t.reports.disclaimer}
        </div>
      </div>
    </AppShell>
  );
}
