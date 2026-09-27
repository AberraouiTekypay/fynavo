import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      suffix,
      prefix,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <span className="absolute left-3 text-xs font-medium text-slate-500 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-subtle transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              error
                ? "border-rose-400 focus-visible:ring-rose-500"
                : "border-slate-300 hover:border-slate-400",
              leftIcon && "pl-9",
              prefix && "pl-11",
              rightIcon && "pr-9",
              suffix && "pr-14",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-xs font-semibold text-slate-500 pointer-events-none">
              {suffix}
            </span>
          )}
          {rightIcon && !suffix && (
            <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
