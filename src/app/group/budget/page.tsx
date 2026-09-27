"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KPICard } from "@/components/ui/KPICard";
import { useGroup } from "@/lib/group/GroupContext";
import {
  PieChart,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  budgetMAD: number;
  actualMAD: number;
  entities: {
    entityId: string;
    entityName: string;
    budgetMAD: number;
    actualMAD: number;
  }[];
}

const mockBudgetCategories: BudgetCategory[] = [
  {
    id: "cat_rev",
    name: "Chiffre d'Affaires Brut",
    budgetMAD: 60500000,
    actualMAD: 62050000,
    entities: [
      { entityId: "ent_alpha", entityName: "Entity Alpha", budgetMAD: 27500000, actualMAD: 28500000 },
      { entityId: "ent_beta", entityName: "Entity Beta", budgetMAD: 19000000, actualMAD: 18200000 },
      { entityId: "ent_gamma", entityName: "Entity Gamma", budgetMAD: 14000000, actualMAD: 14100000 },
      { entityId: "ent_holding", entityName: "Atlas Holding", budgetMAD: 1250000, actualMAD: 1250000 },
    ],
  },
  {
    id: "cat_cogs",
    name: "Coût des Marchandises & Matières (COGS)",
    budgetMAD: 31200000,
    actualMAD: 32600000,
    entities: [
      { entityId: "ent_alpha", entityName: "Entity Alpha", budgetMAD: 11000000, actualMAD: 11500000 },
      { entityId: "ent_beta", entityName: "Entity Beta", budgetMAD: 10500000, actualMAD: 11200000 },
      { entityId: "ent_gamma", entityName: "Entity Gamma", budgetMAD: 9700000, actualMAD: 9900000 },
    ],
  },
  {
    id: "cat_payroll",
    name: "Masse Salariale & Charges Sociales",
    budgetMAD: 12400000,
    actualMAD: 12850000,
    entities: [
      { entityId: "ent_alpha", entityName: "Entity Alpha", budgetMAD: 5800000, actualMAD: 6100000 },
      { entityId: "ent_beta", entityName: "Entity Beta", budgetMAD: 3200000, actualMAD: 3400000 },
      { entityId: "ent_gamma", entityName: "Entity Gamma", budgetMAD: 2800000, actualMAD: 2750000 },
      { entityId: "ent_holding", entityName: "Atlas Holding", budgetMAD: 600000, actualMAD: 600000 },
    ],
  },
  {
    id: "cat_opex",
    name: "Autres Charges Externes (OPEX)",
    budgetMAD: 4200000,
    actualMAD: 4700000, // Explicit example from prompt: Budget 4.2M, Actual 4.7M, Variance +500K
    entities: [
      { entityId: "ent_beta", entityName: "Entity Beta", budgetMAD: 1200000, actualMAD: 1550000 }, // Overrun on logistics
      { entityId: "ent_gamma", entityName: "Entity Gamma", budgetMAD: 1400000, actualMAD: 1500000 },
      { entityId: "ent_alpha", entityName: "Entity Alpha", budgetMAD: 1200000, actualMAD: 1250000 },
      { entityId: "ent_holding", entityName: "Atlas Holding", budgetMAD: 400000, actualMAD: 400000 },
    ],
  },
];

