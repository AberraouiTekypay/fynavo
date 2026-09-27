import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from "lucide-react";
import { Badge, type BadgeProps } from "./Badge";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  change?: number; // e.g. +12.4 or -3.2 %
  changeLabel?: string; // e.g. "vs mois précédent", "vs budget"
  changeInverted?: boolean; // if positive change is bad (e.g. DSO, overdue AR, expenses)
  status?: "positive" | "negative" | "warning" | "neutral";
  badge?: string;
  badgeVariant?: BadgeProps["variant"];
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  subtitle,
  description,
  change,
  changeLabel,
  changeInverted = false,
  status,
  badge,
  badgeVariant = "blue",
  icon,
  tooltip,
  className,
  onClick,
}: KPICardProps) {
  // Determine trend color
  const isPositiveChange = change !== undefined ? (changeInverted ? change < 0 : change > 0) : null;
  const isNegativeChange = change !== undefined ? (changeInverted ? change > 0 : change < 0) : null;
  const displaySubtitle = description || subtitle;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-all",
        status === "positive" && "border-l-4 border-l-emerald-500",
        status === "negative" && "border-l-4 border-l-rose-500",
        status === "warning" && "border-l-4 border-l-amber-500",
        onClick && "cursor-pointer hover:border-slate-300",
        className
      )}
    >
      {/* Card Header: Title + Icon / Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {tooltip && (
            <span title={tooltip} className="text-slate-400 hover:text-slate-600 cursor-help">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          )}
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 group-hover:text-slate-800 transition-colors">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Main KPI Value */}
      <div className="flex items-baseline gap-2 my-1">
        <span className="text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight font-tabular">
          {value}
        </span>
      </div>

      {/* Card Footer: Trend + Subtitle */}
      {(change !== undefined || displaySubtitle) && (
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center font-semibold font-tabular px-1.5 py-0.5 rounded-md text-[11px]",
                isPositiveChange && "text-emerald-700 bg-emerald-50 border border-emerald-200/60",
                isNegativeChange && "text-rose-700 bg-rose-50 border border-rose-200/60",
                change === 0 && "text-slate-600 bg-slate-100"
              )}
            >
              {change > 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : change < 0 ? (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              ) : (
                <Minus className="w-3 h-3 mr-0.5" />
              )}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
          {changeLabel && <span className="text-slate-400">{changeLabel}</span>}
          {displaySubtitle && !changeLabel && <span className="text-slate-500">{displaySubtitle}</span>}
        </div>
      )}
    </div>
  );
}
