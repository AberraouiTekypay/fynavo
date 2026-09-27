import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles, Shield, Database, Layout, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="hidden sm:inline-flex items-center text-xs text-slate-500 font-medium pl-3 border-l border-slate-200">
              An&nbsp;
              <a
                href="https://em300.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-800 hover:text-blue-600 hover:underline transition-colors"
              >
                EM300.co
              </a>
              &nbsp;Company
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/group">
              <Button variant="primary" size="sm" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
                Cockpit Multi-Entités
              </Button>
            </Link>
            <Link href="/design-system">
              <Button variant="secondary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}>
                Design System
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 mb-6 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
            An{" "}
            <a
              href="https://em300.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              EM300.co
            </a>{" "}
            Company
          </span>
          <Badge variant="navy" size="lg">
            Fynavo FinanceOS
          </Badge>
          <Badge variant="green" size="lg" dot>
            Sprint Multi-Entités Actif
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-2xl">
          Le cockpit financier intelligent des groupes et holdings.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">
          Pilotez vos filiales, SPVs et actifs en temps réel : consolidation de gestion, réconciliation intercompany, trésorerie mobilisable et prévisions 13 semaines.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/group">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Accéder à la Vue Groupe (/group)
            </Button>
          </Link>
          <Link href="/group/structure">
            <Button variant="secondary" size="lg">
              Arborescence du Groupe
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Design System B2B</h3>
            <p className="mt-1 text-xs text-slate-500">
              Composants financiers typés, palette officielle #0F172A, typographie Inter et densité contrôlée.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Multi-Tenant PostgreSQL</h3>
            <p className="mt-1 text-xs text-slate-500">
              32 tables financières avec RLS, audit logs, entreprises multiples et isolation des données.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Fractional CFO Ready</h3>
            <p className="mt-1 text-xs text-slate-500">
              App Shell avec switcher d&apos;entreprises, rôles granulaires et alertes financières temps réel.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 Fynavo. Tous droits réservés.</span>
          <span className="text-slate-600">
            An{" "}
            <a
              href="https://em300.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-900 hover:text-blue-600 hover:underline transition-colors"
            >
              em300.co
            </a>{" "}
            Company
          </span>
        </div>
      </footer>
    </div>
  );
}
