"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Alert } from "@/components/ui/Alert";
import { Dropdown } from "@/components/ui/Dropdown";
import { Tooltip } from "@/components/ui/Tooltip";
import { DatePicker } from "@/components/ui/DatePicker";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowRight,
  Download,
  Filter,
  MoreVertical,
  Search,
  Sparkles,
  Layers,
  Palette,
} from "lucide-react";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("2026-09-27");
  const [datePreset, setDatePreset] = React.useState("this_month");

  const colors = [
    { name: "Primary Navy", hex: "#0F172A", role: "Navigation, headings, sidebar, premium accents" },
    { name: "Secondary Slate", hex: "#1E293B", role: "Secondary structures, cards dark mode" },
    { name: "Interaction Blue", hex: "#2563EB", role: "Primary CTAs, links, active states" },
    { name: "Finance Green", hex: "#10B981", role: "Positive trends, surplus, validated states" },
    { name: "Warning Amber", hex: "#F59E0B", role: "Cash warnings, delayed receivables" },
    { name: "Risk Red", hex: "#EF4444", role: "Overdue debts, critical cash shortfalls" },
    { name: "Background Off-White", hex: "#F8FAFC", role: "Main canvas background" },
    { name: "Border Slate", hex: "#E2E8F0", role: "Card borders, divider lines" },
  ];

  return (
    <AppShell
      title="Design System & Fondations Fynavo"
      subtitle="Spécifications graphiques, tokens, composants interactifs et conventions d'interface pour le cockpit financier."
    >
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="lg" />
          <div className="border-l border-slate-200 pl-4">
            <h2 className="text-lg font-bold text-slate-900">
              Fynavo Design System
            </h2>
            <p className="text-xs text-slate-500">
              Version 1.0 — Architecture B2B FinanceOS (Inter • Tailwind • Radix-inspired)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" dot>
            Sprint 1 Validé
          </Badge>
          <Badge variant="blue">
            Multi-Tenant Supabase Ready
          </Badge>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="segmented"
        tabs={[
          { id: "overview", label: "Vue d'ensemble", icon: <Layers className="w-3.5 h-3.5" /> },
          { id: "brand", label: "Marque & Palette", icon: <Palette className="w-3.5 h-3.5" /> },
          { id: "components", label: "Composants UI", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: "financial", label: "Modules Financiers", icon: <Wallet className="w-3.5 h-3.5" /> },
        ]}
      />

      {/* SECTION 1: MARQUE & PALETTE */}
      {(activeTab === "overview" || activeTab === "brand") && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Palette Officielle & Tokens Sémantiques</span>
              </CardTitle>
              <CardDescription>
                Couleurs rigoureusement sélectionnées selon le cahier des charges de marque Fynavo (pas de gradient néon, pas de cliché crypto).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div
                      className="w-full h-14 rounded-lg mb-2 shadow-inner border border-black/10 flex items-end p-2"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: color.hex === "#F8FAFC" || color.hex === "#E2E8F0" ? "#0F172A" : "#FFFFFF",
                          color: color.hex === "#F8FAFC" || color.hex === "#E2E8F0" ? "#FFFFFF" : "#0F172A",
                        }}
                      >
                        {color.hex}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{color.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{color.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Logo Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Officiel Fynavo (Concepts & Variantes)</CardTitle>
              <CardDescription>
                Symbole géométrique de trajectoire convergente et navigation prédictive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-400">Variante Claire (Light)</span>
                  <Logo variant="light" size="lg" />
                </div>
                <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col items-center justify-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-400">Variante Sombre (Dark)</span>
                  <Logo variant="dark" size="lg" />
                </div>
                <div className="p-6 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-400">Icon Only (Favicon / App Icon)</span>
                  <div className="flex items-center gap-3">
                    <Logo iconOnly size="md" />
                    <Logo iconOnly size="lg" />
                    <Logo iconOnly size="xl" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: COMPOSANTS UI DE BASE */}
      {(activeTab === "overview" || activeTab === "components") && (
        <div className="space-y-6">
          {/* Buttons Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Boutons (Variants & Tailles)</CardTitle>
              <CardDescription>
                Boutons accessibles avec états hover, focus, disabled et loading.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Navy</Button>
                <Button variant="blue">Interaction Blue</Button>
                <Button variant="secondary">Secondary White</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="link">Lien textuel</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <Button size="xs" variant="secondary">Taille XS</Button>
                <Button size="sm" variant="secondary">Taille SM</Button>
                <Button size="md" variant="secondary">Taille MD</Button>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Taille LG
                </Button>
                <Button variant="blue" isLoading>Chargement</Button>
                <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges & Tooltips Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Badges & Tooltips</CardTitle>
              <CardDescription>
                Pills sémantiques pour statuts comptables, alertes et labels financiers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">Neutre</Badge>
                <Badge variant="blue" dot>En cours</Badge>
                <Badge variant="green" dot>Payé / Conforme</Badge>
                <Badge variant="warning" dot>Échéance proche</Badge>
                <Badge variant="danger" dot>En retard &gt;60j</Badge>
                <Badge variant="navy">Exécutif</Badge>
                <Badge variant="outline">MAD Devise</Badge>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-600">Survolez pour voir les infobulles :</span>
                <Tooltip content="Délai Moyen de Paiement Clients (Days Sales Outstanding)">
                  <span className="cursor-help underline decoration-dotted text-xs font-semibold text-blue-600">
                    DSO Client
                  </span>
                </Tooltip>
                <Tooltip content="Excédent Brut d'Exploitation (Earnings Before Interest, Taxes, Depreciation, and Amortization)" position="bottom">
                  <span className="cursor-help underline decoration-dotted text-xs font-semibold text-blue-600">
                    EBITDA
                  </span>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Form Inputs & Selects */}
          <Card>
            <CardHeader>
              <CardTitle>Champs de Formulaire (Inputs, Selects & DatePicker)</CardTitle>
              <CardDescription>
                Champs typés pour montants financiers, devises, pourcentages et dates fiscales.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Chiffre d'affaires cible"
                placeholder="2 500 000"
                suffix="MAD"
                defaultValue="2460000"
              />
              <Input
                label="Hypothèse de marge brute"
                placeholder="35"
                suffix="%"
                defaultValue="34.5"
              />
              <Input
                label="Recherche client"
                placeholder="Nom ou ICE..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
              <Select
                label="Source comptable"
                options={[
                  { value: "sage", label: "Sage 100 / Sage Cloud" },
                  { value: "odoo", label: "Odoo ERP" },
                  { value: "excel", label: "Export Excel / CSV standard" },
                  { value: "ebp", label: "EBP Compta" },
                ]}
              />
              <DatePicker
                label="Période d'analyse"
                value={selectedDate}
                onChange={setSelectedDate}
                preset={datePreset}
                onPresetSelect={setDatePreset}
              />
              <div className="flex flex-col justify-end">
                <Dropdown
                  trigger={
                    <Button variant="secondary" className="w-full justify-between">
                      <span>Actions financières rapides</span>
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </Button>
                  }
                  items={[
                    { id: "1", label: "Exporter balance générale", shortcut: "⌘E" },
                    { id: "2", label: "Générer rapport PDF", shortcut: "⌘P" },
                    { type: "separator" },
                    { id: "3", label: "Relancer les créances échues" },
                    { id: "4", label: "Supprimer le brouillon", danger: true },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 3: MODULES & TABLES FINANCIÈRES */}
      {(activeTab === "overview" || activeTab === "financial") && (
        <div className="space-y-6">
          {/* Executive KPI Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                KPIs Exécutifs (Sprint 1 Standard)
              </h3>
              <span className="text-xs text-slate-500">Données démo Atlas Logistics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Trésorerie Actuelle"
                value="1,84 M MAD"
                change={+8.4}
                changeLabel="vs mois précédent"
                badge="14j de buffer"
                icon={<Wallet className="w-4 h-4" />}
                tooltip="Solde total consolidé sur les 3 comptes bancaires actifs."
              />
              <KPICard
                title="CA Mensuel (M-1)"
                value="2,46 M MAD"
                change={+12.1}
                changeLabel="vs budget"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <KPICard
                title="Créances Échues"
                value="420 K MAD"
                change={+14.0}
                changeInverted
                changeLabel="Détérioration DSO"
                icon={<CreditCard className="w-4 h-4" />}
              />
              <KPICard
                title="Runway Prévisionnel"
                value="8,2 mois"
                change={-0.4}
                changeLabel="au rythme actuel"
                icon={<Clock className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Actionable Alert Banner */}
          <Alert
            severity="warning"
            title="Tension de trésorerie anticipée à la Semaine 9"
            explanation="Un décalage de paiement moyen de 18 jours sur les 3 premiers clients logistiques réduira le solde bancaire sous le seuil d'alerte des 400 000 MAD."
            suggestedNextStep="Activer la relance prioritaire sur Atlas Distribution (165 K MAD) avant le 10 octobre."
            sourceMetric="PREVISION-13S"
            actionLabel="Voir la prévision"
            onAction={() => alert("Navigation vers Prévisions 13s")}
          />

          {/* Interactive Financial Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Échéancier des Créances Clients (Extrait AR)</CardTitle>
                <CardDescription>
                  Tableau à haute densité financière avec chiffres tabulaires et statuts de recouvrement.
                </CardDescription>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Filter className="w-3.5 h-3.5" />}
              >
                Filtrer échus
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Date d&apos;échéance</TableHead>
                    <TableHead align="right">Montant TTC</TableHead>
                    <TableHead align="right">Reste Dû</TableHead>
                    <TableHead align="center">Statut</TableHead>
                    <TableHead align="right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-slate-900">
                      Atlas Distribution SARL
                    </TableCell>
                    <TableCell className="font-mono text-xs">FAC-2026-0891</TableCell>
                    <TableCell>15/08/2026</TableCell>
                    <TableCell align="right" tabular>
                      {formatCurrency(165000)}
                    </TableCell>
                    <TableCell align="right" tabular className="text-rose-600 font-bold">
                      {formatCurrency(165000)}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="danger" dot>
                        &gt; 60 jours
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="xs" variant="primary">
                        Relancer
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-900">
                      Maghreb Retail Co.
                    </TableCell>
                    <TableCell className="font-mono text-xs">FAC-2026-0914</TableCell>
                    <TableCell>05/09/2026</TableCell>
                    <TableCell align="right" tabular>
                      {formatCurrency(240000)}
                    </TableCell>
                    <TableCell align="right" tabular className="text-amber-600 font-bold">
                      {formatCurrency(120000)}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="warning" dot>
                        1-30 jours
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="xs" variant="secondary">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-900">
                      Casablanca Freight Express
                    </TableCell>
                    <TableCell className="font-mono text-xs">FAC-2026-0940</TableCell>
                    <TableCell>30/09/2026</TableCell>
                    <TableCell align="right" tabular>
                      {formatCurrency(98500)}
                    </TableCell>
                    <TableCell align="right" tabular className="text-slate-900 font-bold">
                      {formatCurrency(98500)}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="blue" dot>
                        À échoir
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="xs" variant="ghost">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Modal Demo Button */}
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Boîte de dialogue modale</h4>
              <p className="text-xs text-slate-500">Testez le composant modal accessible avec gestion d&apos;échappement et focus.</p>
            </div>
            <Button variant="blue" onClick={() => setIsModalOpen(true)}>
              Ouvrir la modale
            </Button>
          </div>
        </div>
      )}

      {/* Accessible Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un nouveau scénario financier"
        description="Configurez les hypothèses macro pour simuler l'impact sur votre cash runway."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Créer le scénario
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Nom du scénario" defaultValue="Stress Test Baisse CA -15%" />
          <Select
            label="Scénario de référence"
            options={[
              { value: "base", label: "Base Case (Budget 2026)" },
              { value: "prudent", label: "Cas Prudent (Retard paiement 30j)" },
            ]}
          />
          <Input label="Variation du Chiffre d'Affaires" defaultValue="-15" suffix="%" />
        </div>
      </Modal>
    </AppShell>
  );
}
