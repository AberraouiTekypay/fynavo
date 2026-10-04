"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
  DEMO_DEBT_FACILITIES,
  DEMO_SHAREHOLDERS,
} from "@/lib/group/demo-data";
import {
  Landmark,
  ShieldAlert,
  Calendar,
  TrendingDown,
} from "lucide-react";

export default function GroupDebtPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

  const [facilities] = React.useState(DEMO_DEBT_FACILITIES);
  const [shareholders] = React.useState(DEMO_SHAREHOLDERS);

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  return (
    <AppShell
      title={t.nav.debtCapital}
      subtitle={locale === "en" ? `Consolidated bank facilities, maturity schedules, debt covenants, and shareholder loan accounts • Currency: ${consolidationCurrency}` : `Endettement bancaire consolidé, échéanciers, covenants et comptes courants d'associés • Devise : ${consolidationCurrency}`}
    >
      {/* Top Debt Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={locale === "en" ? "Consolidated Gross Debt" : "Dette Financière Brute Consolidée"}
          value={formatMoney(consolidatedSummary.consolidatedGrossDebt, consolidationCurrency)}
          badge={locale === "en" ? "Third-Party Senior" : "Externe tiers"}
          badgeVariant="blue"
          description={locale === "en" ? "Intra-group loan neutralized (-1.5M)" : "Neutralisation des prêts intra-groupe (-1,5M)"}
          icon={<Landmark className="w-4 h-4 text-blue-600" />}
          sparklineData={[28, 27, 26, 25, 24, 23, 23]}
        />

        <KPICard
          title={t.dashboard.kpiNetDebt}
          value={formatMoney(consolidatedSummary.consolidatedNetDebt, consolidationCurrency)}
          badge="Debt - Cash"
          badgeVariant="slate"
          description={locale === "en" ? `Gross cash deducted (${formatMoney(consolidatedSummary.totalGroupCash)})` : `Trésorerie déduite (${formatMoney(consolidatedSummary.totalGroupCash)})`}
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
          sparklineData={[20, 19, 18, 17, 16, 15, 14]}
        />

        <KPICard
          title={locale === "en" ? "Net Debt / EBITDA Leverage" : "Ratio Levier Dette / EBITDA"}
          value={`${consolidatedSummary.debtToEbitdaRatio.toFixed(2)}x`}
          badge={consolidatedSummary.debtToEbitdaRatio > 3 ? (locale === "en" ? "Watch 3.0x" : "Alerte 3.0x") : (locale === "en" ? "Compliant" : "Maîtrisé")}
          badgeVariant={consolidatedSummary.debtToEbitdaRatio > 3 ? "warning" : "green"}
          description={locale === "en" ? "Average bank covenant ceiling: < 4.0x" : "Covenant bancaire moyen : < 4.0x"}
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
          sparklineData={[3.4, 3.2, 3.1, 2.9, 2.8, 2.7, 2.65]}
        />

        <KPICard
          title={locale === "en" ? "Annual Debt Service" : "Service Annuel de la Dette"}
          value="1 842 500 MAD"
          badge={locale === "en" ? "Principal + Interest" : "Principal + Intérêts"}
          badgeVariant="slate"
          description={locale === "en" ? "Impact on Free Cash Flow" : "Poids sur le cash flow libre"}
          icon={<Calendar className="w-4 h-4 text-indigo-600" />}
          sparklineData={[180, 182, 183, 184, 184, 185]}
        />
      </div>

      {/* Facilities Table */}
      <Card
        title={locale === "en" ? "Financing Facilities & Bank Credit Lines by Entity" : "Lignes de Financement & Concours Bancaires par Entité"}
        subtitle={locale === "en" ? "Inventory of bank loans, equipment leasing, overdraft lines, and shareholder advances" : "Inventaire des emprunts bancaires, leasings, facilités de caisse et dettes d'actionnaires"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "en" ? "Borrower Entity" : "Entité Emprunteuse"}</TableHead>
                <TableHead>{locale === "en" ? "Lending Institution" : "Établissement Prêteur"}</TableHead>
                <TableHead>{locale === "en" ? "Facility Type" : "Type de Concours"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Initial Principal" : "Montant Initial"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Outstanding Balance" : "Encours Restant Dû"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Rate (%)" : "Taux (%)"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Maturity Date" : "Échéance Finale"}</TableHead>
                <TableHead>{locale === "en" ? "Covenants & Constraints" : "Covenants & Ratios"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Status" : "Statut"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((fac) => {
                const isIntercompany = fac.facilityType === "shareholder_loan";
                const isCovenantAtRisk = fac.covenantDescription.includes("Non respecté") || fac.covenantDescription.includes("Surveillance");

                return (
                  <TableRow key={fac.id} className={isIntercompany ? "bg-blue-50/40" : ""}>
                    <TableCell>
                      <span className="font-bold text-slate-900 block">
                        {getEntityName(fac.entityId)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {locale === "en" ? "Security: " : "Garantie : "}{fac.collateralNotes}
                      </span>
                    </TableCell>

                    <TableCell className="font-semibold text-slate-800">
                      {fac.lenderName}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" size="sm">
                        {fac.facilityType.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-500 font-tabular">
                      {formatMoney(fac.originalAmount)} {fac.currency}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                      {formatMoney(fac.outstandingAmount)} {fac.currency}
                    </TableCell>

                    <TableCell align="center" className="font-mono text-xs font-tabular">
                      {fac.interestRatePct.toFixed(2)}%
                    </TableCell>

                    <TableCell align="center" className="text-xs text-slate-600 font-mono font-tabular">
                      {fac.maturityDate}
                    </TableCell>

                    <TableCell className="max-w-xs">
                      <span
                        className={`text-xs block ${
                          isCovenantAtRisk ? "text-amber-800 font-medium" : "text-slate-600"
                        }`}
                      >
                        {fac.covenantDescription}
                      </span>
                    </TableCell>

                    <TableCell align="center">
                      {isIntercompany ? (
                        <Badge variant="blue" size="sm">
                          {locale === "en" ? "Intra-Group (Eliminated)" : "Intra-groupe (Éliminé)"}
                        </Badge>
                      ) : isCovenantAtRisk ? (
                        <Badge variant="amber" size="sm" dot>
                          {locale === "en" ? "Under Watch" : "Sous surveillance"}
                        </Badge>
                      ) : (
                        <Badge variant="green" size="sm" dot>
                          {locale === "en" ? "Compliant" : "Conforme"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Capital Structure & Shareholder Accounts */}
      <Card
        title={locale === "en" ? "Capital Structure & Shareholder Current Accounts" : "Structure du Capital & Comptes Courants d'Associés"}
        subtitle={locale === "en" ? "Paid-in equity capital, shareholding distribution, and shareholder loan advances" : "Capital social libéré, actionnariat et avances en compte courant par entité"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.common.entity}</TableHead>
                <TableHead>{locale === "en" ? "Shareholder / Investor" : "Actionnaire / Investisseur"}</TableHead>
                <TableHead>{locale === "en" ? "Classification" : "Typologie"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Stake (%)" : "Quote-part (%)"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Contributed Equity" : "Capital Social Apporté"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Current Account Balance (CCA)" : "Solde Compte Courant (CCA)"}</TableHead>
                <TableHead align="center">{locale === "en" ? "CCA Yield Rate" : "Rémunération CCA"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shareholders.map((sh) => (
                <TableRow key={sh.id}>
                  <TableCell className="font-bold text-slate-900">
                    {getEntityName(sh.entityId)}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {sh.shareholderName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="slate" size="sm">
                      {sh.shareholderType}
                    </Badge>
                  </TableCell>
                  <TableCell align="center" className="font-mono font-bold text-blue-600 font-tabular">
                    {sh.ownershipPct}%
                  </TableCell>
                  <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                    {formatMoney(sh.shareCapitalAmount, "MAD")}
                  </TableCell>
                  <TableCell align="right" className="font-mono font-bold text-emerald-700 font-tabular">
                    {sh.currentAccountBalance > 0 ? formatMoney(sh.currentAccountBalance, "MAD") : "—"}
                  </TableCell>
                  <TableCell align="center" className="text-xs text-slate-500 font-tabular">
                    {sh.currentAccountBalance > 0 ? (locale === "en" ? "3.25% (Regulated)" : "3.25% (Réglementé)") : "—"}
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
