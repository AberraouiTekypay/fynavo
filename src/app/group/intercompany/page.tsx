"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { useGroup } from "@/lib/group/GroupContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { IntercompanyType } from "@/lib/group/types";
import {
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function IntercompanyPage() {
  const {
    entities,
    transactions,
    eliminations,
    reconcileTransaction,
    addIntercompanyTransaction,
    consolidationCurrency,
  } = useGroup();

  const { t, locale, formatMoney } = useLanguage();

  const [activeTab, setActiveTab] = React.useState("reconciliation");
  const [selectedTxForAction, setSelectedTxForAction] = React.useState<string | null>(null);
  const [actionType, setActionType] = React.useState<"match" | "adjust" | "explain" | null>(null);
  const [adjustmentNote, setAdjustmentNote] = React.useState("");

  // Add Transaction Modal
  const [isAddTxOpen, setIsAddTxOpen] = React.useState(false);
  const [newSource, setNewSource] = React.useState("ent_holding");
  const [newTarget, setNewTarget] = React.useState("ent_alpha");
  const [newType, setNewType] = React.useState<IntercompanyType>("management_fee");
  const [newAmount, setNewAmount] = React.useState(150000);
  const [newCurrency, setNewCurrency] = React.useState("MAD");
  const [newDescription, setNewDescription] = React.useState("");

  const getEntityName = (id: string) => {
    return entities.find((e) => e.id === id)?.name || id;
  };

  const getEntityCode = (id: string) => {
    return entities.find((e) => e.id === id)?.code || id;
  };

  // Filter transactions with discrepancies
  const discrepancyTransactions = transactions.filter(
    (t) => (t.discrepancyAmount || 0) > 0 || t.status === "partial_match" || t.status === "review_required"
  );

  const handleActionSubmit = () => {
    if (!selectedTxForAction || !actionType) return;
    if (actionType === "match") {
      reconcileTransaction(selectedTxForAction, "matched", locale === "en" ? "Manually matched by CFO" : "Rapproché manuellement par le CFO");
    } else if (actionType === "adjust") {
      reconcileTransaction(
        selectedTxForAction,
        "matched",
        adjustmentNote || (locale === "en" ? "Accounting regularization adjustment confirmed" : "Ajustement comptable de régularisation validé")
      );
    } else if (actionType === "explain") {
      reconcileTransaction(
        selectedTxForAction,
        "review_required",
        adjustmentNote || (locale === "en" ? "CFO justification documented" : "Explication CFO enregistrée")
      );
    }
    setSelectedTxForAction(null);
    setActionType(null);
    setAdjustmentNote("");
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    addIntercompanyTransaction({
      sourceEntityId: newSource,
      targetEntityId: newTarget,
      type: newType,
      amount: Number(newAmount),
      currency: newCurrency,
      description: newDescription || (locale === "en" ? "Intra-group intercompany transaction" : "Transaction intercompany intra-groupe"),
      status: "matched",
    });

    setIsAddTxOpen(false);
    setNewDescription("");
  };

  return (
    <AppShell
      title={t.nav.intercompanyEliminations}
      subtitle={locale === "en" ? "Reciprocal transaction matching, discrepancy control, and consolidation elimination journals" : "Réconciliation des flux réciproques, contrôle des écarts et éliminations de consolidation"}
    >
      {/* Top Banner Alert on Mismatch */}
      {discrepancyTransactions.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-accent-top">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-950">
                  {t.dashboard.discrepancyAlertTitle}
                </span>
                <Badge variant="rose" size="sm" dot>
                  {locale === "en" ? "Action Required" : "Action Requise"}
                </Badge>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-3xl">
                {t.dashboard.discrepancyAlertDesc}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedTxForAction(discrepancyTransactions[0].id);
              setActionType("adjust");
            }}
            className="shadow-sm"
          >
            {locale === "en" ? "Arbitrate Gap (20,000 MAD)" : "Arbitrer l'écart (20 K MAD)"}
          </Button>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: "reconciliation", label: `${locale === "en" ? "Reconciliations & Mismatches" : "Réconciliations & Écarts"} (${discrepancyTransactions.length})` },
            { id: "all_transactions", label: `${locale === "en" ? "All Transactions" : "Toutes les Transactions"} (${transactions.length})` },
            { id: "eliminations", label: `${locale === "en" ? "Elimination Journal" : "Table des Éliminations"} (${eliminations.length})` },
            { id: "matrix", label: locale === "en" ? "Bilateral Matrix" : "Matrice des Soldes Croisés" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsAddTxOpen(true)}
          className="shadow-2xs"
        >
          {locale === "en" ? "New Intercompany Entry" : "Nouvelle transaction intercompany"}
        </Button>
      </div>

      {/* TAB 1: RECONCILIATIONS & DISCREPANCIES */}
      {activeTab === "reconciliation" && (
        <Card
          title={locale === "en" ? "Reciprocal Reconciliations & Timing Differences" : "Écarts de Rapprochement Réciproques"}
          subtitle={locale === "en" ? "Automated matching of source entity receivables vs recipient entity payables" : "Comparaison automatique des créances de l'entité source vs les dettes de l'entité réceptrice"}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{locale === "en" ? "Ref / Period" : "Réf / Date"}</TableHead>
                  <TableHead>{locale === "en" ? "Source (Receivable)" : "Entité Émettrice (Créance)"}</TableHead>
                  <TableHead>{locale === "en" ? "Recipient (Payable)" : "Entité Réceptrice (Dette)"}</TableHead>
                  <TableHead>{locale === "en" ? "Transaction Type" : "Nature du Flux"}</TableHead>
                  <TableHead align="right">{locale === "en" ? "Stated Amount" : "Montant Déclaré"}</TableHead>
                  <TableHead align="right">{locale === "en" ? "Discrepancy" : "Écart Constaté"}</TableHead>
                  <TableHead align="center">{locale === "en" ? "Status" : "Statut"}</TableHead>
                  <TableHead align="right">{locale === "en" ? "CFO Actions" : "Actions CFO"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const hasGap = (tx.discrepancyAmount || 0) > 0;
                  return (
                    <TableRow key={tx.id} className={hasGap ? "bg-amber-50/50" : ""}>
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-slate-900 block">{tx.id}</span>
                        <span className="text-[10px] text-slate-400">{tx.date} ({tx.period})</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-slate-900 block">{getEntityName(tx.sourceEntityId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Current Asset (4411)</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-slate-900 block">{getEntityName(tx.targetEntityId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Group Liability (1481)</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" size="sm">
                          {tx.type.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                        {formatMoney(tx.amount)} {tx.currency}
                      </TableCell>

                      <TableCell align="right" className="font-mono font-tabular">
                        {hasGap ? (
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            +{formatMoney(tx.discrepancyAmount || 0)} MAD
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-xs font-semibold">0 MAD ({locale === "en" ? "Balanced" : "Parfait"})</span>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        {tx.status === "matched" ? (
                          <Badge variant="green" dot>{locale === "en" ? "Matched" : "Rapproché"}</Badge>
                        ) : tx.status === "eliminated" ? (
                          <Badge variant="blue" dot>{locale === "en" ? "Eliminated" : "Éliminé"}</Badge>
                        ) : tx.status === "partial_match" ? (
                          <Badge variant="rose" dot>{locale === "en" ? "20K Mismatch" : "Écart 20K"}</Badge>
                        ) : (
                          <Badge variant="amber" dot>{locale === "en" ? "Review Required" : "À réviser"}</Badge>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasGap ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setSelectedTxForAction(tx.id);
                                  setActionType("adjust");
                                }}
                              >
                                {locale === "en" ? "Adjust" : "Ajuster"}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setSelectedTxForAction(tx.id);
                                  setActionType("explain");
                                }}
                              >
                                {locale === "en" ? "Justify" : "Justifier"}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-slate-500"
                              onClick={() => {
                                reconcileTransaction(tx.id, "eliminated");
                              }}
                            >
                              {locale === "en" ? "Eliminate" : "Valider"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* TAB 2: ALL TRANSACTIONS */}
      {activeTab === "all_transactions" && (
        <Card
          title={locale === "en" ? "Full Intra-Group Transaction Ledger" : "Registre Intégral des Opérations Intra-Groupe"}
          subtitle={locale === "en" ? "History of cash advances, recharged fees, and shared service royalties" : "Historique des flux de trésorerie, refacturations et honoraires de gestion"}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>{locale === "en" ? "Debtor / Source" : "Origine (Débiteur)"}</TableHead>
                  <TableHead>{locale === "en" ? "Beneficiary / Target" : "Destination (Bénéficiaire)"}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead align="right">{locale === "en" ? "Amount" : "Montant"}</TableHead>
                  <TableHead align="center">{locale === "en" ? "Recurring" : "Récurrent"}</TableHead>
                  <TableHead align="center">{locale === "en" ? "Consolidation Treatment" : "Traitement Consolidation"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-700">
                      {tx.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {getEntityName(tx.sourceEntityId)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {getEntityName(tx.targetEntityId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" size="sm">
                        {tx.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs max-w-xs truncate">
                      {tx.description}
                    </TableCell>
                    <TableCell align="right" className="font-mono font-bold text-slate-900 font-tabular">
                      {formatMoney(tx.amount)} {tx.currency}
                    </TableCell>
                    <TableCell align="center">
                      {tx.isRecurring ? (
                        <span className="text-[11px] font-semibold text-blue-600">{locale === "en" ? "Yes (Monthly)" : "Oui (Mensuel)"}</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">{locale === "en" ? "One-off" : "Ponctuel"}</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant={tx.status === "eliminated" ? "blue" : "slate"} size="sm">
                        {tx.status === "eliminated" ? "Eliminated 100%" : "Pending Neutralization"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* TAB 3: CONSOLIDATION ELIMINATIONS TABLE */}
      {activeTab === "eliminations" && (
        <Card
          title={locale === "en" ? "Consolidation Elimination Journal Entries" : "Écritures d'Élimination de Consolidation"}
          subtitle={locale === "en" ? "P&L and Balance Sheet reciprocal elimination ledger" : "Journal des écritures de neutralisation du P&L et du Bilan consolidé"}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{locale === "en" ? "Elimination Code" : "Code Élimination"}</TableHead>
                  <TableHead>{locale === "en" ? "Period" : "Période"}</TableHead>
                  <TableHead>{locale === "en" ? "Neutralized Accounts" : "Comptes Comptables Neutralisés"}</TableHead>
                  <TableHead>{locale === "en" ? "Joint Entities" : "Périmètre / Entités Conjointes"}</TableHead>
                  <TableHead align="right">{locale === "en" ? `Debit (${consolidationCurrency})` : `Débit (${consolidationCurrency})`}</TableHead>
                  <TableHead align="right">{locale === "en" ? `Credit (${consolidationCurrency})` : `Crédit (${consolidationCurrency})`}</TableHead>
                  <TableHead align="center">{locale === "en" ? "Status" : "Statut"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eliminations.map((elm) => (
                  <TableRow key={elm.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-800">
                      {elm.id}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {elm.period}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900 block text-xs">
                        {elm.account}
                      </span>
                      <span className="text-[11px] text-slate-400">{elm.notes}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {getEntityCode(elm.sourceEntityId)} ↔ {elm.targetEntityId}
                    </TableCell>
                    <TableCell align="right" className="font-mono font-bold text-blue-600 font-tabular">
                      {formatMoney(elm.debit)}
                    </TableCell>
                    <TableCell align="right" className="font-mono font-bold text-emerald-600 font-tabular">
                      {formatMoney(elm.credit)}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="blue" dot>
                        {locale === "en" ? "Eliminated" : "Éliminé"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* TAB 4: INTERCOMPANY MATRIX VIEW */}
      {activeTab === "matrix" && (
        <Card
          title={locale === "en" ? "Bilateral Reciprocal Balance Cross-Matrix" : "Matrice des Soldes Réciproques Croisés"}
          subtitle={locale === "en" ? "Net positions by entity (Rows = Creditor / Receivable, Columns = Debtor / Payable)" : "Positions débitrices et créditrices nettes par entité (Lignes = Émetteur créance, Colonnes = Débiteur dette)"}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200/80 rounded-xl overflow-hidden">
              <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">{locale === "en" ? "Creditor \\ Debtor" : "Créancier \\ Débiteur"}</th>
                  {entities.map((e) => (
                    <th key={e.id} className="p-3 text-right">
                      {e.code}
                    </th>
                  ))}
                  <th className="p-3 text-right bg-slate-200/70 font-extrabold">{locale === "en" ? "Total Receivables" : "Total Créances"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((rowEnt) => {
                  let rowTotal = 0;
                  return (
                    <tr key={rowEnt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 bg-slate-50/50">
                        {rowEnt.name} ({rowEnt.code})
                      </td>
                      {entities.map((colEnt) => {
                        if (rowEnt.id === colEnt.id) {
                          return (
                            <td key={colEnt.id} className="p-3 text-center bg-slate-100/50 text-slate-300">
                              —
                            </td>
                          );
                        }
                        const match = transactions.find(
                          (t) => t.sourceEntityId === rowEnt.id && t.targetEntityId === colEnt.id
                        );
                        const amt = match ? match.amount : 0;
                        rowTotal += amt;
                        return (
                          <td key={colEnt.id} className="p-3 text-right font-mono font-tabular">
                            {amt > 0 ? (
                              <span className="font-bold text-blue-700">
                                {formatMoney(amt)}
                              </span>
                            ) : (
                              <span className="text-slate-300">0</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 text-right font-mono font-bold bg-slate-100/80 text-slate-900 font-tabular">
                        {formatMoney(rowTotal)} MAD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Action / Arbitrate Modal */}
      {selectedTxForAction && (
        <Modal
          isOpen={!!selectedTxForAction}
          onClose={() => {
            setSelectedTxForAction(null);
            setActionType(null);
          }}
          title={
            actionType === "adjust"
              ? (locale === "en" ? "Regularization Adjustment for Intercompany Discrepancy" : "Ajustement Comptable de Régularisation de l'Écart")
              : (locale === "en" ? "Document CFO Justification & Context" : "Justification & Documentation de l'Écart Intercompany")
          }
          size="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedTxForAction(null);
                  setActionType(null);
                }}
              >
                {t.common.cancel}
              </Button>
              <Button variant="primary" onClick={handleActionSubmit}>
                {locale === "en" ? "Confirm Adjustment" : "Confirmer l'ajustement"}
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
              <strong>{locale === "en" ? "Pending Gap:" : "Écart constaté :"}</strong> 20 000 MAD entre Entity Alpha (500 000 MAD) et Entity Beta (480 000 MAD).
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {locale === "en" ? "Audit Justification / Elimination Note" : "Motif de l'ajustement comptable"}
              </label>
              <textarea
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder={locale === "en" ? "Specify rationale or debit note reference..." : "Indiquez les motifs de régularisation ou le numéro d'avoir..."}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        title={locale === "en" ? "Create New Intra-Group Transaction" : "Créer une Nouvelle Transaction Intercompany"}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsAddTxOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button variant="primary" onClick={handleCreateTx}>
              {locale === "en" ? "Register Transaction" : "Enregistrer la transaction"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateTx} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={locale === "en" ? "Debtor Entity (Source)" : "Entité Émettrice"}
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              options={entities.map((e) => ({ label: `${e.name} (${e.code})`, value: e.id }))}
            />
            <Select
              label={locale === "en" ? "Beneficiary Entity (Target)" : "Entité Réceptrice"}
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              options={entities.map((e) => ({ label: `${e.name} (${e.code})`, value: e.id }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={locale === "en" ? "Transaction Nature" : "Nature du flux"}
              value={newType}
              onChange={(e) => setNewType(e.target.value as IntercompanyType)}
              options={[
                { label: "Management Fees", value: "management_fee" },
                { label: "Loan / Advance (Prêt)", value: "loan" },
                { label: "Shared Services Recharge", value: "shared_service" },
                { label: "Dividends (Dividendes)", value: "dividend" },
                { label: "Goods / Services", value: "commercial" },
              ]}
            />
            <Select
              label={locale === "en" ? "Currency" : "Devise"}
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              options={[
                { label: "MAD", value: "MAD" },
                { label: "EUR", value: "EUR" },
                { label: "USD", value: "USD" },
              ]}
            />
          </div>

          <Input
            label={locale === "en" ? "Amount" : "Montant"}
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            required
          />

          <Input
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder={locale === "en" ? "e.g. IT services shared cost Q3" : "ex: Refacturation licence logicielle T3"}
          />
        </form>
      </Modal>
    </AppShell>
  );
}
