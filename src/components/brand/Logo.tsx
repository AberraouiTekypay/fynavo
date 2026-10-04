import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light" | "auto" | "white" | "dark-bg" | "light-bg";
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({
  variant = "light-bg",
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
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  // Determine if logo is rendered on dark background
  const onDark = variant === "dark" || variant === "white" || variant === "dark-bg";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Precision Geometric Convergence Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm",
          iconDimensions[size],
          onDark
            ? "bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 group-hover:border-blue-500/50 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]"
            : "bg-gradient-to-b from-[#0F172A] to-[#090D16] border border-slate-900/80 group-hover:border-blue-600/40 shadow-subtle"
        )}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-4/5 h-4/5 transition-transform duration-300 group-hover:scale-105"
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
                "font-black tracking-tight font-sans transition-colors",
                textSizes[size],
                onDark ? "text-white" : "text-slate-900"
              )}
            >
              Fynavo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5 inline-block shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
        </div>
      )}
    </div>
  );
}
