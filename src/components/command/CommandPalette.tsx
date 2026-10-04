// src/components/command/CommandPalette.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Search,
  LayoutDashboard,
  Network,
  BarChart3,
  Wallet,
  CalendarRange,
  ArrowLeftRight,
  Landmark,
  Hammer,
  PieChart,
  GitBranch,
  ShieldAlert,
  FileSpreadsheet,
  Split,
  Building2,
  ArrowUpRight,
  X,
  Languages,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { entities, selectEntity } = useGroup();
  const { t, locale, setLocale } = useLanguage();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modules = [
    { title: t.nav.executiveCockpit, href: "/group", icon: LayoutDashboard, category: t.command.modulesSection },
    { title: t.nav.groupStructure, href: "/group/structure", icon: Network, category: t.command.modulesSection },
    { title: t.nav.performanceBenchmarking, href: "/group/performance", icon: BarChart3, category: t.command.modulesSection },
    { title: t.nav.cashMobility, href: "/group/cash", icon: Wallet, category: t.command.modulesSection },
    { title: t.nav.forecast13Weeks, href: "/group/forecast", icon: CalendarRange, category: t.command.modulesSection },
    { title: t.nav.intercompanyEliminations, href: "/group/intercompany", icon: ArrowLeftRight, category: t.command.modulesSection },
    { title: t.nav.debtCapital, href: "/group/debt", icon: Landmark, category: t.command.modulesSection },
    { title: t.nav.capexPipeline, href: "/group/capex", icon: Hammer, category: t.command.modulesSection },
    { title: t.nav.consolidatedBudget, href: "/group/budget", icon: PieChart, category: t.command.modulesSection },
    { title: t.nav.scenarioEngine, href: "/group/scenarios", icon: GitBranch, category: t.command.modulesSection },
    { title: t.nav.healthAudit, href: "/group/health", icon: ShieldAlert, category: t.command.modulesSection },
    { title: t.nav.consolidatedReports, href: "/group/reports", icon: FileSpreadsheet, category: t.command.modulesSection },
    { title: t.nav.allocationsFees, href: "/group/allocations", icon: Split, category: t.command.modulesSection },
  ];

  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEntities = entities.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.code.toLowerCase().includes(query.toLowerCase()) ||
      e.country.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleEntitySelect = (entityId: string) => {
    selectEntity(entityId);
    router.push("/group");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Palette Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-100 bg-slate-50/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.command.placeholder}
            className="w-full h-14 pl-3 pr-8 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions / Language toggle */}
          {!query && (
            <div className="px-2 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.command.quickLinks}
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setLocale(locale === "en" ? "fr" : "en");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                      {locale === "en" ? "Passer en Français" : "Switch to English"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {locale === "en" ? "Langue française" : "English language"}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    selectEntity(null);
                    router.push("/group");
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600">
                      {t.common.consolidated}
                    </div>
                    <div className="text-[10px] text-slate-400">Atlas Alliance Group</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Entities Section */}
          {filteredEntities.length > 0 && (
            <div className="px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.command.entitiesSection}
              </span>
              <div className="mt-1 space-y-1">
                {filteredEntities.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => handleEntitySelect(ent.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {ent.code}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                          {ent.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ent.country} • {ent.functionalCurrency} • {ent.ownershipPercentage}%
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modules Section */}
          {filteredModules.length > 0 && (
            <div className="px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.command.modulesSection}
              </span>
              <div className="mt-1 space-y-1">
                {filteredModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={mod.href}
                      onClick={() => navigateTo(mod.href)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-200/80 text-slate-500 flex items-center justify-center shrink-0 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-800 group-hover:text-blue-600">
                          {mod.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mod.href}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredEntities.length === 0 && filteredModules.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              {t.command.noResults}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{t.command.tipEsc}</span>
          <span className="font-mono text-[10px]">Fynavo QuickCommand</span>
        </div>
      </div>
    </div>
  );
}
