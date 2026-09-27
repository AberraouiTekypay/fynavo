import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | { type: "separator" })[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = "right",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-1.5 w-56 rounded-xl bg-white p-1 shadow-elevated border border-slate-200/90 text-xs transition-all animate-in fade-in zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, index) => {
            if ("type" in item && item.type === "separator") {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-slate-100"
                />
              );
            }

            const menuItem = item as DropdownItem;
            return (
              <button
                key={menuItem.id}
                role="menuitem"
                disabled={menuItem.disabled}
                onClick={() => {
                  if (!menuItem.disabled) {
                    menuItem.onClick?.();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 rounded-lg font-medium text-left transition-colors select-none",
                  menuItem.danger
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  menuItem.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  {menuItem.icon && (
                    <span className="w-4 h-4 text-slate-400 group-hover:text-slate-600">
                      {menuItem.icon}
                    </span>
                  )}
                  <span>{menuItem.label}</span>
                </div>
                {menuItem.shortcut && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {menuItem.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
