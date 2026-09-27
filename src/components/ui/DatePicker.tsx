import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  preset?: string;
  onPresetSelect?: (preset: string) => void;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  preset,
  onPresetSelect,
  className,
}: DatePickerProps) {
  const presets = [
    { id: "this_month", label: "Ce mois" },
    { id: "q1", label: "T1 2026" },
    { id: "q2", label: "T2 2026" },
    { id: "ytd", label: "Année en cours (YTD)" },
    { id: "13_weeks", label: "13 semaines" },
  ];

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 select-none">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <CalendarIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 font-medium"
          />
        </div>

        {onPresetSelect && (
          <div className="relative">
            <select
              value={preset || ""}
              onChange={(e) => onPresetSelect(e.target.value)}
              className="h-9 appearance-none rounded-lg border border-slate-300 bg-slate-50 pl-3 pr-7 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="" disabled>Période rapide</option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}
