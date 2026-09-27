import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors select-none font-tabular",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
        default: "bg-slate-100 text-slate-700 border border-slate-200/80",
        slate: "bg-slate-100 text-slate-700 border border-slate-200/80",
        blue: "bg-blue-50 text-blue-700 border border-blue-200/60",
        green: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
        warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
        amber: "bg-amber-50 text-amber-700 border border-amber-200/60",
        danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
        rose: "bg-rose-50 text-rose-700 border border-rose-200/60",
        navy: "bg-[#0F172A] text-white border border-slate-900",
        outline: "border border-slate-200 text-slate-600 bg-white",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm font-semibold",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const dotColor = {
    neutral: "bg-slate-400",
    default: "bg-slate-400",
    slate: "bg-slate-400",
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    warning: "bg-amber-500",
    amber: "bg-amber-500",
    danger: "bg-rose-500",
    rose: "bg-rose-500",
    navy: "bg-white",
    outline: "bg-slate-400",
  }[variant || "neutral"];

  return (
    <div className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />}
      <span>{children}</span>
    </div>
  );
}
