"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  ArrowRight,
  Sparkles,
  Layout,
  Building2,
  Wallet,
  ArrowLeftRight,
  CalendarRange,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { t, locale, setLocale } = useLanguage();

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-white/[0.08] bg-[#070A12]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" variant="dark-bg" />
            <span className="hidden sm:inline-flex items-center text-xs text-slate-400 font-medium pl-3 border-l border-white/10">
              An&nbsp;
              <a
                href="https://em300.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-blue-400 transition-colors"
              >
                EM300.co
              </a>
              &nbsp;Company
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/[0.06] p-0.5 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setLocale("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  locale === "en"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("fr")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  locale === "fr"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                FR
              </button>
            </div>

            <Link href="/group">
              <Button
                variant="blue"
                size="sm"
                leftIcon={<Building2 className="w-3.5 h-3.5" />}
                className="shadow-md shadow-blue-600/30"
              >
                {t.home.ctaCockpit}
              </Button>
            </Link>

            <Link href="/design-system" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              >
                {locale === "en" ? "Design System" : "Design System"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Live Interactive Preview */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 mb-6 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.05] text-slate-300 border border-white/10 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.home.heroBadgeSprint}
          </span>
          <Badge variant="blue" size="md">
            {t.home.heroBadgeOS}
          </Badge>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Atlas Alliance Perimeter
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl">
          {t.home.heroTitle}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          {t.home.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/group">
            <Button
              variant="blue"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-xl shadow-blue-600/30 text-base px-6 py-3 font-bold"
            >
              {t.home.ctaCockpit}
            </Button>
          </Link>
          <Link href="/group/structure">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Layers className="w-4 h-4 text-blue-400" />}
              className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 text-base px-6 py-3"
            >
              {t.home.ctaStructure}
            </Button>
          </Link>
        </div>

        {/* Live Interactive Cockpit Terminal Preview */}
        <div className="mt-14 w-full rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0E17] border border-white/10 shadow-2xl p-6 sm:p-8 text-left relative overflow-hidden group">
          {/* Top terminal bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                cockpit.fynavo.internal • Atlas Alliance Group (MAD)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Consolidation Active
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.home.previewConsolidatedNet}
              </span>
              <div className="text-2xl font-black text-white mt-1 font-tabular">
                28 350 000 MAD
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                +8.4% YoY • Net of Eliminations
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.dashboard.kpiEbitda}
              </span>
              <div className="text-2xl font-black text-white mt-1 font-tabular">
                6 780 000 MAD
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                23.9% Consolidated Margin
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.dashboard.kpiCashDeployable}
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1 font-tabular">
                10 740 000 MAD
              </div>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">
                69.5% Mobility Ratio
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.home.previewIntercompanyZero}
              </span>
              <div className="text-2xl font-black text-blue-400 mt-1 font-tabular">
                -1 500 000 MAD
              </div>
              <span className="text-[11px] text-blue-300 font-semibold mt-1 inline-block">
                Intra-group loan eliminated
              </span>
            </div>
          </div>

          {/* Quick Peek Entity Matrix */}
          <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-black/20">
            <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{locale === "en" ? "Subsidiary Health Overview" : "Synthèse Santé Filiales"}</span>
              <span className="text-slate-400 text-[11px]">5 Entities Consolidated</span>
            </div>
            <div className="divide-y divide-white/[0.05] text-xs">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                    HOLD
                  </span>
                  <div>
                    <span className="font-bold text-white block">Atlas Holding Corp</span>
                    <span className="text-[10px] text-slate-400">Parent / 100% / Morocco (MAD)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-300">2.45M MAD Cash</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Healthy
                  </span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                    ALP
                  </span>
                  <div>
                    <span className="font-bold text-white block">Entity Alpha (Tech & Services)</span>
                    <span className="text-[10px] text-slate-400">Subsidiary / 100% / Cash Generator</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-emerald-400 font-bold">4.80M MAD Cash</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    High Surplus
                  </span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between bg-rose-500/[0.05]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-rose-600/30 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                    BET
                  </span>
                  <div>
                    <span className="font-bold text-white block">Entity Beta (Growth Hub)</span>
                    <span className="text-[10px] text-rose-300">Subsidiary / 80% / France (EUR) • High DSO</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-rose-400 font-bold">Deficit in W5 (-820K)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                    Cash Tension
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>{locale === "en" ? "Interactive mock live view." : "Vue de démonstration interactive."}</span>
            <Link
              href="/group"
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
            >
              <span>{locale === "en" ? "Enter Live Cockpit" : "Ouvrir le Cockpit"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 transition-all hover:bg-white/[0.05] group">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t.home.feature1Title}</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {t.home.feature1Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 transition-all hover:bg-white/[0.05] group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t.home.feature2Title}</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {t.home.feature2Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 transition-all hover:bg-white/[0.05] group">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t.home.feature3Title}</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {t.home.feature3Desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 transition-all hover:bg-white/[0.05] group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CalendarRange className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t.home.feature4Title}</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {t.home.feature4Desc}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070A12] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span>{t.home.footerText}</span>
          <span className="text-slate-400">
            An{" "}
            <a
              href="https://em300.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-blue-400 underline transition-colors"
            >
              EM300.co
            </a>{" "}
            Company
          </span>
        </div>
      </footer>
    </div>
  );
}
