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

  const [facilities] = React.useState(DEMO_DEBT_FACILITIES);
  const [shareholders] = React.useState(DEMO_SHAREHOLDERS);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  return (
    <AppShell
      title="Dette Financière & Structure du Capital"
      subtitle={`Endettement bancaire consolidé, échéanciers, covenants et comptes courants d'associés • Devise : ${consolidationCurrency}`}
    >
      {/* Top Debt Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Dette Financière Brute Consolidée"
          value={`${formatMoney(consolidatedSummary.consolidatedGrossDebt)} ${consolidationCurrency}`}
          badge="Externe tiers"
          badgeVariant="blue"
          description="Neutralisation des prêts intra-groupe (-1,5M)"
          icon={<Landmark className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="Dette Nette Consolidée"
          value={`${formatMoney(consolidatedSummary.consolidatedNetDebt)} ${consolidationCurrency}`}
          badge="Dette - Cash"
          badgeVariant="slate"
          description={`Trésorerie déduite (${formatMoney(consolidatedSummary.totalGroupCash)})`}
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Ratio Levier Dette / EBITDA"
          value={`${consolidatedSummary.debtToEbitdaRatio.toFixed(2)}x`}
          badge={consolidatedSummary.debtToEbitdaRatio > 3 ? "Alerte 3.0x" : "Maîtrisé"}
          badgeVariant={consolidatedSummary.debtToEbitdaRatio > 3 ? "warning" : "green"}
          description="Covenant bancaire moyen : < 4.0x"
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title="Service Annuel de la Dette"
          value="1 842 500 MAD"
          badge="Principal + Intérêts"
          badgeVariant="slate"
          description="Poids sur le cash flow libre"
          icon={<Calendar className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Facilities Table */}
      <Card
        title="Lignes de Financement & Concours Bancaires par Entité"
        subtitle="Inventaire des emprunts bancaires, leasings, facilités de caisse et dettes d'actionnaires"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité Emprunteuse</TableHead>
                <TableHead>Établissement Prêteur</TableHead>
                <TableHead>Type de Concours</TableHead>
                <TableHead align="right">Montant Initial</TableHead>
                <TableHead align="right">Encours Restant Dû</TableHead>
                <TableHead align="center">Taux (%)</TableHead>
                <TableHead align="center">Échéance Finale</TableHead>
                <TableHead>Covenants & Ratios</TableHead>
                <TableHead align="center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((fac) => {
                const isIntercompany = fac.facilityType === "shareholder_loan";
                const isCovenantAtRisk = fac.covenantDescription.includes("Non respecté") || fac.covenantDescription.includes("Surveillance");

                return (
                  <TableRow key={fac.id} className={isIntercompany ? "bg-blue-50/30" : ""}>
                    <TableCell>
                      <span className="font-bold text-slate-900 block">
                        {getEntityName(fac.entityId)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Garantie: {fac.collateralNotes}
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

                    <TableCell align="right" className="font-mono text-slate-500">
                      {formatMoney(fac.originalAmount)} {fac.currency}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold text-slate-900">
                      {formatMoney(fac.outstandingAmount)} {fac.currency}
                    </TableCell>

                    <TableCell align="center" className="font-mono text-xs">
                      {fac.interestRatePct.toFixed(2)}%
                    </TableCell>

                    <TableCell align="center" className="text-xs text-slate-600 font-mono">
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
                          Intra-groupe (Éliminé)
                        </Badge>
                      ) : isCovenantAtRisk ? (
                        <Badge variant="amber" size="sm" dot>
                          Sous surveillance
                        </Badge>
                      ) : (
                        <Badge variant="green" size="sm" dot>
                          Conforme
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
        title="Structure du Capital & Comptes Courants d'Associés"
        subtitle="Capital social libéré, actionnariat et avances en compte courant par entité"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité</TableHead>
                <TableHead>Actionnaire / Investisseur</TableHead>
                <TableHead>Typologie</TableHead>
                <TableHead align="center">Quote-part (%)</TableHead>
                <TableHead align="right">Capital Social Apporté</TableHead>
                <TableHead align="right">Solde Compte Courant (CCA)</TableHead>
                <TableHead align="center">Rémunération CCA</TableHead>
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
                  <TableCell align="center" className="font-mono font-bold text-blue-600">
                    {sh.ownershipPct}%
                  </TableCell>
                  <TableCell align="right" className="font-mono font-bold text-slate-900">
                    {formatMoney(sh.shareCapitalAmount)} MAD
                  </TableCell>
                  <TableCell align="right" className="font-mono font-bold text-emerald-700">
                    {sh.currentAccountBalance > 0 ? `${formatMoney(sh.currentAccountBalance)} MAD` : "—"}
                  </TableCell>
                  <TableCell align="center" className="text-xs text-slate-500">
                    {sh.currentAccountBalance > 0 ? "3.25% (Réglementé)" : "—"}
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
