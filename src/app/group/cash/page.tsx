"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function GroupCashPage() {
  const {
    entities,
    consolidationCurrency,
    consolidatedSummary,
    selectEntity,
  } = useGroup();

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

  // Cash by country calculation
  const cashByCountry = React.useMemo(() => {
    const map = new Map<string, number>();
    entities.forEach((e) => {
      map.set(e.country, (map.get(e.country) || 0) + e.financials.cash);
    });
    return Array.from(map.entries()).map(([country, amount]) => ({
      country,
      amount,
      pct: ((amount / consolidatedSummary.totalGroupCash) * 100).toFixed(1),
    }));
  }, [entities, consolidatedSummary.totalGroupCash]);

  return (
    <AppShell
      title="Trésorerie Groupe & Mobilité de Liquidité"
      subtitle={`Pilotage du disponible réel, réserves d'exploitation et contraintes de transfert • Devise : ${consolidationCurrency}`}
    >
      {/* Top Mobility Diagnostic Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                Diagnostic de Liquidité Mobilisable
              </h2>
              <Badge variant="green" size="sm">Analyse Active</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Le groupe affiche un solde bancaire brut de{" "}
              <strong className="text-slate-900">
                {formatMoney(consolidatedSummary.totalGroupCash)} {consolidationCurrency}
              </strong>
              . Après déduction des tampons opérationnels obligatoires ({formatMoney(consolidatedSummary.totalOperationalMinimum)} {consolidationCurrency}) et des séquestres bancaires ({formatMoney(consolidatedSummary.totalRestrictedCash)} {consolidationCurrency}), la liquidité réellement mobilisable par la direction générale s&apos;établit à{" "}
              <strong className="text-emerald-700">
                {formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} {consolidationCurrency}
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/group/forecast">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Prévisions 13 semaines →
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Trésorerie Groupe Globale"
          value={`${formatMoney(consolidatedSummary.totalGroupCash)} ${consolidationCurrency}`}
          badge="100% Banques"
          badgeVariant="blue"
          description="Solde brut cumulé de toutes les entités"
          icon={<Wallet className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="Liquidité Réellement Mobilisable"
          value={`${formatMoney(consolidatedSummary.actuallyDeployableLiquidity)} ${consolidationCurrency}`}
          badge="Déployable"
          badgeVariant="green"
          description="Hors seuils d'exploitation minimaux"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Réserves Opérationnelles de Sécurité"
          value={`${formatMoney(consolidatedSummary.totalOperationalMinimum)} ${consolidationCurrency}`}
          badge="Verrouillé"
          badgeVariant="amber"
          description="Fonds requis pour le cycle courant"
          icon={<Lock className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title="Entités en Tension de Trésorerie"
          value="1 entité (Beta)"
          badge="Alerte Semaine 4"
          badgeVariant="rose"
          description="Rupture prévisionnelle sous 30 jours"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
        />
      </div>

      {/* Detailed Entity Cash & Mobility Table */}
      <Card
        title="Ventilation du Cash par Entité & Statut de Mobilité"
        subtitle="Détail de la liquidité immédiate et des tampons d'exploitation requis"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité / Société</TableHead>
                <TableHead>Pays & Devise d&apos;Origine</TableHead>
                <TableHead align="right">Solde Brut en Devise</TableHead>
                <TableHead align="right">Équivalent ({consolidationCurrency})</TableHead>
                <TableHead align="right">Minimum Opérationnel</TableHead>
                <TableHead align="right">Cash Mobilisable</TableHead>
                <TableHead align="center">Statut de Mobilité</TableHead>
                <TableHead align="right">Horizon / Runway</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => {
                const isCritical = ent.financials.cash < ent.financials.operationalMinimum;
                const deployable = Math.max(0, ent.financials.cash - ent.financials.operationalMinimum);

                return (
                  <TableRow
                    key={ent.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => selectEntity(ent.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                          {ent.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {ent.name}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {ent.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700">{ent.country}</span>
                        <Badge variant="outline" size="sm">
                          {ent.functionalCurrency}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell align="right" className="font-mono text-slate-800">
                      {formatMoney(ent.financials.cash)} {ent.functionalCurrency}
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold text-slate-900">
                      {formatMoney(ent.financials.cash)} MAD
                    </TableCell>

                    <TableCell align="right" className="font-mono text-amber-700">
                      {formatMoney(ent.financials.operationalMinimum)} MAD
                    </TableCell>

                    <TableCell align="right" className="font-mono font-bold">
                      <span className={deployable > 0 ? "text-emerald-600" : "text-slate-400"}>
                        {formatMoney(deployable)} MAD
                      </span>
                    </TableCell>

                    <TableCell align="center">
                      {isCritical ? (
                        <Badge variant="rose" dot>
                          Déficit sous seuil min
                        </Badge>
                      ) : deployable > 1000000 ? (
                        <Badge variant="green" dot>
                          Librement disponible
                        </Badge>
                      ) : (
                        <Badge variant="amber" dot>
                          Réserve protégée
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded",
                          ent.financials.runwayMonths < 3
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {ent.financials.runwayMonths.toFixed(1)} mois
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Breakdown by Geography & Banking Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Répartition Géographique de la Trésorerie"
          subtitle="Exposition aux devises et juridictions fiscales"
        >
          <div className="space-y-3">
            {cashByCountry.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      {formatMoney(item.amount)} {consolidationCurrency}
                    </span>
                    <span className="text-[11px] text-slate-400">({item.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Partenaires Bancaires & Covenants"
          subtitle="Comptes principaux et facilités de caisse actives"
        >
          <div className="space-y-2.5 text-xs divide-y divide-slate-100">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Attijariwafa Bank (Holding & Alpha)</span>
                <span className="text-[11px] text-slate-500">Compte pivot centralisateur de trésorerie</span>
              </div>
              <span className="font-mono font-bold text-slate-900">7 250 000 MAD</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Banque Centrale Populaire (Gamma)</span>
                <span className="text-[11px] text-slate-500">Comptes d&apos;exploitation usine et ligne de crédit</span>
              </div>
              <span className="font-mono font-bold text-slate-900">680 000 MAD</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">BNP Paribas Commercial (Beta Europe)</span>
                <span className="text-[11px] text-slate-500">Ligne d&apos;affacturage et compte courant EUR</span>
              </div>
              <span className="font-mono font-bold text-slate-900">420 000 MAD (38.7K €)</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Emirates NBD (SPV Delta)</span>
                <span className="text-[11px] text-slate-500">Compte séquestre projet solaire international</span>
              </div>
              <span className="font-mono font-bold text-slate-900">720 000 MAD (72.3K $)</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
