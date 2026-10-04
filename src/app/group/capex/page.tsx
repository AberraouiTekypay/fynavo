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
import { DEMO_CAPEX_ITEMS } from "@/lib/group/demo-data";
import {
  Hammer,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function GroupCapexPage() {
  const { entities, consolidationCurrency } = useGroup();
  const { t, locale, formatMoney } = useLanguage();

  const [items] = React.useState(DEMO_CAPEX_ITEMS);
  const [timeFilter, setTimeFilter] = React.useState<"all" | "30d" | "90d" | "12m">("all");

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
      title={t.nav.capexPipeline}
      subtitle={locale === "en" ? `Capital expenditure pipeline, committed disbursements, and funding sources • Currency: ${consolidationCurrency}` : `Suivi des engagements de capital, décaissements prévisionnels et sources de financement • Devise : ${consolidationCurrency}`}
    >
      {/* Top 4 CAPEX KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={locale === "en" ? "Overall CAPEX Envelope" : "Budget CAPEX Global"}
          value={formatMoney(totalBudget, consolidationCurrency)}
          badge={locale === "en" ? "Approved Budget" : "Enveloppe"}
          badgeVariant="blue"
          description={locale === "en" ? "Total capex validated for fiscal plan" : "Investissements validés au plan"}
          icon={<Hammer className="w-4 h-4 text-blue-600" />}
          sparklineData={[70, 75, 80, 85, 90, 92, 95]}
        />

        <KPICard
          title={locale === "en" ? "Firm Committed CAPEX" : "CAPEX Engagé Ferme"}
          value={formatMoney(totalCommitted, consolidationCurrency)}
          badge={`${((totalCommitted / totalBudget) * 100).toFixed(0)}% budget`}
          badgeVariant="green"
          description={locale === "en" ? "Signed contracts with contractors" : "Contrats signés avec fournisseurs"}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          sparklineData={[50, 55, 60, 65, 70, 72, 75]}
        />

        <KPICard
          title={locale === "en" ? "Paid Out to Date" : "Décaissements Réalisés"}
          value={formatMoney(totalSpent, consolidationCurrency)}
          badge={locale === "en" ? "Settled" : "Payé"}
          badgeVariant="slate"
          description={locale === "en" ? "Processed bank disbursements" : "Règlements déjà passés en banque"}
          icon={<Clock className="w-4 h-4 text-slate-600" />}
          sparklineData={[15, 20, 25, 28, 30, 32, 34]}
        />

        <KPICard
          title={locale === "en" ? "Remaining Cash Outflow" : "Reste à Décaisser"}
          value={formatMoney(totalRemaining, consolidationCurrency)}
          badge={locale === "en" ? "Cash Impact" : "Tension Cash"}
          badgeVariant="amber"
          description={locale === "en" ? "Upcoming 12-month liquidity requirement" : "Pression sur la trésorerie à venir"}
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
          sparklineData={[45, 43, 40, 38, 35, 33, 30]}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-fit text-xs font-semibold">
        <button
          onClick={() => setTimeFilter("all")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            timeFilter === "all" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {locale === "en" ? "All Projects" : "Tous les projets"}
        </button>
        <button
          onClick={() => setTimeFilter("30d")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            timeFilter === "30d" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {locale === "en" ? "Due in 30 Days" : "Échéance sous 30 jours"}
        </button>
        <button
          onClick={() => setTimeFilter("90d")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            timeFilter === "90d" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {locale === "en" ? "90-Day Pipeline" : "Pipeline sous 90 jours"}
        </button>
      </div>

      {/* CAPEX Table */}
      <Card
        title={locale === "en" ? "Investment Projects & Contractor Commitments" : "Projets d'Investissement & Engagements Fournisseurs"}
        subtitle={locale === "en" ? "Granular lines by legal entity and projected payment milestones" : "Détail des lignes d'investissement par filiale et échéance de règlement"}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "en" ? "Project Name" : "Projet d'Investissement"}</TableHead>
                <TableHead>{locale === "en" ? "Responsible Entity" : "Entité Responsable"}</TableHead>
                <TableHead>{locale === "en" ? "Category" : "Catégorie"}</TableHead>
                <TableHead>{locale === "en" ? "Supplier / Contractor" : "Fournisseur Titulaire"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Budget" : "Budget"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Committed" : "Engagé"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Paid" : "Payé"}</TableHead>
                <TableHead align="right">{locale === "en" ? "Remaining" : "Reste à Décaisser"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Expected Date" : "Échéance Paiement"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Funding Source" : "Source Financement"}</TableHead>
                <TableHead align="center">{locale === "en" ? "Status" : "Statut"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
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

                  <TableCell align="right" className="font-mono text-slate-700 font-tabular">
                    {formatMoney(item.budgetAmount, "MAD")}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                    {formatMoney(item.committedAmount, "MAD")}
                  </TableCell>

                  <TableCell align="right" className="font-mono text-slate-600 font-tabular">
                    {formatMoney(item.spentAmount, "MAD")}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-amber-700 font-tabular">
                    {formatMoney(item.remainingAmount, "MAD")}
                  </TableCell>

                  <TableCell align="center" className="text-xs font-mono text-slate-600 font-tabular">
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
