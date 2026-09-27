"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Sparkles,
  Layers,
  Building2,
  Box,
  ChevronRight,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGroup } from "@/lib/group/GroupContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  className?: string;
}

export function Header({
  title,
  subtitle,
  onOpenMobileMenu,
  className,
}: HeaderProps) {
  const {
    group,
    entities,
    assets,
    currentEntityId,
    currentEntity,
    currentAssetId,
    currentAsset,
    isConsolidatedView,
    consolidationCurrency,
    selectEntity,
    selectAsset,
    setConsolidationCurrency,
  } = useGroup();

  const [isAlertsOpen, setIsAlertsOpen] = React.useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const selectorRef = React.useRef<HTMLDivElement>(null);
  const alertsRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsSelectorOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setIsAlertsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const groupAlerts = [
    {
      id: "a1",
      title: "Entity Beta : Tension de trésorerie critique sous 4 semaines",
      severity: "critical",
      entity: "Entity Beta",
      time: "Il y a 15 min",
    },
    {
      id: "a2",
      title: "Écart de réconciliation intercompany de 20 000 MAD (Alpha vs Beta)",
      severity: "warning",
      entity: "Intercompany",
      time: "Il y a 1h",
    },
    {
      id: "a3",
      title: "Entity Gamma : CAPEX robotique de 900 K MAD exigible sous 30j",
      severity: "warning",
      entity: "Entity Gamma",
      time: "Hier",
    },
  ];

  return (
    <header
      className={cn(
        "h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30",
        className
      )}
    >
      {/* Left: Mobile Trigger & 3-Tier Global Breadcrumb / Selector */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Ouvrir le menu"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global 3-Tier Selector Dropdown */}
        <div className="relative" ref={selectorRef}>
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-all shadow-subtle"
          >
            {isConsolidatedView ? (
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-[#0F172A]">{group.name}</span>
                <Badge variant="blue" size="sm">Consolidé</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium truncate">{group.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-[#0F172A] truncate">{currentEntity?.name}</span>
                {currentAsset && (
                  <>
                    <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-blue-700 font-semibold truncate">{currentAsset.name}</span>
                  </>
                )}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Selector Popover */}
          {isSelectorOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-elevated border border-slate-200 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Niveau d&apos;analyse financière
              </div>

              {/* Option 1: Consolidated Group */}
              <button
                onClick={() => {
                  selectEntity(null);
                  setIsSelectorOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-2.5 rounded-xl transition-all my-1 text-left",
                  isConsolidatedView
                    ? "bg-blue-50 border border-blue-200 text-blue-900 font-bold"
                    : "hover:bg-slate-50 text-slate-700"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Vue Consolidée (Groupe)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">100%</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Consolidation de gestion • 5 entités rattachées
                    </p>
                  </div>
                </div>
                {isConsolidatedView && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>

              <div className="my-2 border-t border-slate-100" />

              {/* Entities List */}
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Entités juridiques & SPVs</span>
                <span className="text-slate-400 font-normal">Détention</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {entities.map((ent) => {
                  const isSelected = currentEntityId === ent.id && !currentAssetId;
                  return (
                    <div key={ent.id} className="space-y-1">
                      <button
                        onClick={() => {
                          selectEntity(ent.id);
                          setIsSelectorOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-xl transition-all text-left",
                          isSelected
                            ? "bg-slate-100 border border-slate-300 font-semibold text-slate-900"
                            : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-medium text-slate-900 truncate block">
                              {ent.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {ent.country} • {ent.functionalCurrency} • {ent.operationalStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" size="sm">
                            {ent.ownershipPercentage}%
                          </Badge>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                      </button>

                      {/* Assets under this entity */}
                      {assets
                        .filter((a) => a.entityId === ent.id)
                        .map((asset) => {
                          const isAssetSelected = currentAssetId === asset.id;
                          return (
                            <button
                              key={asset.id}
                              onClick={() => {
                                selectEntity(ent.id);
                                selectAsset(asset.id);
                                setIsSelectorOpen(false);
                              }}
                              className={cn(
                                "w-full ml-4 flex items-center justify-between p-1.5 pl-3 rounded-lg text-left transition-all border-l-2",
                                isAssetSelected
                                  ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
                              )}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Box className="w-3 h-3 text-slate-400" />
                                <span className="text-[11px] truncate">{asset.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 px-1">{asset.type}</span>
                            </button>
                          );
                        })}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/group/structure"
                  onClick={() => setIsSelectorOpen(false)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Gérer la structure du groupe →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Title if supplied */}
        {title && (
          <div className="hidden md:block pl-3 border-l border-slate-200">
            <h1 className="text-sm font-bold text-slate-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Tools & Controls */}
      <div className="flex items-center gap-2">
        {/* Consolidation Currency Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setConsolidationCurrency("MAD")}
            className={cn(
              "px-2 py-1 rounded-md font-semibold text-[11px] transition-colors",
              consolidationCurrency === "MAD"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            MAD
          </button>
          <button
            onClick={() => setConsolidationCurrency("EUR")}
            className={cn(
              "px-2 py-1 rounded-md font-semibold text-[11px] transition-colors",
              consolidationCurrency === "EUR"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            EUR
          </button>
          <button
            onClick={() => setConsolidationCurrency("USD")}
            className={cn(
              "px-2 py-1 rounded-md font-semibold text-[11px] transition-colors",
              consolidationCurrency === "USD"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            USD
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden xl:flex items-center w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher entité, compte..."
            className="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-subtle"
          />
        </div>

        {/* Group Alerts Bell */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            aria-label="Alertes du groupe"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Group Alerts Dropdown */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-elevated border border-slate-200 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-900">Alertes Groupe Prioritaires</span>
                </div>
                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                  Marquer lu
                </span>
              </div>
              <div className="divide-y divide-slate-100 my-1">
                {groupAlerts.map((alt) => (
                  <div key={alt.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          alt.severity === "critical" ? "bg-rose-500" : "bg-amber-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">{alt.entity}</span>
                          <span className="text-[10px] text-slate-400">{alt.time}</span>
                        </div>
                        <p className="font-semibold text-slate-800 leading-tight mt-0.5">
                          {alt.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/group/intercompany"
                  onClick={() => setIsAlertsOpen(false)}
                  className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Résoudre les écarts intercompany →</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <Link href="/group/reports">
          <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Rapport Groupe
          </Button>
        </Link>
      </div>
    </header>
  );
}
