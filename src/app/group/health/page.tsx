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

  return (
    <AppShell
      title="Santé des Entités & Qualité des Données (Data Quality Center)"
      subtitle={`Audit de complétude comptable, fraîcheur des imports et intégrité de consolidation • Devise : ${consolidationCurrency}`}
    >
      {/* Top Warning Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Garantie d&apos;Intégrité Comptable du Reporting Groupe
              </h2>
              <Badge variant="blue" size="sm">Audit Actif</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Le reporting consolidé ne mélange jamais silencieusement des périodes incomplètes. Toutes les entités sont synchronisées à date avec un score moyen de fraîcheur comptable de <strong>95.2%</strong>. Un écart de réconciliation intercompany de 20 000 MAD est sous revue.
            </p>
          </div>
        </div>

        <Link href="/group/intercompany">
          <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Résoudre l&apos;écart 20K
          </Button>
        </Link>
      </div>

      {/* Top 4 Data Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Score de Fraîcheur des Données"
          value="95.2%"
          badge="Excellente"
          badgeVariant="green"
          description="Dernière clôture à J+2"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Périodes Comptables Manquantes"
          value="0 période"
          badge="Complet"
          badgeVariant="green"
          description="Aucune rupture chronologique"
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="Flux Intercompany en Suspends"
          value="1 transaction"
          badge="20 000 MAD"
          badgeVariant="warning"
          description="Alpha vs Beta en réconciliation"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title="Flux Bancaires Connectés"
          value="4 / 5 entités"
          badge="80% Direct"
          badgeVariant="blue"
          description="API bancaires temps réel"
          icon={<Wifi className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Entity Audit Table */}
      <Card
        title="Audit de Complétude & Statut Technique par Entité"
        subtitle="Vérification de l'état de synchronisation ERP, des budgets et des rapprochements"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entité / Société</TableHead>
                <TableHead align="center">Dernier Import</TableHead>
                <TableHead align="center">Flux Bancaire Direct</TableHead>
                <TableHead align="center">Périodes Manquantes</TableHead>
                <TableHead align="center">Écarts Intercompany</TableHead>
                <TableHead align="center">Budget Paramétré</TableHead>
                <TableHead align="right">Score de Fraîcheur</TableHead>
                <TableHead align="center">Statut d&apos;Intégrité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((ent) => (
                <TableRow key={ent.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-bold text-slate-900">{ent.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {ent.country} • {ent.functionalCurrency}
                    </div>
                  </TableCell>

                  <TableCell align="center" className="font-mono text-xs text-slate-700">
                    {ent.dataQuality.lastUpdate}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.bankFeedConnected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Wifi className="w-3 h-3 text-emerald-600" />
                        <span>Connecté</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <WifiOff className="w-3 h-3 text-slate-400" />
                        <span>Fichier plat</span>
                      </span>
                    )}
                  </TableCell>

                  <TableCell align="center" className="font-mono text-xs font-semibold">
                    {ent.dataQuality.missingPeriodsCount === 0 ? (
                      <span className="text-emerald-700">0</span>
                    ) : (
                      <span className="text-rose-600 font-bold">{ent.dataQuality.missingPeriodsCount}</span>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.unmatchedIntercompanyCount > 0 ? (
                      <Badge variant="rose" size="sm" dot>
                        {ent.dataQuality.unmatchedIntercompanyCount} écart (20K)
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">0 écart</span>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.budgetConfigured ? (
                      <Badge variant="green" size="sm">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="slate" size="sm">
                        Non configuré
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell align="right" className="font-mono font-bold text-slate-900">
                    {ent.dataQuality.freshnessScorePct}%
                  </TableCell>

                  <TableCell align="center">
                    {ent.dataQuality.freshnessScorePct >= 95 ? (
                      <Badge variant="green" dot>
                        Certifié conforme
                      </Badge>
                    ) : (
                      <Badge variant="amber" dot>
                        Revue requise
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
