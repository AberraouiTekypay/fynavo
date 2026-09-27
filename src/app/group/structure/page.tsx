"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useGroup } from "@/lib/group/GroupContext";
import { Entity, EntityType, OperationalStatus, ConsolidationMethod } from "@/lib/group/types";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Box,
  FolderTree,
} from "lucide-react";

export default function GroupStructurePage() {
  const {
    group,
    entities,
    assets,
    selectEntity,
    addEntity,
  } = useGroup();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [collapsedNodes, setCollapsedNodes] = React.useState<Record<string, boolean>>({});
  const [selectedEntityForDetails, setSelectedEntityForDetails] = React.useState<Entity | null>(null);

  // Add Entity Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newEntityName, setNewEntityName] = React.useState("");
  const [newEntityLegalName, setNewEntityLegalName] = React.useState("");
  const [newEntityType, setNewEntityType] = React.useState<EntityType>("subsidiary");
  const [newEntityParentId, setNewEntityParentId] = React.useState<string>("ent_holding");
  const [newEntityCountry, setNewEntityCountry] = React.useState("Maroc");
  const [newEntityCurrency, setNewEntityCurrency] = React.useState("MAD");
  const [newEntityOwnership, setNewEntityOwnership] = React.useState(100);
  const [newEntityMethod, setNewEntityMethod] = React.useState<ConsolidationMethod>("full");
  const [newEntityStatus, setNewEntityStatus] = React.useState<OperationalStatus>("operating");
  const [newEntitySector, setNewEntitySector] = React.useState("Services");

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName) return;

    addEntity({
      name: newEntityName,
      legalName: newEntityLegalName || newEntityName,
      code: newEntityName.slice(0, 5).toUpperCase(),
      type: newEntityType,
      parentId: newEntityParentId,
      country: newEntityCountry,
      functionalCurrency: newEntityCurrency,
      ownershipPercentage: Number(newEntityOwnership),
      consolidationMethod: newEntityMethod,
      operationalStatus: newEntityStatus,
      sector: newEntitySector,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewEntityName("");
    setNewEntityLegalName("");
  };

  // Find root entity (Holding)
  const rootEntity = entities.find((e) => e.parentId === null) || entities[0];

  // Helper to get child entities
  const getChildren = (parentId: string) => {
    return entities.filter((e) => e.parentId === parentId);
  };

  // Helper to get assets for an entity
  const getAssetsForEntity = (entityId: string) => {
    return assets.filter((a) => a.entityId === entityId);
  };

  // Filter check
  const matchesSearch = (ent: Entity) => {
    if (filterType !== "all" && ent.type !== filterType) return false;
    if (filterStatus !== "all" && ent.operationalStatus !== filterStatus) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ent.name.toLowerCase().includes(q) ||
      ent.code.toLowerCase().includes(q) ||
      ent.country.toLowerCase().includes(q) ||
      ent.sector.toLowerCase().includes(q)
    );
  };

  return (
    <AppShell
      title="Structure du Groupe"
      subtitle="Arborescence hiérarchique institutionnelle • Périmètre de consolidation de gestion"
    >
      {/* Top Controls and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer entité, code, pays..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tous les types d&apos;objets</option>
            <option value="holding">Holding</option>
            <option value="subsidiary">Filiale (Subsidiary)</option>
            <option value="spv">SPV (Véhicule de projet)</option>
            <option value="company">Société d&apos;exploitation</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tous les statuts</option>
            <option value="operating">En exploitation (Operating)</option>
            <option value="pre_opening">Pré-ouverture (Pre-opening)</option>
            <option value="formation">En formation</option>
            <option value="mature">Mature</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Ajouter une entité au groupe
        </Button>
      </div>

      {/* Consolidation Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Périmètre de consolidation de gestion :</strong> 5 entités juridiques, 4 actifs opérationnels. Intégration globale appliquée aux filiales contrôlées, intégration proportionnelle sur le SPV Delta (60%).
          </span>
        </div>
        <span className="font-semibold text-blue-700 shrink-0 text-[11px]">
          Devise groupe : MAD
        </span>
      </div>

      {/* Visual Organization Tree View */}
      <div className="space-y-4">
        {/* Level 0: The Group Container */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <FolderTree className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">{group.name}</h2>
                  <Badge variant="blue" size="sm">Groupe Consolidé</Badge>
                  <span className="text-xs text-slate-400 font-mono">({group.code})</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/group">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Cockpit Consolidé
                </Button>
              </Link>
            </div>
          </div>

          {/* Hierarchical Tree Body */}
          <div className="pt-6 pl-4 sm:pl-8 space-y-6">
            {/* Holding Node */}
            {rootEntity && (
              <EntityNodeCard
                entity={rootEntity}
                isCollapsed={collapsedNodes[rootEntity.id] || false}
                onToggleCollapse={() => toggleCollapse(rootEntity.id)}
                onSelect={() => setSelectedEntityForDetails(rootEntity)}
                onOpenWorkspace={() => selectEntity(rootEntity.id)}
                matchesSearch={matchesSearch(rootEntity)}
              >
                {/* Level 1: Subsidiaries & SPVs under Holding */}
                {getChildren(rootEntity.id).map((subEntity) => (
                  <EntityNodeCard
                    key={subEntity.id}
                    entity={subEntity}
                    isCollapsed={collapsedNodes[subEntity.id] || false}
                    onToggleCollapse={() => toggleCollapse(subEntity.id)}
                    onSelect={() => setSelectedEntityForDetails(subEntity)}
                    onOpenWorkspace={() => selectEntity(subEntity.id)}
                    matchesSearch={matchesSearch(subEntity)}
                  >
                    {/* Level 2: Assets / Projects under this Subsidiary */}
                    {getAssetsForEntity(subEntity.id).map((asset) => (
                      <div
                        key={asset.id}
                        className="ml-6 sm:ml-10 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                            <Box className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{asset.name}</span>
                              <Badge variant="outline" size="sm">
                                {asset.type === "business_unit" ? "Business Unit" : "Actif / Projet"}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-slate-400">{asset.description}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="font-mono font-semibold text-slate-900 block">
                              CA: {new Intl.NumberFormat("fr-FR").format(asset.revenue)} MAD
                            </span>
                            <span className="text-[10px] text-slate-400">
                              EBITDA: {new Intl.NumberFormat("fr-FR").format(asset.ebitda)} MAD
                            </span>
                          </div>
                          <Badge variant="slate" size="sm">
                            {asset.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </EntityNodeCard>
                ))}
              </EntityNodeCard>
            )}
          </div>
        </div>
      </div>

      {/* Entity Details Drawer Modal */}
      {selectedEntityForDetails && (
        <Modal
          isOpen={!!selectedEntityForDetails}
          onClose={() => setSelectedEntityForDetails(null)}
          title={`Fiche Juridique & Financière : ${selectedEntityForDetails.name}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Identifiant fiscal : {selectedEntityForDetails.taxId || "En cours"}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setSelectedEntityForDetails(null)}>
                  Fermer
                </Button>
                <Link href="/group">
                  <Button
                    variant="primary"
                    onClick={() => {
                      selectEntity(selectedEntityForDetails.id);
                      setSelectedEntityForDetails(null);
                    }}
                  >
                    Ouvrir l&apos;espace de travail
                  </Button>
                </Link>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium block">Dénomination</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.legalName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Type d&apos;entité</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.type.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Taux de détention</span>
                <span className="font-bold text-blue-600">
                  {selectedEntityForDetails.ownershipPercentage}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Méthode consolidation</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.consolidationMethod}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium block">Pays de résidence</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.country}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Devise fonctionnelle</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.functionalCurrency}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Statut d&apos;exploitation</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.operationalStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Secteur d&apos;activité</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.sector}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Indicateurs Financiers Clés (Exercice en cours)</span>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Chiffre d&apos;Affaires</span>
                  <span className="font-mono font-bold text-slate-900">
                    {new Intl.NumberFormat("fr-FR").format(selectedEntityForDetails.financials.revenue)} MAD
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">EBITDA</span>
                  <span className="font-mono font-bold text-slate-900">
                    {new Intl.NumberFormat("fr-FR").format(selectedEntityForDetails.financials.ebitda)} MAD
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Trésorerie Disponible</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {new Intl.NumberFormat("fr-FR").format(selectedEntityForDetails.financials.cash)} MAD
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900">
              <strong>Observation DAF :</strong> {selectedEntityForDetails.description}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Entity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter une Entité ou SPV au Groupe"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreateEntity}>
              Créer l&apos;entité
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateEntity} className="space-y-3.5 text-xs">
          <Input
            label="Nom commercial de l'entité"
            value={newEntityName}
            onChange={(e) => setNewEntityName(e.target.value)}
            placeholder="ex: Entity Epsilon / SPV Logistique"
            required
          />

          <Input
            label="Raison sociale légale"
            value={newEntityLegalName}
            onChange={(e) => setNewEntityLegalName(e.target.value)}
            placeholder="ex: Epsilon Logistics SARL"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type d'entité"
              value={newEntityType}
              onChange={(e) => setNewEntityType(e.target.value as EntityType)}
              options={[
                { label: "Filiale (Subsidiary)", value: "subsidiary" },
                { label: "Véhicule SPV", value: "spv" },
                { label: "Société d'exploitation", value: "company" },
                { label: "Succursale (Branch)", value: "branch" },
                { label: "Autre", value: "other" },
              ]}
            />

            <Select
              label="Entité Mère (Parent)"
              value={newEntityParentId}
              onChange={(e) => setNewEntityParentId(e.target.value)}
              options={entities.map((ent) => ({
                label: `${ent.name} (${ent.code})`,
                value: ent.id,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Pays"
              value={newEntityCountry}
              onChange={(e) => setNewEntityCountry(e.target.value)}
              options={[
                { label: "Maroc", value: "Maroc" },
                { label: "France", value: "France" },
                { label: "Émirats Arabes Unis", value: "Émirats Arabes Unis" },
                { label: "Sénégal", value: "Sénégal" },
                { label: "États-Unis", value: "États-Unis" },
              ]}
            />

            <Select
              label="Devise fonctionnelle"
              value={newEntityCurrency}
              onChange={(e) => setNewEntityCurrency(e.target.value)}
              options={[
                { label: "MAD (Dirham Marocain)", value: "MAD" },
                { label: "EUR (Euro)", value: "EUR" },
                { label: "USD (Dollar US)", value: "USD" },
                { label: "GBP (Livre Sterling)", value: "GBP" },
                { label: "XOF (Franc CFA)", value: "XOF" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Pourcentage de détention (%)"
              type="number"
              min={1}
              max={100}
              value={newEntityOwnership}
              onChange={(e) => setNewEntityOwnership(Number(e.target.value))}
            />

            <Select
              label="Méthode de consolidation"
              value={newEntityMethod}
              onChange={(e) => setNewEntityMethod(e.target.value as ConsolidationMethod)}
              options={[
                { label: "Intégration Globale (Full)", value: "full" },
                { label: "Intégration Proportionnelle", value: "proportional" },
                { label: "Mise en équivalence (Equity)", value: "equity" },
                { label: "Hors périmètre (Excluded)", value: "excluded" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Statut opérationnel"
              value={newEntityStatus}
              onChange={(e) => setNewEntityStatus(e.target.value as OperationalStatus)}
              options={[
                { label: "En exploitation (Operating)", value: "operating" },
                { label: "Pré-ouverture (Pre-opening)", value: "pre_opening" },
                { label: "En formation", value: "formation" },
                { label: "Mature", value: "mature" },
              ]}
            />

            <Input
              label="Secteur / Activité"
              value={newEntitySector}
              onChange={(e) => setNewEntitySector(e.target.value)}
              placeholder="ex: Immobilier, Tech, Logistique"
            />
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

// Sub-component for an interactive node in the hierarchy
function EntityNodeCard({
  entity,
  isCollapsed,
  onToggleCollapse,
  onSelect,
  onOpenWorkspace,
  matchesSearch,
  children,
}: {
  entity: Entity;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: () => void;
  onOpenWorkspace: () => void;
  matchesSearch: boolean;
  children?: React.ReactNode;
}) {
  const isPreRevenue = entity.operationalStatus === "pre_opening";
  const hasShortfall = entity.healthPillars.liquidity.status === "critical";

  if (!matchesSearch) return null;

  return (
    <div className="space-y-3 relative">
      {/* Node Box */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCollapse}
            aria-label="Déplier le sous-arbre"
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
            {entity.code}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={onSelect}
                className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {entity.name}
              </span>
              <Badge variant="outline" size="sm">
                {entity.ownershipPercentage}%
              </Badge>
              {hasShortfall && (
                <Badge variant="rose" size="sm" dot>
                  Tension Cash
                </Badge>
              )}
              {isPreRevenue && (
                <Badge variant="blue" size="sm" dot>
                  Pré-ouverture
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{entity.country}</span>
              <span>•</span>
              <span>{entity.functionalCurrency}</span>
              <span>•</span>
              <span className="capitalize">{entity.type.replace("_", " ")}</span>
              <span>•</span>
              <span className="capitalize">{entity.consolidationMethod}</span>
            </div>
          </div>
        </div>

        {/* Node Actions & Mini Financials */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold text-slate-800 block">
              {isPreRevenue ? "Pré-revenu" : `${new Intl.NumberFormat("fr-FR").format(entity.financials.revenue)} MAD`}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Cash : {new Intl.NumberFormat("fr-FR").format(entity.financials.cash)} MAD
            </span>
          </div>

          <Button variant="secondary" size="sm" onClick={onSelect}>
            Fiche
          </Button>

          <Button variant="blue" size="sm" onClick={onOpenWorkspace}>
            Ouvrir
          </Button>
        </div>
      </div>

      {/* Children Nodes (Sub-hierarchy) */}
      {!isCollapsed && children && (
        <div className="pl-4 sm:pl-8 border-l-2 border-slate-200 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
