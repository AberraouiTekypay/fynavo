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
import { useLanguage } from "@/lib/i18n/LanguageContext";
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
    consolidationCurrency,
    selectEntity,
    addEntity,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

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
  const [newEntityCountry, setNewEntityCountry] = React.useState("Morocco");
  const [newEntityCurrency, setNewEntityCurrency] = React.useState("MAD");
  const [newEntityOwnership, setNewEntityOwnership] = React.useState(100);
  const [newEntityMethod, setNewEntityMethod] = React.useState<ConsolidationMethod>("full");
  const [newEntityStatus, setNewEntityStatus] = React.useState<OperationalStatus>("operating");
  const [newEntitySector, setNewEntitySector] = React.useState("Technology & Services");

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
      title={t.structure.title}
      subtitle={`${t.structure.subtitle} ${consolidationCurrency}`}
    >
      {/* Top Controls and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.structure.searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          >
            <option value="all">{t.common.allTypes}</option>
            <option value="holding">{t.common.holding}</option>
            <option value="subsidiary">{t.common.subsidiary}</option>
            <option value="spv">{t.common.spv}</option>
            <option value="company">{locale === "en" ? "Operating Company" : "Société d'exploitation"}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          >
            <option value="all">{locale === "en" ? "All Operational Statuses" : "Tous les statuts"}</option>
            <option value="operating">{t.common.operating}</option>
            <option value="pre_opening">{t.common.preOperating}</option>
            <option value="formation">{locale === "en" ? "In Formation" : "En formation"}</option>
            <option value="mature">{locale === "en" ? "Mature" : "Mature"}</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-sm"
        >
          {t.structure.addEntityBtn}
        </Button>
      </div>

      {/* Consolidation Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900 shadow-subtle">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>{locale === "en" ? "Management Consolidation Perimeter:" : "Périmètre de consolidation de gestion :"}</strong>{" "}
            {locale === "en"
              ? "5 legal entities, 4 operational business assets. Full consolidation applied to controlled subsidiaries, proportional integration for SPV Delta (60%)."
              : "5 entités juridiques, 4 actifs opérationnels. Intégration globale appliquée aux filiales contrôlées, intégration proportionnelle sur le SPV Delta (60%)."}
          </span>
        </div>
        <span className="font-bold text-blue-700 shrink-0 text-[11px] ml-2">
          {consolidationCurrency}
        </span>
      </div>

      {/* Visual Organization Tree View */}
      <div className="space-y-4">
        {/* Level 0: The Group Container */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle card-accent-top">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <FolderTree className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">{group.name}</h2>
                  <Badge variant="blue" size="sm" dot>
                    {t.common.consolidated}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">({group.code})</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/group">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  {t.nav.executiveCockpit}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hierarchical Tree Body */}
          <div className="pt-6 pl-2 sm:pl-6 space-y-5">
            {/* Holding Node */}
            {rootEntity && (
              <EntityNodeCard
                entity={rootEntity}
                isCollapsed={collapsedNodes[rootEntity.id] || false}
                onToggleCollapse={() => toggleCollapse(rootEntity.id)}
                onSelect={() => setSelectedEntityForDetails(rootEntity)}
                onOpenWorkspace={() => selectEntity(rootEntity.id)}
                matchesSearch={matchesSearch(rootEntity)}
                formatMoney={formatMoney}
                locale={locale}
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
                    formatMoney={formatMoney}
                    locale={locale}
                  >
                    {/* Level 2: Assets / Projects under this Subsidiary */}
                    {getAssetsForEntity(subEntity.id).map((asset) => (
                      <div
                        key={asset.id}
                        className="ml-6 sm:ml-10 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                            <Box className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{asset.name}</span>
                              <Badge variant="outline" size="sm">
                                {asset.type === "business_unit" ? "Business Unit" : "Asset / Project"}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-slate-400">{asset.description}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="font-mono font-bold text-slate-900 block font-tabular">
                              Rev: {formatMoney(asset.revenue, "MAD")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-tabular">
                              EBITDA: {formatMoney(asset.ebitda, "MAD")}
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
          title={`${locale === "en" ? "Corporate & Financial Card:" : "Fiche Juridique & Financière :"} ${selectedEntityForDetails.name}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-mono">
                ICE / Tax ID: {selectedEntityForDetails.taxId || "Pending Registration"}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setSelectedEntityForDetails(null)}>
                  {t.common.close}
                </Button>
                <Link href="/group">
                  <Button
                    variant="primary"
                    onClick={() => {
                      selectEntity(selectedEntityForDetails.id);
                      setSelectedEntityForDetails(null);
                    }}
                  >
                    {locale === "en" ? "Open Cockpit Workspace" : "Ouvrir l'espace de travail"}
                  </Button>
                </Link>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldLegalName}</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.legalName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldType}</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.type.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldOwnership}</span>
                <span className="font-bold text-blue-600">
                  {selectedEntityForDetails.ownershipPercentage}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldConsolidationMethod}</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.consolidationMethod}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldCountry}</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.country}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldCurrency}</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.functionalCurrency}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldStatus}</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedEntityForDetails.operationalStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">{t.structure.fieldSector}</span>
                <span className="font-bold text-slate-900">{selectedEntityForDetails.sector}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="font-bold text-slate-900 block">
                {locale === "en" ? "Key Financial Indicators (Current Fiscal Period)" : "Indicateurs Financiers Clés (Exercice en cours)"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[11px] font-semibold">{t.dashboard.colRevenue}</span>
                  <span className="font-mono font-bold text-slate-900 font-tabular">
                    {formatMoney(selectedEntityForDetails.financials.revenue, "MAD")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[11px] font-semibold">{t.dashboard.colEbitda}</span>
                  <span className="font-mono font-bold text-slate-900 font-tabular">
                    {formatMoney(selectedEntityForDetails.financials.ebitda, "MAD")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[11px] font-semibold">{t.dashboard.colCash}</span>
                  <span className="font-mono font-bold text-emerald-600 font-tabular">
                    {formatMoney(selectedEntityForDetails.financials.cash, "MAD")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900">
              <strong>{locale === "en" ? "CFO Notes & Context:" : "Observation DAF :"}</strong> {selectedEntityForDetails.description}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Entity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t.structure.createNewEntityModalTitle}
        description={t.structure.createNewEntityModalDesc}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button variant="primary" onClick={handleCreateEntity}>
              {t.structure.submitCreate}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateEntity} className="space-y-3.5 text-xs">
          <Input
            label={t.structure.fieldName}
            value={newEntityName}
            onChange={(e) => setNewEntityName(e.target.value)}
            placeholder="e.g. Entity Epsilon / SPV Logistics"
            required
          />

          <Input
            label={t.structure.fieldLegalName}
            value={newEntityLegalName}
            onChange={(e) => setNewEntityLegalName(e.target.value)}
            placeholder="e.g. Epsilon Logistics Global SARL"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t.structure.fieldType}
              value={newEntityType}
              onChange={(e) => setNewEntityType(e.target.value as EntityType)}
              options={[
                { label: "Subsidiary (Filiale)", value: "subsidiary" },
                { label: "SPV (Project Vehicle)", value: "spv" },
                { label: "Operating Company", value: "company" },
                { label: "Branch (Succursale)", value: "branch" },
                { label: "Other", value: "other" },
              ]}
            />

            <Select
              label={t.structure.fieldParent}
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
              label={t.structure.fieldCountry}
              value={newEntityCountry}
              onChange={(e) => setNewEntityCountry(e.target.value)}
              options={[
                { label: "Morocco", value: "Morocco" },
                { label: "France", value: "France" },
                { label: "United Arab Emirates", value: "UAE" },
                { label: "Senegal", value: "Senegal" },
                { label: "United States", value: "USA" },
              ]}
            />

            <Select
              label={t.structure.fieldCurrency}
              value={newEntityCurrency}
              onChange={(e) => setNewEntityCurrency(e.target.value)}
              options={[
                { label: "MAD (Moroccan Dirham)", value: "MAD" },
                { label: "EUR (Euro)", value: "EUR" },
                { label: "USD (US Dollar)", value: "USD" },
                { label: "GBP (British Pound)", value: "GBP" },
                { label: "XOF (CFA Franc)", value: "XOF" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t.structure.fieldOwnership}
              type="number"
              min={1}
              max={100}
              value={newEntityOwnership}
              onChange={(e) => setNewEntityOwnership(Number(e.target.value))}
            />

            <Select
              label={t.structure.fieldConsolidationMethod}
              value={newEntityMethod}
              onChange={(e) => setNewEntityMethod(e.target.value as ConsolidationMethod)}
              options={[
                { label: t.structure.fullConsolidation, value: "full" },
                { label: t.structure.proportionalMethod, value: "proportional" },
                { label: t.structure.equityMethod, value: "equity" },
                { label: "Excluded (Hors périmètre)", value: "excluded" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t.structure.fieldStatus}
              value={newEntityStatus}
              onChange={(e) => setNewEntityStatus(e.target.value as OperationalStatus)}
              options={[
                { label: "Operating (En exploitation)", value: "operating" },
                { label: "Pre-Opening (Pré-ouverture)", value: "pre_opening" },
                { label: "In Formation", value: "formation" },
                { label: "Mature", value: "mature" },
              ]}
            />

            <Input
              label={t.structure.fieldSector}
              value={newEntitySector}
              onChange={(e) => setNewEntitySector(e.target.value)}
              placeholder="e.g. Real Estate, Tech, Logistics"
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
  formatMoney,
  locale,
  children,
}: {
  entity: Entity;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: () => void;
  onOpenWorkspace: () => void;
  matchesSearch: boolean;
  formatMoney: (val: number, curr?: string) => string;
  locale: string;
  children?: React.ReactNode;
}) {
  const isPreRevenue = entity.operationalStatus === "pre_opening";
  const hasShortfall = entity.healthPillars.liquidity.status === "critical";

  if (!matchesSearch) return null;

  return (
    <div className="space-y-3 relative">
      {/* Node Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleCollapse}
            aria-label="Toggle Subtree"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center font-bold text-xs text-slate-800 shadow-2xs">
            {entity.code}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
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
                  {locale === "en" ? "Cash Tension" : "Tension Cash"}
                </Badge>
              )}
              {isPreRevenue && (
                <Badge variant="blue" size="sm" dot>
                  {locale === "en" ? "Pre-Opening" : "Pré-ouverture"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
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
            <span className="text-xs font-mono font-bold text-slate-800 block font-tabular">
              {isPreRevenue ? (locale === "en" ? "Pre-Revenue" : "Pré-revenu") : formatMoney(entity.financials.revenue, "MAD")}
            </span>
            <span className="text-[10px] text-slate-400 block font-tabular">
              Cash: {formatMoney(entity.financials.cash, "MAD")}
            </span>
          </div>

          <Button variant="secondary" size="sm" onClick={onSelect}>
            {locale === "en" ? "Details" : "Fiche"}
          </Button>

          <Button variant="blue" size="sm" onClick={onOpenWorkspace}>
            {locale === "en" ? "Workspace" : "Ouvrir"}
          </Button>
        </div>
      </div>

      {/* Children Nodes (Sub-hierarchy) */}
      {!isCollapsed && children && (
        <div className="pl-4 sm:pl-8 border-l-2 border-slate-200/90 space-y-3 mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
