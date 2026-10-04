// src/lib/i18n/LanguageContext.tsx
"use client";

import * as React from "react";
import { Locale, Translations, translations } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  formatMoney: (val: number, currency?: string) => string;
  formatPercent: (val: number, decimals?: number) => string;
  formatNumber: (val: number) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en"); // Default to English as requested

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("fynavo_lang") as Locale | null;
      if (saved === "en" || saved === "fr") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        // Default to English as requested
        setLocaleState("en");
        document.documentElement.lang = "en";
      }
    } catch {
      // localStorage may fail in private mode or strict sandboxes
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("fynavo_lang", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignored
    }
  };

  const t = translations[locale];

  const formatMoney = React.useCallback(
    (val: number, currency?: string) => {
      const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        maximumFractionDigits: 0,
      }).format(val);

      if (!currency) return formatted;

      if (locale === "fr") {
        return `${formatted} ${currency}`;
      } else {
        if (currency === "USD") return `$${formatted}`;
        if (currency === "EUR") return `€${formatted}`;
        if (currency === "GBP") return `£${formatted}`;
        return `${currency} ${formatted}`;
      }
    },
    [locale]
  );

  const formatPercent = React.useCallback(
    (val: number, decimals = 1) => {
      const prefix = val > 0 ? "+" : "";
      const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(val);
      return `${prefix}${formatted}%`;
    },
    [locale]
  );

  const formatNumber = React.useCallback(
    (val: number) => {
      return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(val);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatMoney,
        formatPercent,
        formatNumber,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
