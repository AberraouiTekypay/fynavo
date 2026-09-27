import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "segmented" | "underline" | "pills";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "segmented",
  className,
}: TabsProps) {
  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        className={cn(
          "inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none",
                isActive
                  ? "bg-white text-slate-900 shadow-subtle border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50",
                tab.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold font-tabular",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div
        role="tablist"
        className={cn(
          "flex border-b border-slate-200 gap-6",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all select-none -mb-px",
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
                tab.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 font-tabular">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pills variant
  return (
    <div
      role="tablist"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all select-none",
              isActive
                ? "bg-[#0F172A] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200",
              tab.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-1 text-[10px] font-bold font-tabular opacity-80">
                ({tab.badge})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
