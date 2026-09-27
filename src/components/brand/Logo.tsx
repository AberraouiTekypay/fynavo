import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light" | "auto" | "white";
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({
  variant = "light",
  iconOnly = false,
  size = "md",
  className,
}: LogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const isDark = variant === "dark";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Precision Geometric Convergence Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl shadow-sm transition-transform",
          iconDimensions[size],
          isDark
            ? "bg-slate-800 border border-slate-700/60"
            : "bg-[#0F172A] border border-slate-900"
        )}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Converging trajectory dynamic geometry */}
          <path
            d="M10 28L20 12L30 28L23 28L20 20L17 28H10Z"
            fill="url(#fynavoLogoGrad)"
          />
          {/* Predictive focus apex */}
          <circle cx="20" cy="11" r="2.8" fill="#10B981" />
          <defs>
            <linearGradient
              id="fynavoLogoGrad"
              x1="10"
              y1="12"
              x2="30"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span
              className={cn(
                "font-bold tracking-tight font-sans",
                textSizes[size],
                isDark ? "text-white" : "text-[#0F172A]"
              )}
            >
              Fynavo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-0.5 inline-block" />
          </div>
        </div>
      )}
    </div>
  );
}
