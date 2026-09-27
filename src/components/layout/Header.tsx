"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Search,
  UploadCloud,
  Menu,
  ChevronDown,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  const [isAlertsOpen, setIsAlertsOpen] = React.useState(false);
  const [selectedPeriod] = React.useState("Septembre 2026");

  const unreadAlerts = [
    {
      id: "a1",
      title: "Risque de tension de trésorerie (Semaine 9)",
      severity: "warning",
      time: "Il y a 20 min",
    },
    {
      id: "a2",
      title: "Créance client Atlas Distribution > 60j (165 K MAD)",
      severity: "critical",
      time: "Il y a 2h",
    },
    {
      id: "a3",
      title: "Clôture d'août validée avec Sage",
      severity: "info",
      time: "Hier",
    },
  ];

  return (
    <header
      className={cn(
        "h-16 border-b border-slate-200/90 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30",
        className
      )}
    >
      {/* Left: Mobile trigger & Page context */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Ouvrir le menu"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          {title && (
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Tools & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Period Selector */}
        <div className="relative hidden md:block">
          <button
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-subtle transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden xl:flex items-center w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher (comptes, clients, etc.)"
            className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-subtle"
          />
          <kbd className="absolute right-2.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            aria-label="Alertes financières"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Alerts dropdown */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-elevated border border-slate-200 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">
                  Alertes financières (3)
                </span>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Tout marquer comme lu
                </span>
              </div>
              <div className="divide-y divide-slate-100 my-1">
                {unreadAlerts.map((alt) => (
                  <div key={alt.id} className="py-2.5 hover:bg-slate-50 px-1 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          alt.severity === "critical"
                            ? "bg-rose-500"
                            : alt.severity === "warning"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 leading-tight">
                          {alt.title}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {alt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <a
                  href="/ai-cfo"
                  className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Analyser avec AI CFO</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action: Import */}
        <Link href="/import">
          <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>
            Importer
          </Button>
        </Link>
      </div>
    </header>
  );
}
