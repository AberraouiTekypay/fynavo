"use client";

import * as React from "react";
import {
  Group,
  Entity,
  AssetOrProject,
  IntercompanyTransaction,
  EliminationEntry,
  CurrencyCode,
  ReconciliationStatus,
} from "./types";
import {
  DEMO_GROUP,
  DEMO_ENTITIES,
  DEMO_ASSETS,
  DEMO_INTERCOMPANY_TRANSACTIONS,
  DEMO_ELIMINATIONS,
} from "./demo-data";
import { financialEngine, ConsolidatedSummary } from "./financial-engine";

interface GroupContextValue {
  group: Group;
  entities: Entity[];
  assets: AssetOrProject[];
  currentEntityId: string | null; // null => Consolidated group view
  currentEntity: Entity | null;
  currentAssetId: string | null;
  currentAsset: AssetOrProject | null;
  isConsolidatedView: boolean;
  consolidationCurrency: CurrencyCode;
  transactions: IntercompanyTransaction[];
  eliminations: EliminationEntry[];
  consolidatedSummary: ConsolidatedSummary;
  // Actions
  selectEntity: (id: string | null) => void;
  selectAsset: (id: string | null) => void;
  setConsolidationCurrency: (currency: CurrencyCode) => void;
  addEntity: (newEntity: Partial<Entity>) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  reconcileTransaction: (id: string, status: ReconciliationStatus, notes?: string) => void;
  addIntercompanyTransaction: (tx: Partial<IntercompanyTransaction>) => void;
}

const GroupContext = React.createContext<GroupContextValue | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [group] = React.useState<Group>(DEMO_GROUP);
  const [entities, setEntities] = React.useState<Entity[]>(DEMO_ENTITIES);
  const [assets] = React.useState<AssetOrProject[]>(DEMO_ASSETS);
  const [currentEntityId, setCurrentEntityId] = React.useState<string | null>(null);
  const [currentAssetId, setCurrentAssetId] = React.useState<string | null>(null);
  const [consolidationCurrency, setConsolidationCurrency] = React.useState<CurrencyCode>("MAD");
  const [transactions, setTransactions] = React.useState<IntercompanyTransaction[]>(
    DEMO_INTERCOMPANY_TRANSACTIONS
  );
  const [eliminations] = React.useState<EliminationEntry[]>(DEMO_ELIMINATIONS);

  const currentEntity = React.useMemo(() => {
    if (!currentEntityId) return null;
    return entities.find((e) => e.id === currentEntityId) || null;
  }, [currentEntityId, entities]);

  const currentAsset = React.useMemo(() => {
    if (!currentAssetId) return null;
    return assets.find((a) => a.id === currentAssetId) || null;
  }, [currentAssetId, assets]);

  const isConsolidatedView = currentEntityId === null;

  const consolidatedSummary = React.useMemo(() => {
    return financialEngine.calculateConsolidatedSummary(entities, transactions, consolidationCurrency);
  }, [entities, transactions, consolidationCurrency]);

  const selectEntity = (id: string | null) => {
    setCurrentEntityId(id);
    setCurrentAssetId(null);
  };

  const selectAsset = (id: string | null) => {
    setCurrentAssetId(id);
  };

  const addEntity = (newEntity: Partial<Entity>) => {
    const id = `ent_${Date.now()}`;
    const fullEntity: Entity = {
      id,
      groupId: group.id,
      parentId: newEntity.parentId || "ent_holding",
      name: newEntity.name || "Nouvelle Entité",
      legalName: newEntity.legalName || newEntity.name || "Société Nouvelle",
      code: newEntity.code || `ENT-${entities.length + 1}`,
      type: newEntity.type || "subsidiary",
      country: newEntity.country || "Maroc",
      functionalCurrency: newEntity.functionalCurrency || "MAD",
      reportingCurrency: "MAD",
      ownershipPercentage: newEntity.ownershipPercentage ?? 100,
      consolidationMethod: newEntity.consolidationMethod || "full",
      operationalStatus: newEntity.operationalStatus || "operating",
      legalStatus: "active",
      sector: newEntity.sector || "Services Divers",
      description: newEntity.description || "Nouvelle entité rattachée au groupe",
      financials: {
        revenue: 0,
        ebitda: 0,
        ebitdaMargin: 0,
        cash: 100000,
        operationalMinimum: 50000,
        deployableCash: 50000,
        grossDebt: 0,
        netDebt: -100000,
        workingCapital: 0,
        dso: 30,
        dpo: 30,
        arOverdue: 0,
        apBalance: 0,
        capexCommitted: 0,
        budgetVariancePct: 0,
        runwayMonths: 12,
        cashTrendWeekly: new Array(13).fill(100),
      },
      healthPillars: {
        liquidity: { status: "healthy", reason: "Entité nouvellement créée" },
        profitability: { status: "insufficient_data", reason: "Historique en cours de constitution" },
        workingCapital: { status: "healthy", reason: "Aucun arriéré" },
        budgetControl: { status: "healthy", reason: "Démarrage d'activité" },
        debtSolvency: { status: "healthy", reason: "Aucun passif bancaire" },
        dataQuality: { status: "watch", reason: "Premier import attendu" },
      },
      dataQuality: {
        lastUpdate: new Date().toISOString().split("T")[0],
        missingPeriodsCount: 0,
        unmatchedIntercompanyCount: 0,
        bankFeedConnected: false,
        budgetConfigured: false,
        freshnessScorePct: 100,
      },
    };
    setEntities((prev) => [...prev, fullEntity]);
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const reconcileTransaction = (id: string, status: ReconciliationStatus, notes?: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            reconciliationNotes: notes || t.reconciliationNotes,
            discrepancyAmount: status === "matched" || status === "eliminated" ? 0 : t.discrepancyAmount,
          };
        }
        return t;
      })
    );
  };

  const addIntercompanyTransaction = (tx: Partial<IntercompanyTransaction>) => {
    const id = `ict_${Date.now()}`;
    const newTx: IntercompanyTransaction = {
      id,
      groupId: group.id,
      sourceEntityId: tx.sourceEntityId || "ent_holding",
      targetEntityId: tx.targetEntityId || "ent_alpha",
      type: tx.type || "management_fee",
      amount: tx.amount || 100000,
      currency: tx.currency || "MAD",
      convertedAmountMAD: tx.amount || 100000,
      date: tx.date || new Date().toISOString().split("T")[0],
      period: tx.period || "2026-09",
      description: tx.description || "Nouvelle transaction intercompany",
      status: tx.status || "matched",
      isRecurring: tx.isRecurring || false,
      reconciliationNotes: tx.reconciliationNotes,
      discrepancyAmount: 0,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <GroupContext.Provider
      value={{
        group,
        entities,
        assets,
        currentEntityId,
        currentEntity,
        currentAssetId,
        currentAsset,
        isConsolidatedView,
        consolidationCurrency,
        transactions,
        eliminations,
        consolidatedSummary,
        selectEntity,
        selectAsset,
        setConsolidationCurrency,
        addEntity,
        updateEntity,
        reconcileTransaction,
        addIntercompanyTransaction,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const ctx = React.useContext(GroupContext);
  if (!ctx) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return ctx;
}