export default function GroupBudgetPage() {
  const { consolidationCurrency } = useGroup();
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    cat_opex: true, // Expanded by default to showcase the drilldown!
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AppShell
      title="Budget Consolidé Groupe vs Réalisé"
      subtitle={`Suivi budgétaire consolidé avec forage hiérarchique : Groupe → Entité → Catégorie de charges • Devise : ${consolidationCurrency}`}
    >
      {/* Top 4 Budget KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Chiffre d'Affaires vs Budget"
          value="+1 550 000 MAD"
          badge="+2.5% avance"
          badgeVariant="green"
          description="Traction commerciale Alpha"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Dépassement Charges OPEX"
          value="+500 000 MAD"
          badge="+11.9% dépassement"
          badgeVariant="rose"
          description="Généré à 70% par Entity Beta"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
        />

        <KPICard
          title="Masse Salariale Consolidée"
          value="12 850 000 MAD"
          badge="+3.6% dérive"
          badgeVariant="warning"
          description="Recrutements techniques anticipés"
          icon={<PieChart className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title="Respect Global Enveloppes"
          value="96.2%"
          badge="Conforme"
          badgeVariant="green"
          description="Cohérence budgétaire maintenue"
          icon={<Layers className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Drilldown Table: Group -> Entity -> Category */}
      <Card
        title="Contrôle Budgétaire & Forage par Filiale (Drilldown)"
        subtitle="Cliquez sur une catégorie pour identifier précisément l'entité responsable de l'écart"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-left w-72">Catégorie Budgétaire / Filiale</th>
                <th className="p-3 text-right">Budget Alloué</th>
                <th className="p-3 text-right">Réalisé Constaté</th>
                <th className="p-3 text-right">Écart (MAD)</th>
                <th className="p-3 text-center">Écart (%)</th>
                <th className="p-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBudgetCategories.map((cat) => {
                const isExpanded = expandedCategories[cat.id];
                const varianceMAD = cat.actualMAD - cat.budgetMAD;
                const variancePct = ((varianceMAD / cat.budgetMAD) * 100).toFixed(1);
                const isOverrun = cat.id !== "cat_rev" ? varianceMAD > 0 : varianceMAD < 0;

                return (
                  <React.Fragment key={cat.id}>
                    {/* Parent Category Row */}
                    <tr
                      onClick={() => toggleCategory(cat.id)}
                      className="bg-slate-50 hover:bg-slate-100/80 cursor-pointer font-bold select-none transition-colors"
                    >
                      <td className="p-3 text-slate-900 flex items-center gap-2">
                        <button className="text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <span>{cat.name}</span>
                      </td>

                      <td className="p-3 text-right font-mono text-slate-700">
                        {formatMoney(cat.budgetMAD)} MAD
                      </td>

                      <td className="p-3 text-right font-mono text-slate-900">
                        {formatMoney(cat.actualMAD)} MAD
                      </td>

                      <td
                        className={`p-3 text-right font-mono ${
                          isOverrun ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"
                        }`}
                      >
                        {varianceMAD >= 0 ? "+" : ""}
                        {formatMoney(varianceMAD)} MAD
                      </td>

                      <td className="p-3 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isOverrun
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {varianceMAD >= 0 ? "+" : ""}
                          {variancePct}%
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <Badge variant={isOverrun ? "rose" : "green"} size="sm" dot>
                          {isOverrun ? "Dépassement" : "Conforme"}
                        </Badge>
                      </td>
                    </tr>

                    {/* Sub-Rows: Entities under this category */}
                    {isExpanded &&
                      cat.entities.map((sub) => {
                        const subVariance = sub.actualMAD - sub.budgetMAD;
                        const subPct = ((subVariance / sub.budgetMAD) * 100).toFixed(1);
                        const subIsOverrun = cat.id !== "cat_rev" ? subVariance > 0 : subVariance < 0;

                        return (
                          <tr key={sub.entityId} className="hover:bg-slate-50/60 bg-white">
                            <td className="p-3 pl-10 text-slate-700 font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <span>{sub.entityName}</span>
                            </td>

                            <td className="p-3 text-right font-mono text-slate-500">
                              {formatMoney(sub.budgetMAD)} MAD
                            </td>

                            <td className="p-3 text-right font-mono text-slate-800">
                              {formatMoney(sub.actualMAD)} MAD
                            </td>

                            <td
                              className={`p-3 text-right font-mono ${
                                subIsOverrun ? "text-rose-600 font-semibold" : "text-emerald-700"
                              }`}
                            >
                              {subVariance >= 0 ? "+" : ""}
                              {formatMoney(subVariance)} MAD
                            </td>

                            <td className="p-3 text-center font-mono text-xs text-slate-600">
                              {subVariance >= 0 ? "+" : ""}
                              {subPct}%
                            </td>

                            <td className="p-3 text-center">
                              {subIsOverrun && Math.abs(subVariance) > 200000 && (
                                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                  Source de l&apos;écart
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
