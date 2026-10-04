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
  changeLabel?: string; // e.g. "vs previous month", "vs budget"
  changeInverted?: boolean; // if positive change is bad (e.g. DSO, overdue AR, expenses)
  status?: "positive" | "negative" | "warning" | "neutral";
  badge?: string;
  badgeVariant?: BadgeProps["variant"];
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
  sparklineData?: number[];
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
  sparklineData,
  onClick,
}: KPICardProps) {
  // Determine trend color
  const isPositiveChange = change !== undefined ? (changeInverted ? change < 0 : change > 0) : null;
  const isNegativeChange = change !== undefined ? (changeInverted ? change > 0 : change < 0) : null;
  const displaySubtitle = description || subtitle;

  // Mini sparkline SVG rendering
  const defaultSparkline = change !== undefined
    ? change >= 0
      ? [20, 24, 22, 28, 25, 32, 35, 40]
      : [40, 35, 36, 30, 26, 28, 22, 18]
    : [20, 25, 23, 28, 30, 27, 32, 34];
  
  const points = sparklineData || defaultSparkline;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const height = 24;
  const width = 64;

  const svgPoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  const strokeColor = isNegativeChange
    ? "#EF4444"
    : isPositiveChange
    ? "#10B981"
    : "#3B82F6";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 card-accent-top",
        status === "positive" && "border-l-4 border-l-emerald-500",
        status === "negative" && "border-l-4 border-l-rose-500",
        status === "warning" && "border-l-4 border-l-amber-500",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Top Header: Title + Tooltip & Icon / Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </span>
          {tooltip && (
            <span title={tooltip} className="text-slate-400 hover:text-slate-600 cursor-help shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          )}
          {icon && (
            <div className="p-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:text-blue-600 group-hover:bg-blue-50/60 group-hover:border-blue-100 transition-colors">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Main KPI Value + Sparkline */}
      <div className="flex items-end justify-between gap-3 my-1">
        <span className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight font-tabular">
          {value}
        </span>

        {/* Mini Sparkline Chart */}
        <div className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={svgPoints}
            />
          </svg>
        </div>
      </div>

      {/* Card Footer: Trend Badge + Subtitle */}
      {(change !== undefined || displaySubtitle) && (
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-2 pt-2.5 border-t border-slate-100">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center font-bold font-tabular px-2 py-0.5 rounded-md text-[11px]",
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
          {changeLabel && <span className="text-slate-400 text-[11px] font-medium">{changeLabel}</span>}
          {displaySubtitle && !changeLabel && (
            <span className="text-slate-500 text-[11px] truncate">{displaySubtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
