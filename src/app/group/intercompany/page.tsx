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

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val);
  };

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
      reconcileTransaction(selectedTxForAction, "matched", "Rapproché manuellement par le CFO");
    } else if (actionType === "adjust") {
      reconcileTransaction(
        selectedTxForAction,
        "matched",
        `Écart ajusté : ${adjustmentNote || "Ajustement comptable de régularisation validé"}`
      );
    } else if (actionType === "explain") {
      reconcileTransaction(
        selectedTxForAction,
        "review_required",
        `Explication CFO : ${adjustmentNote || "Contestation formelle en cours d'instruction"}`
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
      description: newDescription || "Transaction intercompany intra-groupe",
      status: "matched",
    });
    setIsAddTxOpen(false);
    setNewDescription("");
  };

  return (
    <AppShell
      title="Module Intercompany & Éliminations"
      subtitle="Réconciliation des flux réciproques, contrôle des écarts et éliminations de consolidation"
    >
      {/* Top Banner Alert on Mismatch */}
      {discrepancyTransactions.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-950">
                  Écart intercompany à réconcilier : 20 000 MAD
                </span>
                <Badge variant="rose" size="sm" dot>Action Requise</Badge>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-3xl">
                L&apos;entité <strong>Entity Alpha</strong> a comptabilisé une créance de{" "}
                <strong>500 000 MAD</strong> sur <strong>Entity Beta</strong>, alors que Beta a enregistré une dette de{" "}
                <strong>480 000 MAD</strong> (suite à la déduction non approuvée d&apos;une note de débit de 20 000 MAD). Cet écart fausse la neutralisation bilantielle sans arbitrage du CFO.
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
          >
            Arbitrer l&apos;écart (20 K MAD)
          </Button>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: "reconciliation", label: `Réconciliations & Écarts (${discrepancyTransactions.length})` },
            { id: "all_transactions", label: `Toutes les Transactions (${transactions.length})` },
            { id: "eliminations", label: `Table des Éliminations (${eliminations.length})` },
            { id: "matrix", label: "Matrice des Soldes Croisés" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsAddTxOpen(true)}
        >
          Nouvelle transaction intercompany
        </Button>
      </div>

      {/* TAB 1: RECONCILIATIONS & DISCREPANCIES */}
      {activeTab === "reconciliation" && (
        <Card
          title="Écarts de Rapprochement Réciproques"
          subtitle="Comparaison automatique des créances de l'entité source vs les dettes de l'entité réceptrice"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf / Date</TableHead>
                  <TableHead>Entité Émettrice (Créance)</TableHead>
                  <TableHead>Entité Réceptrice (Dette)</TableHead>
                  <TableHead>Nature du Flux</TableHead>
                  <TableHead align="right">Montant Déclaré</TableHead>
                  <TableHead align="right">Écart Constaté</TableHead>
                  <TableHead align="center">Statut</TableHead>
                  <TableHead align="right">Actions CFO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const hasGap = (tx.discrepancyAmount || 0) > 0;
                  return (
                    <TableRow key={tx.id} className={hasGap ? "bg-amber-50/40" : ""}>
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-slate-900 block">{tx.id}</span>
                        <span className="text-[10px] text-slate-400">{tx.date} ({tx.period})</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-slate-900 block">{getEntityName(tx.sourceEntityId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Actif circulant (4411)</span>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-slate-900 block">{getEntityName(tx.targetEntityId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Dette groupe (1481/4481)</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" size="sm">
                          {tx.type.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell align="right" className="font-mono font-bold text-slate-900">
                        {formatMoney(tx.amount)} {tx.currency}
                      </TableCell>

                      <TableCell align="right" className="font-mono">
                        {hasGap ? (
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            +{formatMoney(tx.discrepancyAmount || 0)} MAD
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-xs">0 MAD (Parfait)</span>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        {tx.status === "matched" ? (
                          <Badge variant="green" dot>Rapproché</Badge>
                        ) : tx.status === "eliminated" ? (
                          <Badge variant="blue" dot>Éliminé</Badge>
                        ) : tx.status === "partial_match" ? (
                          <Badge variant="rose" dot>Écart 20K</Badge>
                        ) : (
                          <Badge variant="amber" dot>À réviser</Badge>
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
                                Ajuster
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
                                Justifier
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
                              Valider
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
          title="Registre Intégral des Opérations Intra-Groupe"
          subtitle="Historique des flux de trésorerie, refacturations et honoraires de gestion"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf</TableHead>
                  <TableHead>Origine (Débiteur)</TableHead>
                  <TableHead>Destination (Bénéficiaire)</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead align="right">Montant</TableHead>
                  <TableHead align="center">Récurrent</TableHead>
                  <TableHead align="center">Traitement Consolidation</TableHead>
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
                    <TableCell align="right" className="font-mono font-bold text-slate-900">
                      {formatMoney(tx.amount)} {tx.currency}
                    </TableCell>
                    <TableCell align="center">
                      {tx.isRecurring ? (
                        <span className="text-[11px] font-semibold text-blue-600">Oui (Mensuel)</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Ponctuel</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant={tx.status === "eliminated" ? "blue" : "slate"} size="sm">
                        {tx.status === "eliminated" ? "Éliminé à 100%" : "À neutraliser"}
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
          title="Écritures d'Élimination de Consolidation"
          subtitle="Journal des écritures de neutralisation du P&L et du Bilan consolidé"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code Élimination</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Comptes Comptables Neutralisés</TableHead>
                  <TableHead>Périmètre / Entités Conjointes</TableHead>
                  <TableHead align="right">Débit ({consolidationCurrency})</TableHead>
                  <TableHead align="right">Crédit ({consolidationCurrency})</TableHead>
                  <TableHead align="center">Statut</TableHead>
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
                    <TableCell align="right" className="font-mono font-bold text-blue-600">
                      {formatMoney(elm.debit)}
                    </TableCell>
                    <TableCell align="right" className="font-mono font-bold text-emerald-600">
                      {formatMoney(elm.credit)}
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="blue" dot>
                        Éliminé
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
          title="Matrice des Soldes Réciproques Croisés"
          subtitle="Positions débitrices et créditrices nettes par entité (Lignes = Émetteur créance, Colonnes = Débiteur dette)"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">Créancier \ Débiteur</th>
                  {entities.map((e) => (
                    <th key={e.id} className="p-3 text-right">
                      {e.code}
                    </th>
                  ))}
                  <th className="p-3 text-right bg-slate-200/70">Total Créances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((rowEnt) => {
                  let rowTotal = 0;
                  return (
                    <tr key={rowEnt.id} className="hover:bg-slate-50">
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
                        // Find matching transaction amount
                        const match = transactions.find(
                          (t) => t.sourceEntityId === rowEnt.id && t.targetEntityId === colEnt.id
                        );
                        const amt = match ? match.amount : 0;
                        rowTotal += amt;
                        return (
                          <td key={colEnt.id} className="p-3 text-right font-mono">
                            {amt > 0 ? (
                              <span className="font-semibold text-blue-700">
                                {formatMoney(amt)}
                              </span>
                            ) : (
                              <span className="text-slate-300">0</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 text-right font-mono font-bold bg-slate-100/80 text-slate-900">
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
              ? "Ajustement Comptable de Régularisation de l'Écart"
              : "Justification & Documentation de l'Écart Intercompany"
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
                Annuler
              </Button>
              <Button variant="primary" onClick={handleActionSubmit}>
                Confirmer l&apos;ajustement
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <strong>Écart identifié :</strong> 20 000 MAD entre la créance déclarée par Alpha (500 000 MAD) et la dette reconnue par Beta (480 000 MAD).
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Motif & Rapprochement de régularisation
              </label>
              <textarea
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder="Indiquez la décision du DAF (ex: Prise en charge des 20 000 MAD par la Holding en frais partagés ou émission d'un avoir par Alpha)"
                className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Create Transaction Modal */}
      <Modal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        title="Créer une Transaction Intercompany"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsAddTxOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreateTx}>
              Enregistrer la transaction
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateTx} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Entité Émettrice (Créancier)"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              options={entities.map((e) => ({ label: `${e.name} (${e.code})`, value: e.id }))}
            />

            <Select
              label="Entité Débitrice (Débiteur)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              options={entities.map((e) => ({ label: `${e.name} (${e.code})`, value: e.id }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Nature de l'opération"
              value={newType}
              onChange={(e) => setNewType(e.target.value as IntercompanyType)}
              options={[
                { label: "Management Fee (Honoraires de gestion)", value: "management_fee" },
                { label: "Prêt Intercompany (Avance de fonds)", value: "intercompany_loan" },
                { label: "Refacturation de Charges Partagées", value: "cost_recharge" },
                { label: "Compte Courant d'Associé", value: "current_account" },
                { label: "Dividende / Distribution", value: "dividend" },
                { label: "Financement CAPEX", value: "capex_funding" },
              ]}
            />

            <Select
              label="Devise"
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
            label="Montant nominal"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            required
          />

          <Input
            label="Description & Justificatif"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="ex: Convention d'assistance technique et administrative T3"
          />
        </form>
      </Modal>
    </AppShell>
  );
}
