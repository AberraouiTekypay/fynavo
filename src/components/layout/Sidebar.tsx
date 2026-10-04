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
  ChevronDown,
  Building2,
  Layers,
  Check,
  Building,
  Languages,
} from "lucide-react";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

  const { t, locale, setLocale } = useLanguage();

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

  const navigationSections = [
    {
      group: t.nav.groupPilotage,
      items: [
        { name: t.nav.executiveCockpit, href: "/group", icon: LayoutDashboard },
        { name: t.nav.groupStructure, href: "/group/structure", icon: Network, badge: t.nav.treeBadge },
        { name: t.nav.performanceBenchmarking, href: "/group/performance", icon: BarChart3 },
        { name: t.nav.cashMobility, href: "/group/cash", icon: Wallet },
        { name: t.nav.forecast13Weeks, href: "/group/forecast", icon: CalendarRange, badge: t.nav.aiBadge },
        { name: t.nav.intercompanyEliminations, href: "/group/intercompany", icon: ArrowLeftRight, badge: t.nav.alertBadge },
        { name: t.nav.debtCapital, href: "/group/debt", icon: Landmark },
        { name: t.nav.capexPipeline, href: "/group/capex", icon: Hammer },
        { name: t.nav.consolidatedBudget, href: "/group/budget", icon: PieChart },
        { name: t.nav.scenarioEngine, href: "/group/scenarios", icon: GitBranch },
        { name: t.nav.healthAudit, href: "/group/health", icon: ShieldAlert },
        { name: t.nav.consolidatedReports, href: "/group/reports", icon: FileSpreadsheet, badge: t.nav.proBadge },
        { name: t.nav.allocationsFees, href: "/group/allocations", icon: Split },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-[#090D16] border-r border-white/[0.08] flex flex-col h-full text-slate-300 select-none z-20 shrink-0 shadow-2xl relative",
        className
      )}
    >
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.08] relative z-10">
        <Link href="/group" className="flex items-center">
          <Logo size="md" variant="dark-bg" />
        </Link>
        <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          v2.4 Pro
        </span>
      </div>

      {/* Group & Entity Context Switcher */}
      <div className="p-3 border-b border-white/[0.08] relative z-10" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-blue-500/40 hover:bg-slate-850 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  isConsolidatedView
                    ? "bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "bg-slate-800 text-slate-200 border border-white/10"
                )}
              >
                {isConsolidatedView ? (
                  <Layers className="w-3.5 h-3.5" />
                ) : (
                  <Building2 className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{isConsolidatedView ? group.name : currentEntity?.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isConsolidatedView
                    ? t.common.consolidated
                    : `${currentEntity?.country} • ${currentEntity?.ownershipPercentage}%`}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 group-hover:text-slate-200 transition-colors" />
          </button>

          {/* Switcher Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#0D1424] p-2 border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-xs z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.command.quickLinks}
              </div>

              {/* Group Consolidated Option */}
              <button
                onClick={() => {
                  selectEntity(null);
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-xl text-left transition-all my-0.5",
                  isConsolidatedView
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-semibold">{t.common.consolidated}</span>
                </div>
                {isConsolidatedView && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>

              <div className="my-1.5 border-t border-white/10" />

              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.command.entitiesSection}
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
                        "w-full flex items-center justify-between p-2 rounded-xl text-left transition-all",
                        isSelected
                          ? "bg-slate-800 text-white font-bold border border-white/15 shadow-sm"
                          : "text-slate-300 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ent.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-black/20">
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 relative z-10">
        {navigationSections.map((sec) => (
          <div key={sec.group} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-900/40 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-400"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge.includes("20K") || item.badge.includes("Alert") || item.badge.includes("Alerte")
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : item.badge.includes("AI") || item.badge.includes("IA")
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-slate-400 border border-white/10"
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

      {/* Footer / User Profile & Language Quick Switcher */}
      <div className="p-3 border-t border-white/[0.08] bg-[#070A12] text-xs relative z-10 space-y-2">
        {/* Language quick pill */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium">{locale === "en" ? "Language" : "Langue"}</span>
          </div>
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-white/10 text-[10px]">
            <button
              onClick={() => setLocale("en")}
              className={cn(
                "px-2 py-0.5 rounded font-bold transition-all",
                locale === "en"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("fr")}
              className={cn(
                "px-2 py-0.5 rounded font-bold transition-all",
                locale === "fr"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              )}
            >
              FR
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
              AB
            </div>
            <div className="truncate">
              <p className="font-semibold text-white text-xs truncate">Amine B.</p>
              <p className="text-[10px] text-slate-400">{t.header.userRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Connected" />
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          <a
            href="https://em300.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            An <span className="font-semibold text-slate-300">EM300.co</span> Company
          </a>
        </div>
      </div>
    </aside>
  );
}
