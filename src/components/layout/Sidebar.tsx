"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Wallet,
  CalendarRange,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  GitBranch,
  FileText,
  Bot,
  FolderOpen,
  Boxes,
  Settings,
  Sparkles,
  ChevronDown,
  Building,
  Check,
} from "lucide-react";

export interface Company {
  id: string;
  name: string;
  sector: string;
  currency: string;
  alertCount?: number;
}

const mockCompanies: Company[] = [
  { id: "c1", name: "Atlas Logistics", sector: "Transport & Logistique", currency: "MAD", alertCount: 3 },
  { id: "c2", name: "Casa Retail", sector: "Distribution & Retail", currency: "MAD", alertCount: 1 },
  { id: "c3", name: "Horizon Food", sector: "Agroalimentaire", currency: "MAD" },
  { id: "c4", name: "Nova Services", sector: "Tech & Services", currency: "MAD" },
];

const navigationItems = [
  {
    group: "VUE GLOBALE",
    items: [
      { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      { name: "Portefeuille", href: "/portfolio", icon: Briefcase, badge: "CFO Pro" },
      { name: "Entreprises", href: "/companies", icon: Building2 },
    ],
  },
  {
    group: "PILOTAGE FINANCIER",
    items: [
      { name: "Trésorerie", href: "/treasury", icon: Wallet },
      { name: "Prévisions 13s", href: "/forecast", icon: CalendarRange, badge: "IA" },
      { name: "Créances clients", href: "/receivables", icon: ArrowDownLeft },
      { name: "Dettes fournisseurs", href: "/payables", icon: ArrowUpRight },
      { name: "Budget vs Réalisé", href: "/budget", icon: PieChart },
      { name: "Moteur de scénarios", href: "/scenarios", icon: GitBranch },
    ],
  },
  {
    group: "INTELLIGENCE & REPORTING",
    items: [
      { name: "AI CFO Cockpit", href: "/ai-cfo", icon: Bot, badge: "AI" },
      { name: "Rapports DAF", href: "/reports", icon: FileText },
      { name: "Documents", href: "/documents", icon: FolderOpen },
      { name: "Intégrations", href: "/integrations", icon: Boxes },
    ],
  },
  {
    group: "SYSTÈME",
    items: [
      { name: "Design System", href: "/design-system", icon: Sparkles },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  currentCompanyId?: string;
  onCompanyChange?: (companyId: string) => void;
  className?: string;
}

export function Sidebar({
  currentCompanyId = "c1",
  onCompanyChange,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [selectedCompanyId, setSelectedCompanyId] = React.useState(currentCompanyId);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedCompany =
    mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];

  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    onCompanyChange?.(id);
    setIsCompanyDropdownOpen(false);
  };

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800/80 shrink-0 h-screen select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/70">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <Logo variant="dark" size="md" />
        </Link>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
          v1.0
        </span>
      </div>

      {/* Company Switcher */}
      <div className="p-3 border-b border-slate-800/60 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {selectedCompany.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {selectedCompany.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {selectedCompany.sector}
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </button>

        {/* Company Switcher Dropdown */}
        {isCompanyDropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50 text-xs">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Changer d&apos;entreprise
            </div>
            {mockCompanies.map((comp) => {
              const isSelected = comp.id === selectedCompany.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => handleSelectCompany(comp.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-blue-600/20 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{comp.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navigationItems.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.group}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User / Workspace Footer */}
      <div className="p-3 border-t border-slate-800/70">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              AB
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                Amine B.
              </div>
              <div className="text-[10px] text-blue-400 font-medium truncate">
                Fractional CFO
              </div>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            Pro
          </span>
        </div>
      </div>
    </aside>
  );
}
