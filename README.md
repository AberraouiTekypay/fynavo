# Fynavo — Financial Intelligence & Multi-Entity Cockpit

> **Plateforme de pilotage financier multi-entités et multi-actifs pour groupes, holdings, family offices et structures SPV.**

---

## 🎯 Vue d'ensemble

Fynavo permet aux CFOs, CEOs, directions financières et fonds d'investissement de répondre avec précision et clarté à la question centrale :
> **« Que se passe-t-il financièrement à l'échelle du groupe, et où se trouvent exactement les risques et les opportunités ? »**

Le système est **100% agnostique de l'industrie** (ni dédié à la restauration, ni au retail, ni à un secteur unique) et s'adapte aussi bien à :
- Des holdings d'animation & de participation
- Des groupes opérationnels multi-filiales
- Des structures d'investissement & family offices
- Des véhicules de projet / SPVs (énergie, immobilier, tech, infrastructure)
- Des organisations multi-pays et multi-devises (MAD, EUR, USD, GBP, XOF)

---

## 🏗️ Architecture Hiérarchique à 3 Niveaux

Fynavo structure la donnée financière sur 3 couches fluides et forables :

```text
Groupe / Holding (Consolidation de Gestion)
│
├── Entité Juridique / Filiale / SPV (Holding, Alpha, Beta, Gamma, Delta...)
│   │
│   └── Actif / Business Unit / Projet (Unités opérationnelles, chantiers, hubs)
│       │
│       └── Drivers & Transactions (Flux, factures, CCA, prêts, BFR)
```

### 1. Niveau Groupe (Consolidé)
Vue macro-financière consolidée : agrégation, retraitements, éliminations des flux interentreprises, trésorerie groupe vs liquidité mobilisable, prévisions de trésorerie à 13 semaines et allocation de liquidité.

### 2. Niveau Entité (Filiale / SPV)
P&L analytique, bilan, trésorerie réelle, endettement, covenants, CAPEX, budget vs réel, structure capitalistique (comptes courants d'associés - CCA, capital libéré).

### 3. Niveau Actif / Business Unit
Couche opérationnelle locale sous l'entité juridique pour suivre la rentabilité unitaire, l'allocation des coûts du siège et les projets d'investissement.

---

## ⚡ Fonctionnalités Clés du Module Multi-Entités

| Module | Route | Description & Capacités |
| :--- | :--- | :--- |
| **Cockpit Exécutif** | [`/group`](/group) | KPIs consolidés (CA, EBITDA, Cash, Dette nette, BFR), tableau de bord comparatif des filiales avec alertes de santé. |
| **Structure du Groupe** | [`/group/structure`](/group/structure) | Arbre visuel interactif, filtres par type/pays/statut, création d'entités, détention % et méthode de consolidation. |
| **Benchmarking & Santé** | [`/group/performance`](/group/performance) | Comparateur multidimensionnel et score de santé explicable sur 6 piliers (Rentabilité, Cash, BFR, Solvabilité, Budget, Qualité). |
| **Trésorerie & Mobilité** | [`/group/cash`](/group/cash) | Séparation stricte entre **Trésorerie Totale** et **Liquidité Réellement Mobilisable** (exclusion des minimums opérationnels et des fonds cantonnés/SPV). |
| **Prévisions 13 Semaines** | [`/group/forecast`](/group/forecast) | Grille dynamique consolidée W1-W13, détection automatique des entités en excédent vs déficit, arbitrage d'allocation de liquidité. |
| **Intercompany & Éliminations** | [`/group/intercompany`](/group/intercompany) | Détection automatique des écarts de réciprocité (ex: divergence 20 000 MAD), journal d'élimination des flux internes, matrice de croisement bilatérale. |
| **Dette & Structure Financière** | [`/group/debt`](/group/debt) | Échéancier consolidé, suivi des covenants bancaires (Dette/EBITDA, ICR), neutralisation des dettes intra-groupe, capitalisation et CCA. |
| **CAPEX & Investissements** | [`/group/capex`](/group/capex) | Pipeline d'engagements (30j, 90j, 12m), suivi par actif, état d'avancement et sources de financement. |
| **Budget Consolidé vs Réel** | [`/group/budget`](/group/budget) | Analyse des variances avec drill-down à 3 niveaux : Groupe → Catégorie → Entité contributrice. |
| **Moteur de Scénarios** | [`/group/scenarios`](/group/scenarios) | Stress-tests multi-variables (choc de revenus, dérive DSO, inflation salariale, nouvel emprunt, nouveau CAPEX) sur le cash et les ratios. |
| **Allocations & Management Fees** | [`/group/allocations`](/group/allocations) | Règles de refacturation du siège (clé CA, effectifs, fixe) et journal des redevances d'animation. |
| **Data Quality & Audit** | [`/group/health`](/group/health) | Score de fraîcheur des données, détection des périodes manquantes, journal d'audit des modifications et anomalies de consolidation. |
| **Rapports de Gestion** | [`/group/reports`](/group/reports) | Dossier financier mensuel complet en 13 sections, prêt à l'impression et à l'exportation. |

---

## 📊 Jeu de Données Démonstrateur (Atlas Alliance Group)

Le jeu de données intégré illustre un cas d'usage multi-filiales réaliste :

1. **Holding Company (100% MAD)** : Société mère d'animation, centralisant la trésorerie et facturant les frais de siège.
2. **Entité Alpha (100% MAD)** : Filiale historique mature et rentable, disposant d'un fort excédent de trésorerie (4,8 M MAD dont 3,6 M mobilisables).
3. **Entité Beta (80% EUR)** : Filiale en forte croissance mais en tension BFR (DSO à 88 jours, 6,4 M MAD de créances échues), entraînant un déficit de cash projeté à S4-S6.
4. **Entité Gamma (100% MAD)** : Filiale d'exploitation à faible marge (6,5%), engagée dans un plan d'investissement CAPEX de 3,8 M MAD.
5. **SPV Delta (60% USD)** : Véhicule de projet pré-opérationnel, financé par avance d'actionnaire / prêt intragroupe de 1,5 M MAD.

### Retraitements & Contrôles Validés :
- **Élimination de la dette intra-groupe** : Le prêt de 1,5 M MAD entre Holding et SPV Delta est neutralisé de la dette nette consolidée.
- **Élimination du chiffre d'affaires interne** : Les 1,05 M MAD de management fees refacturés par la Holding sont extournés du CA et des charges consolidées.
- **Arbitrage d'incohérence intercompany** : Écart de réciprocité de 20 000 MAD entre la créance déclarée par Alpha (500k MAD) et la dette enregistrée par Beta (480k MAD), avec modal de rapprochement et ajustement instantané.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 15 (App Router)](https://nextjs.org/)
- **Langage** : TypeScript 5.8
- **Styles** : Tailwind CSS v3.4 + Radix UI Primitives + Lucide Icons
- **Base de données** : Supabase PostgreSQL avec Row Level Security (RLS)
- **Migrations SQL** :
  - `00001_initial_schema.sql` (Schéma de base organisationnel)
  - `00002_multi_entity_group.sql` (Tables multi-entités, actifs, flux intercompany, éliminations, FX, dettes, capex, allocations)

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev

# Compilation de production & vérification des types
pnpm build
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour accéder au cockpit Fynavo.
Accédez au menu **PILOTAGE GROUPE** dans la barre latérale pour naviguer dans l'ensemble des modules consolidés.
