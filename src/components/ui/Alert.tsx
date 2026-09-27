import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";

export interface AlertProps {
  severity?: "info" | "warning" | "critical" | "success";
  title: string;
  explanation?: string;
  suggestedNextStep?: string;
  sourceMetric?: string;
  onAction?: () => void;
  actionLabel?: string;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Alert({
  severity = "info",
  title,
  explanation,
  suggestedNextStep,
  sourceMetric,
  onAction,
  actionLabel,
  onDismiss,
  className,
  children,
}: AlertProps) {
  const config = {
    info: {
      bg: "bg-blue-50/70 border-blue-200/80 text-blue-900",
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      accent: "text-blue-700 hover:text-blue-800",
      stepBg: "bg-blue-100/60 text-blue-800",
    },
    warning: {
      bg: "bg-amber-50/80 border-amber-200/80 text-amber-950",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      accent: "text-amber-800 hover:text-amber-900",
      stepBg: "bg-amber-100/80 text-amber-900",
    },
    critical: {
      bg: "bg-rose-50/80 border-rose-200/80 text-rose-950",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      accent: "text-rose-800 hover:text-rose-900",
      stepBg: "bg-rose-100/80 text-rose-900",
    },
    success: {
      bg: "bg-emerald-50/70 border-emerald-200/80 text-emerald-950",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      accent: "text-emerald-700 hover:text-emerald-800",
      stepBg: "bg-emerald-100/60 text-emerald-900",
    },
  }[severity];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex flex-col p-4 rounded-xl border shadow-subtle text-xs transition-all",
        config.bg,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {config.icon}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm leading-tight">
                {title}
              </span>
              {sourceMetric && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/70 border border-slate-200/60 text-slate-600 font-tabular">
                  {sourceMetric}
                </span>
              )}
            </div>

            {(explanation || children) && (
              <p className="mt-1 text-slate-700 leading-relaxed font-normal">
                {explanation || children}
              </p>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Fermer l'alerte"
            className="text-slate-400 hover:text-slate-700 rounded-md p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {suggestedNextStep && (
        <div
          className={cn(
            "mt-3 flex items-center justify-between gap-2 p-2.5 rounded-lg border border-black/5",
            config.stepBg
          )}
        >
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-bold text-[11px] uppercase tracking-wide opacity-80">
              Action recommandée :
            </span>
            <span>{suggestedNextStep}</span>
          </div>

          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className={cn(
                "inline-flex items-center gap-1 font-semibold text-xs transition-colors shrink-0",
                config.accent
              )}
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
