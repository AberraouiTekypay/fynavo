"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import {
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
  Sparkles,
  Settings,
  ChevronDown,
  Building2,
  Layers,
  Check,
  Building,
} from "lucide-react";
import { useGroup } from "@/lib/group/GroupContext";

const groupNavigation = [
  {
    group: "PILOTAGE GROUPE",
    items: [
      { name: "Vue Groupe", href: "/group", icon: LayoutDashboard },
      { name: "Structure du groupe", href: "/group/structure", icon: Network, badge: "Arborescence" },
      { name: "Performance & Comparaison", href: "/group/performance", icon: BarChart3 },
      { name: "Trésorerie & Mobilité", href: "/group/cash", icon: Wallet },
      { name: "Prévisions 13 semaines", href: "/group/forecast", icon: CalendarRange, badge: "IA" },
      { name: "Intercompany & Éliminations", href: "/group/intercompany", icon: ArrowLeftRight, badge: "Alerte 20K" },
      { name: "Dette Financière", href: "/group/debt", icon: Landmark },
      { name: "CAPEX Pipeline", href: "/group/capex", icon: Hammer },
      { name: "Budget Consolidé", href: "/group/budget", icon: PieChart },
      { name: "Moteur de Scénarios", href: "/group/scenarios", icon: GitBranch },
      { name: "Santé & Qualité Données", href: "/group/health", icon: ShieldAlert },
      { name: "Rapports Consolidés", href: "/group/reports", icon: FileSpreadsheet, badge: "CFO Pro" },
      { name: "Allocations & Frais", href: "/group/allocations", icon: Split },
    ],
  },
  {
    group: "SYSTÈME & FONDATIONS",
    items: [
      { name: "Design System", href: "/design-system", icon: Sparkles },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const {
    group,
    entities,
    currentEntityId,
    currentEntity,
    isConsolidatedView,
    selectEntity,
  } = useGroup();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className={cn(
        "w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col h-full text-slate-300 select-none z-20 shrink-0",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/group">
          <Logo size="md" variant="light" />
        </Link>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
          v0.2 Group
        </span>
      </div>

      {/* Group & Entity Context Switcher */}
      <div className="p-3 border-b border-slate-800/80" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 transition-all text-left shadow-sm"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  isConsolidatedView
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-200"
                )}
              >
                {isConsolidatedView ? (
                  <Layers className="w-3.5 h-3.5" />
                ) : (
                  <Building2 className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {isConsolidatedView ? group.name : currentEntity?.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isConsolidatedView
                    ? "Vue consolidée groupe"
                    : `${currentEntity?.country} • ${currentEntity?.ownershipPercentage}%`}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Switcher Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl bg-[#1E293B] p-2 border border-slate-700 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Périmètre d&apos;analyse
              </div>

              {/* Group Consolidated Option */}
              <button
                onClick={() => {
                  selectEntity(null);
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors my-0.5",
                  isConsolidatedView
                    ? "bg-blue-600/30 text-blue-200 font-semibold border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Vue Consolidée (Groupe)</span>
                </div>
                {isConsolidatedView && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              </button>

              <div className="my-1.5 border-t border-slate-700/60" />

              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Entités & SPVs
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                {entities.map((ent) => {
                  const isSelected = currentEntityId === ent.id;
                  return (
                    <button
                      key={ent.id}
                      onClick={() => {
                        selectEntity(ent.id);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                        isSelected
                          ? "bg-slate-700 text-white font-semibold"
                          : "text-slate-300 hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ent.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ent.ownershipPercentage}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groupNavigation.map((sec) => (
          <div key={sec.group} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {sec.group}
            </h3>
            <div className="space-y-0.5 pt-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.2 rounded font-medium",
                          isActive
                            ? "bg-blue-700 text-blue-100"
                            : item.badge.includes("20K")
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700/60"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile & Holding Link */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
              AB
            </div>
            <div className="truncate">
              <p className="font-semibold text-slate-200 truncate">Amine B.</p>
              <p className="text-[10px] text-slate-500">DAF Groupe / CFO</p>
            </div>
          </div>
          <Link
            href="/settings"
            aria-label="Paramètres"
            className="text-slate-400 hover:text-white"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-2 text-center text-[10px] text-slate-500">
          <a
            href="https://em300.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            An <span className="font-semibold text-slate-400">EM300.co</span> Company
          </a>
        </div>
      </div>
    </aside>
  );
}
