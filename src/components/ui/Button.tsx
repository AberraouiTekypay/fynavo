import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0F172A] text-white hover:bg-slate-800 shadow-sm border border-slate-900 active:bg-slate-950",
        blue:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10 active:bg-blue-800",
        secondary:
          "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-subtle active:bg-slate-100",
        outline:
          "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        danger:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:bg-rose-800",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:bg-emerald-800",
        link:
          "text-blue-600 underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
        md: "h-9 px-4 text-sm rounded-lg gap-2",
        lg: "h-11 px-5 text-base rounded-xl gap-2.5",
        icon: "h-9 w-9 p-0 rounded-lg",
        "icon-sm": "h-7 w-7 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
