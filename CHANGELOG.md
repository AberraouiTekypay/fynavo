# Changelog — Fynavo
Toutes les modifications notables apportées à la plateforme Fynavo sont consignées dans ce document.

---

## [0.3.0] — 2026-10-04

### 🌐 Internationalisation Bilingue (EN / FR) & Formatage Financier Localisé
- **Moteur i18n Complet** :
  - Création de [`src/lib/i18n/LanguageContext.tsx`](file:///C:/fynavo/src/lib/i18n/LanguageContext.tsx) et du dictionnaire exhaustif [`src/lib/i18n/translations.ts`](file:///C:/fynavo/src/lib/i18n/translations.ts).
  - Bascule instantanée entre Anglais (EN) et Français (FR) avec persistance locale dans `localStorage` et synchronisation sur l'attribut racine `html[lang]`.
  - Formatage monétaire adaptatif (`formatMoney`) supportant les conventions de devises (MAD, EUR, USD, GBP, XOF) avec placement correct des symboles monétaires (`$`, `€`, `£`, `MAD`).
  - Formatage de pourcentages et de métriques financières avec préfixes de tendance explicites (`+` / `-`).

### ⌨️ Command Palette Globale (`⌘K` / `Ctrl+K`)
- **Accès Rapide Exécutif** :
  - Implémentation du composant modal [`src/components/command/CommandPalette.tsx`](file:///C:/fynavo/src/components/command/CommandPalette.tsx).
  - Raccourci clavier universel `⌘K` / `Ctrl+K` accessible sur toute l'application et déclenchement via le champ de recherche du header.
  - Recherche floue et navigation directe vers les 13 modules de pilotage, les entités du groupe (Holding, Alpha, Beta, Gamma, SPV Delta), et les actions système (changement de langue, sélection de devise de consolidation).

### 📈 Sparklines Vectorielles & Cartes KPI Haute Précision
- **Visualisation Vectorielle dans [`KPICard.tsx`](file:///C:/fynavo/src/components/ui/KPICard.tsx)** :
  - Intégration de mini sparklines SVG réactives avec calcul dynamique des points d'inflexion (min/max/amplitude).
  - Code couleur directionnel intelligent (vert pour hausse favorable, rouge pour dégradation, bleu neutre).
  - Typographie financière optimisée avec chiffres tabulaires (`tabular-nums`) évitant tout sautillement lors de mises à jour de métriques.

### 🎨 Design System Exécutif & Raffinement Visuel
- **Surfaces & Esthétique** :
  - Nouvelles classes utilitaires dans [`src/app/globals.css`](file:///C:/fynavo/src/app/globals.css) : `.glass-surface`, `.glass-dark`, `.card-accent-top`, `.hairline-border`, `.btn-sheen` et halos lumineux (`badge-glow-*`).
  - Extension de la palette dans [`tailwind.config.ts`](file:///C:/fynavo/tailwind.config.ts) (`fynavo.dark`, `fynavo.surface`, `fynavo.elevated`, ombres `card-hover` et `glow-*`).
  - Refonte du Header ([`src/components/layout/Header.tsx`](file:///C:/fynavo/src/components/layout/Header.tsx)) et de la Sidebar ([`src/components/layout/Sidebar.tsx`](file:///C:/fynavo/src/components/layout/Sidebar.tsx)) pour intégrer le sélecteur bilingue, l'indicateur d'environnement et les badges dynamiques.
  - Page d'accueil ([`src/app/page.tsx`](file:///C:/fynavo/src/app/page.tsx)) enrichie avec sélecteur de langue, dégradés d'ambiance et call-to-actions bilingues.
  - Déplacement de la mention « An EM300.co Company » exclusivement dans le footer (retrait du header).
  - Nettoyage des menus : retrait de l'entrée « Design System » de la sidebar, du header et de la Command Palette pour privilégier l'expérience métier financière.

### 🏛️ Traduction & Optimisation des 13 Modules de Pilotage Groupe
Mise à jour intégrale des interfaces pour exploiter le contexte de langue et le formatage unifié :
1. **Cockpit Exécutif** (`/group`)
2. **Structure du Groupe** (`/group/structure`)
3. **Benchmarking & Santé** (`/group/performance`)
4. **Trésorerie & Mobilité** (`/group/cash`)
5. **Prévisions 13 Semaines** (`/group/forecast`)
6. **Intercompany & Éliminations** (`/group/intercompany`)
7. **Dette & Capital Structure** (`/group/debt`)
8. **CAPEX & Investissements** (`/group/capex`)
9. **Budget Consolidé vs Réel** (`/group/budget`)
10. **Moteur de Scénarios** (`/group/scenarios`)
11. **Data Quality & Audit** (`/group/health`)
12. **Rapports de Gestion** (`/group/reports`)
13. **Allocations & Management Fees** (`/group/allocations`)

---

## [0.2.0] — 2026-09-27

### Sécurité & Dépendances
- Mise à niveau de Next.js vers la version `15.1.12` pour neutraliser les avis de sécurité CVE.
- Validation des 19 routes statiques en compilation de production.
- Ajout de la mention de marque « An EM300.co Company ».

---

## [0.1.0] — 2026-09-27

### Module Multi-Entités & Fondations
- Modèle de données hiérarchique à 3 niveaux : Groupe / Filiale / Actif.
- Migrations PostgreSQL Supabase avec Row-Level Security (`00001_initial_schema.sql`, `00002_multi_entity_group.sql`).
- Jeu de données démonstrateur réaliste *Atlas Alliance Group*.
- Moteur d'éliminations intercompany et arbitrage de réciprocité.
