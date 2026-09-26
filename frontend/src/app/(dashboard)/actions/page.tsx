"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Play,
  Lock,
  ChevronRight,
  Clock,
  KeyRound,
  FileCheck,
  Undo2,
  Server
} from "lucide-react";
import { api } from "@/lib/api";
import { ActionExecution, ActionStatus, UserRole } from "@/lib/types";

export default function ActionGatewayPage() {
  const [actions, setActions] = useState<ActionExecution[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionExecution | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [justification, setJustification] = useState("Authorized dynamic routing divert to relieve induction buffer accumulation.");
  const [operatorName, setOperatorName] = useState("Sarah Chen");
  const [operatorRole, setOperatorRole] = useState<UserRole>("OPERATOR");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    async function loadActions() {
      try {
        const actList = await api.getActions();
        setActions(actList);
        if (actList.length > 0) setSelectedAction(actList[0]);
      } catch (e) {
        console.error(e);
      }
    }
    loadActions();
  }, []);

  const handleApproveAndExecute = async () => {
    if (!selectedAction) return;
    setIsExecuting(true);
    setShowApprovalModal(false);

    try {
      const updated = await api.approveAction(
        selectedAction.id,
        operatorName,
        operatorRole,
        justification
      );
      setSelectedAction(updated);
      setActions(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRollback = async () => {
    if (!selectedAction) return;
    try {
      const updated = await api.rollbackAction(selectedAction.id, operatorName, operatorRole);
      setSelectedAction(updated);
      setActions(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              Controlled Action Gateway & Governance
            </span>
            <span>•</span>
            <span>Policy: Strict Allowlist & Role-Based Authorization</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Enterprise Operational Action Center
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Cryptographically signed, allowlisted intervention execution with human-in-the-loop governance.
          </p>
        </div>

        {/* Action Link to Verification */}
        <Link
          href="/verification"
          className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors"
        >
          <span>Verify System Recovery</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Security Governance Notice */}
      <div className="rounded-xl border border-[#252D3D] bg-[#11141A] p-4 flex items-center justify-between gap-4 flex-wrap text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-gray-300">
            Action Gateway Allowlist Active: <span className="text-white font-bold">5 Authorized Handlers</span> • Arbitrary execution disabled
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <span>Active Role: <span className="text-sky-400 font-bold">{operatorRole}</span></span>
          <span>•</span>
          <span>Gateway: <span className="text-emerald-400">mTLS Verified</span></span>
        </div>
      </div>

      {/* Main Grid: Actions List & Live Terminal / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Actions List */}
        <div className="rounded-xl border border-[#202530] bg-[#11141A] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#202530]">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold">
              Action Ledger
            </span>
            <span className="text-[10px] font-mono text-gray-400">{actions.length} Total</span>
          </div>

          <div className="space-y-2">
            {actions.map((act) => {
              const isSelected = selectedAction?.id === act.id;
              const isCompleted = act.status === "COMPLETED";
              const isPending = act.status === "PENDING_APPROVAL";
              const isRolledBack = act.status === "ROLLED_BACK";

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedAction(act)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#161C28] border-sky-500 ring-1 ring-sky-500/50"
                      : "bg-[#141822] border-[#222938] hover:border-[#313B4E]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-gray-400">{act.id}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isPending
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                          : isRolledBack
                          ? "bg-gray-700 text-gray-300"
                          : "bg-sky-500/20 text-sky-400"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-mono">{act.action_type}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{act.target_system}</p>

                  <div className="mt-2 pt-2 border-t border-[#1F2634] flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>Risk: <span className="text-amber-400 font-bold">{act.risk_tier}</span></span>
                    <span>Signatures: {act.approvals.length}/{act.approvals_required}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Action Detail, Approval Gate & Live Terminal Log */}
        {selectedAction && (
          <div className="lg:col-span-2 space-y-5">
            {/* Action Summary Card */}
            <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#202530]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400">{selectedAction.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                      {selectedAction.risk_tier} RISK
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Incident: #{selectedAction.incident_id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 font-mono">
                    {selectedAction.action_type}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Target: <span className="text-gray-200">{selectedAction.target_system}</span>
                  </p>
                </div>

                {/* Status Badge & Primary Action Controls */}
                <div className="flex items-center gap-2">
                  {selectedAction.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => setShowApprovalModal(true)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Review & Approve</span>
                    </button>
                  )}

                  {selectedAction.status === "COMPLETED" && selectedAction.rollback_supported && (
                    <button
                      onClick={handleRollback}
                      className="px-3 py-1.5 rounded-lg bg-[#221B20] hover:bg-[#30222B] border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Safe Rollback</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Payload Inspector */}
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Dispatched Command Payload (Idempotent JSON)
                </span>
                <pre className="bg-[#090B0E] p-3 rounded border border-[#1E2432] text-xs font-mono text-sky-400 overflow-x-auto max-h-36">
                  {JSON.stringify(selectedAction.payload, null, 2)}
                </pre>
              </div>

              {/* Approvals Record */}
              {selectedAction.approvals.length > 0 && (
                <div className="bg-[#141822] p-3 rounded-lg border border-[#222A3B] space-y-1.5 text-xs font-mono">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Cryptographic Digital Signatures:
                  </span>
                  {selectedAction.approvals.map((app, i) => (
                    <div key={i} className="flex items-center justify-between text-gray-300">
                      <span>
                        <span className="text-emerald-400 font-bold">✓ Signed by:</span> {app.user_name} ({app.user_role})
                      </span>
                      <span className="text-gray-400 text-[10px]">{app.digital_signature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Gateway Terminal Output */}
            <div className="rounded-xl border border-[#202530] bg-[#090B0E] p-5 shadow-2xl space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A202C]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-xs text-gray-400 font-bold ml-2">
                    Action Gateway Live Execution Terminal
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STREAMING
                </span>
              </div>

              <div className="space-y-1.5 text-xs max-h-60 overflow-y-auto pr-2">
                {selectedAction.terminal_logs.map((log, i) => {
                  const isWarn = log.level === "WARN";
                  const isSuccess = log.level === "SUCCESS";
                  const isGateway = log.level === "GATEWAY";

                  return (
                    <div key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-gray-600 text-[11px] shrink-0">
                        {log.timestamp.slice(11, 19)}
                      </span>
                      <span
                        className={`text-[10px] px-1 py-0.2 rounded shrink-0 font-bold ${
                          isSuccess
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isWarn
                            ? "bg-amber-500/20 text-amber-400"
                            : isGateway
                            ? "bg-sky-500/20 text-sky-400"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        [{log.level}]
                      </span>
                      <span
                        className={`flex-1 ${
                          isSuccess
                            ? "text-emerald-300 font-medium"
                            : isWarn
                            ? "text-amber-300"
                            : isGateway
                            ? "text-sky-300"
                            : "text-gray-300"
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Human Approval Sign-off Modal */}
      {showApprovalModal && selectedAction && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#11141A] border border-[#283244] rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#202530]">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Digital Sign-off Authorization</h3>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  Governance Policy: MEDIUM Risk requires Operator sign-off
                </span>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1E2533]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#141822] p-3 rounded-lg border border-[#222A3B] space-y-1.5 text-xs font-mono">
              <div>
                <span className="text-gray-400">Action: </span>
                <span className="text-white font-bold">{selectedAction.action_type}</span>
              </div>
              <div>
                <span className="text-gray-400">Target System: </span>
                <span className="text-sky-300">{selectedAction.target_system}</span>
              </div>
              <div>
                <span className="text-gray-400">Risk Classification: </span>
                <span className="text-amber-400 font-bold">{selectedAction.risk_tier} (Reversible)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-mono text-[11px] mb-1">
                  Authorizing Operator Name:
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full bg-[#0E1116] border border-[#242C3D] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[11px] mb-1">
                  Operational Justification:
                </label>
                <textarea
                  rows={2}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full bg-[#0E1116] border border-[#242C3D] rounded px-3 py-2 text-gray-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202530]">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1C2230] hover:bg-[#252D40] text-xs font-medium text-gray-300 border border-[#2E374C]"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveAndExecute}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-colors font-mono"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign & Dispatch Command</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
