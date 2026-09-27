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
import { DEMO_CAPEX_ITEMS } from "@/lib/group/demo-data";
import {
  Hammer,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function GroupCapexPage() {
  const { entities, consolidationCurrency } = useGroup();
  const [items] = React.useState(DEMO_CAPEX_ITEMS);
  const [timeFilter, setTimeFilter] = React.useState<"all" | "30d" | "90d" | "12m">("all");

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  const totalBudget = items.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalCommitted = items.reduce((sum, item) => sum + item.committedAmount, 0);
  const totalSpent = items.reduce((sum, item) => sum + item.spentAmount, 0);
  const totalRemaining = items.reduce((sum, item) => sum + item.remainingAmount, 0);

  // Filter items based on expected payment date
  const filteredItems = React.useMemo(() => {
    if (timeFilter === "30d") {
      return items.filter((i) => i.expectedPaymentDate <= "2026-10-31");
    }
    if (timeFilter === "90d") {
      return items.filter((i) => i.expectedPaymentDate <= "2026-12-31");
    }
    return items;
  }, [items, timeFilter]);

  return (
    <AppShell
      title="CAPEX Pipeline & Investissements Groupe"
      subtitle={`Suivi des engagements de capital, décaissements prévisionnels et sources de financement • Devise : ${consolidationCurrency}`}
    >
      {/* Top 4 CAPEX KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Budget CAPEX Global"
          value={`${formatMoney(totalBudget)} ${consolidationCurrency}`}
          badge="Enveloppe"
          badgeVariant="blue"
          description="Investissements validés au plan"
          icon={<Hammer className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="CAPEX Engagé Ferme"
          value={`${formatMoney(totalCommitted)} ${consolidationCurrency}`}
          badge={`${((totalCommitted / totalBudget) * 100).toFixed(0)}% du budget`}
          badgeVariant="green"
          description="Contrats signés avec fournisseurs"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Décaissements Réalisés"
          value={`${formatMoney(totalSpent)} ${consolidationCurrency}`}
          badge="Payé"
          badgeVariant="slate"
          description="Règlements déjà passés en banque"
          icon={<Clock className="w-4 h-4 text-slate-600" />}
        />

        <KPICard
          title="Reste à Décaisser"
          value={`${formatMoney(totalRemaining)} ${consolidationCurrency}`}
          badge="Tension Cash"
          badgeVariant="amber"
          description="Pression sur la trésorerie à venir"
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/90 w-fit">
        <button
          onClick={() => setTimeFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            timeFilter === "all" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tous les projets
        </button>
        <button
          onClick={() => setTimeFilter("30d")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            timeFilter === "30d" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Échéance sous 30 jours
        </button>
        <button
          onClick={() => setTimeFilter("90d")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            timeFilter === "90d" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Pipeline sous 90 jours
        </button>
      </div>

      {/* CAPEX Table */}
      <Card
        title="Projets d'Investissement & Engagements Fournisseurs"
        subtitle="Détail des lignes d'investissement par filiale et échéance de règlement"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projet d&apos;Investissement</TableHead>
                <TableHead>Entité Responsable</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Fournisseur Titulaire</TableHead>
                <TableHead align="right">Budget</TableHead>
                <TableHead align="right">Engagé</TableHead>
                <TableHead align="right">Payé</TableHead>
                <TableHead align="right">Reste à Décaisser</TableHead>
                <TableHead align="center">Échéance Paiement</TableHead>
                <TableHead align="center">Source Financement</TableHead>
                <TableHead align="center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-800">
                    {getEntityName(item.entityId)}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" size="sm" className="capitalize">
                      {item.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-700 font-medium">
                    {item.supplier}
                  </TableCell>

                  <TableCell align="right" className="font-mono text-slate-700">
                    {formatMoney(item.budgetAmount)} MAD
                  </TableCell>

                  <TableCell align="right" className="font-mono font-semibold text-slate-900">
                    {formatMoney(item.committedAmount)} MAD
                  </TableCell>

                  <TableCell align="right" className="font-mono text-slate-600">
                    {formatMoney(item.spentAmount)} MAD
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-amber-700">
                    {formatMoney(item.remainingAmount)} MAD
                  </TableCell>

                  <TableCell align="center" className="text-xs font-mono text-slate-600">
                    {item.expectedPaymentDate}
                  </TableCell>

                  <TableCell align="center">
                    <Badge variant="slate" size="sm">
                      {item.fundingSource.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell align="center">
                    <Badge variant="green" size="sm" dot>
                      {item.status}
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
