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

  const [allocations] = React.useState(DEMO_COST_ALLOCATIONS);
  const [feeRules] = React.useState(DEMO_MANAGEMENT_FEE_RULES);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  return (
    <AppShell
      title="Allocations de Coûts Centraux & Management Fees"
      subtitle={`Règles de répartition des frais de siège et conventions d'honoraires de gestion • Devise : ${consolidationCurrency}`}
    >
      {/* Top Advisory Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Couche de Gestion Extra-Comptable Auditable
              </h2>
              <Badge variant="blue" size="sm">Règles Actives</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Les allocations de charges de siège constituent une couche analytique de gestion : les écritures comptables d&apos;origine des entités restent strictement intactes. Les règles sont auditables et conformes aux préconisations fiscales sur les prix de transfert.
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Nouvelle règle d&apos;allocation
        </Button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Pool de Frais Centraux Réparti"
          value="890 000 MAD / an"
          badge="Direction & IT"
          badgeVariant="blue"
          description="Charges de holding mutualisées"
          icon={<Split className="w-4 h-4 text-indigo-600" />}
        />

        <KPICard
          title="Management Fees Facturés"
          value="865 500 MAD / an"
          badge="100% Conventionné"
          badgeVariant="green"
          description="Honoraires d'animation groupe"
          icon={<FileText className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Management Fees Recouvrés"
          value="745 500 MAD"
          badge="86.1% encaissé"
          badgeVariant="warning"
          description="120K MAD en attente sur Beta"
          icon={<Coins className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Shared Costs Allocation Table */}
      <Card
        title="Règles d'Allocation des Coûts Partagés (Cost Pools)"
        subtitle="Répartition des dépenses de siège selon des clés objectives (Chiffre d'affaires, effectifs, quote-part fixe)"
      >
        <div className="space-y-4">
          {allocations.map((rule) => (
            <div key={rule.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{rule.costPoolName}</span>
                  <span className="text-[11px] text-slate-400">
                    Source : {getEntityName(rule.sourceEntityId)} • Méthode : Clé {rule.method.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatMoney(rule.annualPoolAmount)} MAD / an
                  </span>
                  <Badge variant="green" size="sm" className="ml-2">Active</Badge>
                </div>
              </div>

              {/* Split Breakdown Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rule.splits.map((s) => (
                  <div key={s.entityId} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block">{getEntityName(s.entityId)}</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-mono font-bold text-blue-600">{s.percentage}%</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatMoney(s.allocatedAmount)} MAD
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
        title="Conventions de Management Fees Intra-Groupe"
        subtitle="Rémunération de la société mère pour l'animation managériale et la stratégie des filiales"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filiale Redevable</TableHead>
                <TableHead>Base de Calcul</TableHead>
                <TableHead align="center">Taux / Formule</TableHead>
                <TableHead align="right">Montant Facturé Annuel</TableHead>
                <TableHead align="right">Montant Encaissé</TableHead>
                <TableHead align="right">Reste Dû</TableHead>
                <TableHead align="center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-bold text-slate-900">
                    {getEntityName(rule.subsidiaryEntityId)}
                  </TableCell>

                  <TableCell className="capitalize text-slate-700">
                    {rule.calculationBasis.replace("_", " ")}
                  </TableCell>

                  <TableCell align="center" className="font-mono font-semibold text-blue-600">
                    {rule.calculationBasis === "pct_revenue" || rule.calculationBasis === "pct_ebitda"
                      ? `${rule.rateOrAmount}%`
                      : `${formatMoney(rule.rateOrAmount)} MAD / mois`}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-semibold text-slate-900">
                    {formatMoney(rule.annualBilledMAD)} MAD
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-emerald-700">
                    {formatMoney(rule.annualCollectedMAD)} MAD
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold">
                    <span className={rule.outstandingMAD > 0 ? "text-rose-600" : "text-slate-400"}>
                      {formatMoney(rule.outstandingMAD)} MAD
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <Badge variant={rule.outstandingMAD > 0 ? "amber" : "green"} size="sm" dot>
                      {rule.outstandingMAD > 0 ? "Retard de paiement" : "À jour"}
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
