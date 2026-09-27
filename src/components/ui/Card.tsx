import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  elevated?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function Card({
  className,
  elevated = false,
  title,
  subtitle,
  headerAction,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white text-slate-900 transition-all",
        elevated ? "shadow-elevated" : "shadow-subtle hover:shadow-card",
        className
      )}
      {...props}
    >
      {title || subtitle || headerAction ? (
        <div className="flex flex-col">
          <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100">
            <div>
              {title && (typeof title === "string" ? <CardTitle>{title}</CardTitle> : title)}
              {subtitle && (typeof subtitle === "string" ? <CardDescription className="mt-1">{subtitle}</CardDescription> : subtitle)}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
          <div className="p-5">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold text-slate-900 tracking-tight leading-none",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-500 font-normal leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-5 pt-0 border-t border-slate-100 mt-4",
        className
      )}
      {...props}
    />
  );
}
