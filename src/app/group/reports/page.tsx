"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useGroup } from "@/lib/group/GroupContext";
import {
  Printer,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function GroupReportsPage() {
  const {
    group,
    entities,
    consolidationCurrency,
    consolidatedSummary,
  } = useGroup();

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell
      title="Rapports Financiers Consolidés du Groupe"
      subtitle={`Rapport de gestion institutionnel multi-entités • Devise : ${consolidationCurrency}`}
    >
      {/* Top Action Bar (hidden when printing) */}
      <div className="print:hidden p-4 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Rapport de Gestion Consolidé T3 2026
            </h2>
            <p className="text-xs text-slate-500">
              Document officiel pour Conseil d&apos;Administration, investisseurs et banques
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
            Imprimer / Exporter PDF
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Télécharger le Rapport
          </Button>
        </div>
      </div>

      {/* Official 13-Section Management Report Document */}
      <div className="p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 shadow-elevated text-slate-800 space-y-10 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
              Fynavo FinanceOS • Consolidation de Gestion
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Rapport Financier Consolidé du Groupe
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {group.name} ({group.code}) — Périmètre Multi-Filiales & SPVs
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">Période : T3 2026</span>
            <span className="text-slate-500 block">Devise : {consolidationCurrency}</span>
            <span className="text-slate-400 block text-[10px] mt-1">Date d&apos;émission : 27/09/2026</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h2 className="text-base font-extrabold text-slate-900">Executive Summary & Synthèse DAF</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Le groupe <strong>{group.name}</strong> enregistre une progression satisfaisante de son activité avec un chiffre d&apos;affaires consolidé de <strong>{formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}</strong>, en hausse de 8.4% par rapport à l&apos;exercice N-1. L&apos;EBITDA consolidé s&apos;établit à <strong>{formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}</strong> (soit {consolidatedSummary.consolidatedEbitdaMarginPct.toFixed(1)}% de marge). La trésorerie totale s&apos;élève à <strong>{formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}</strong>, dont <strong>{formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}</strong> de liquidité mobilisable après préservation des réserves minimales. Le point de vigilance critique réside dans l&apos;entité <strong>Entity Beta</strong>, dont le retard de recouvrement (DSO 88 jours) risque d&apos;engendrer une tension de liquidité sous 4 semaines.
          </p>
        </div>

        {/* Section 2: Group KPIs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">2</span>
            <h2 className="text-base font-extrabold text-slate-900">Indicateurs Consolidés Clés (Group KPIs)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">CA Consolidé</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                {formatMoney(consolidatedSummary.consolidatedRevenue)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">EBITDA Consolidé</span>
              <span className="text-base font-extrabold text-emerald-700 block mt-0.5">
                {formatMoney(consolidatedSummary.consolidatedEbitda)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Cash Mobilisable</span>
              <span className="text-base font-extrabold text-blue-700 block mt-0.5">
                {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Dette Nette</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                {formatMoney(consolidatedSummary.consolidatedNetDebt)} {consolidationCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Performance by Entity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">3</span>
            <h2 className="text-base font-extrabold text-slate-900">Performance Détaillée par Filiale</h2>
          </div>
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 font-bold">
              <tr>
                <th className="p-2.5 text-left">Entité</th>
                <th className="p-2.5 text-left">Type & Pays</th>
                <th className="p-2.5 text-right">CA</th>
                <th className="p-2.5 text-right">EBITDA</th>
                <th className="p-2.5 text-right">Trésorerie</th>
                <th className="p-2.5 text-center">DSO</th>
                <th className="p-2.5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entities.map((e) => (
                <tr key={e.id}>
                  <td className="p-2.5 font-bold">{e.name}</td>
                  <td className="p-2.5 text-slate-500 capitalize">{e.type.replace("_", " ")} ({e.country})</td>
                  <td className="p-2.5 text-right font-mono">{formatMoney(e.financials.revenue)}</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{formatMoney(e.financials.ebitda)}</td>
                  <td className="p-2.5 text-right font-mono text-emerald-700">{formatMoney(e.financials.cash)}</td>
                  <td className="p-2.5 text-center font-mono">{e.financials.dso > 0 ? `${e.financials.dso}j` : "—"}</td>
                  <td className="p-2.5 text-center">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100">
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
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 border-b pb-1">4. Compte de Résultat Consolidé (P&L)</h3>
            <div className="divide-y divide-slate-200 space-y-1">
              <div className="flex justify-between pt-1">
                <span>Chiffre d&apos;Affaires Brut Agrégé</span>
                <span className="font-mono">{formatMoney(consolidatedSummary.grossRevenueAggregated)} MAD</span>
              </div>
              <div className="flex justify-between pt-1 text-rose-600 font-semibold">
                <span>Moins : Élimination flux internes</span>
                <span className="font-mono">-{formatMoney(consolidatedSummary.eliminatedInternalRevenue)} MAD</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900">
                <span>= Chiffre d&apos;Affaires Consolidé</span>
                <span className="font-mono">{formatMoney(consolidatedSummary.consolidatedRevenue)} MAD</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-700">
                <span>= EBITDA Consolidé</span>
                <span className="font-mono">{formatMoney(consolidatedSummary.consolidatedEbitda)} MAD</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 border-b pb-1">5. Trésorerie & Réserves</h3>
            <div className="divide-y divide-slate-200 space-y-1">
              <div className="flex justify-between pt-1">
                <span>Trésorerie Brute en Banque</span>
                <span className="font-mono">{formatMoney(consolidatedSummary.totalGroupCash)} MAD</span>
              </div>
              <div className="flex justify-between pt-1 text-amber-700">
                <span>Moins : Minimum opérationnel sécurité</span>
                <span className="font-mono">-{formatMoney(consolidatedSummary.totalOperationalMinimum)} MAD</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-700">
                <span>= Trésorerie Réellement Mobilisable</span>
                <span className="font-mono">{formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} MAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 12 & 13: Risks and Recommended Actions */}
        <div className="space-y-4 pt-4 border-t border-slate-200 text-xs">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>12. Principaux Risques Financiers Identifiés</span>
            </h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-amber-900 text-[11px]">
              <li><strong>Risque de liquidité filiale (Beta) :</strong> DSO à 88 jours et 6,4M MAD de créances créant une rupture de cash en semaine 4-6.</li>
              <li><strong>Écart intercompany non rapproché :</strong> 20 000 MAD en litige entre Alpha et Beta à régulariser.</li>
              <li><strong>Pression CAPEX (Gamma) :</strong> Décaissement robotique de 900 000 MAD sous 30 jours à sécuriser avec la BCP.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>13. Actions Recommandées par la Direction Financière</span>
            </h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-emerald-900 text-[11px]">
              <li>Lancer un plan de relance d&apos;urgence sur les 5 plus gros débiteurs de l&apos;entité Beta pour récupérer 1,5M MAD sous 15 jours.</li>
              <li>Arbitrer l&apos;écart intercompany de 20 000 MAD par l&apos;émission d&apos;un avoir ou une prise en charge en frais de siège.</li>
              <li>Activer un prêt d&apos;actionnaire relais de 500 000 MAD depuis la Holding vers Beta si les encaissements tardent.</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          Ce rapport est un outil de gestion et de pilotage financier interne (Consolidation de gestion). Il ne remplace pas les états financiers de consolidation statutaire audités selon les normes IFRS.
        </div>
      </div>
    </AppShell>
  );
}
