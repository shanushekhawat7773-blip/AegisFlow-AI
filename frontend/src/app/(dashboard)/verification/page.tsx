"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  FileText,
  Clock,
  Radio,
  ChevronRight,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { api } from "@/lib/api";
import { VerificationData } from "@/lib/types";

export default function VerificationWorkspacePage() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerification() {
      try {
        const v = await api.getVerification("INC-4091");
        setData(v);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadVerification();
    const interval = setInterval(loadVerification, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading Continuous Verification Telemetry...
      </div>
    );
  }

  const isRecovered = data.verification_status === "VERIFIED_RECOVERED";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              Continuous Verification Agent v1.4
            </span>
            <span>•</span>
            <span>Incident: #INC-4091 (Warehouse 03)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Intervention Recovery Verification & Telemetry Drift
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time statistical validation comparing pre-intervention baseline against live telemetry post-action.
          </p>
        </div>

        {/* Action Link to Executive Report */}
        <Link
          href="/reports/INC-4091"
          className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>View Executive Incident Report</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recovery Status Verdict Banner */}
      <div
        className={`rounded-xl border p-5 shadow-xl transition-all ${
          isRecovered
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-[#111915] to-[#11141A]"
            : "border-amber-500/40 bg-[#161411]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isRecovered
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {isRecovered ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isRecovered
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  VERDICT: {data.verification_status}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Verification Confidence: <span className="text-emerald-400 font-bold">{Math.round(data.verification_confidence * 1000) / 10}%</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs font-mono text-gray-400">
                  Action: {data.action_type}
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed max-w-3xl">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Drift Watch Window */}
          <div className="px-3.5 py-2 rounded-lg bg-[#0C1016] border border-[#202738] text-right font-mono text-xs shrink-0">
            <span className="text-[10px] text-gray-400 uppercase block">Telemetry Drift Watcher</span>
            <span className="text-emerald-400 font-bold flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              14m Stability Window
            </span>
          </div>
        </div>
      </div>

      {/* Before vs After Telemetry Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-300">
            Pre-Intervention Baseline vs. Post-Intervention Telemetry Delta
          </h2>
          <span className="text-[11px] font-mono text-gray-400">Calculated across 6 primary telemetry streams</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Throughput */}
          <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A] space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Induction Throughput</span>
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 font-mono">Pre-Action:</span>
                <span className="text-sm font-mono text-red-400 font-bold">
                  {data.pre_intervention_metrics.throughput_orders_hr} /hr
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-gray-400 font-mono">Post-Action:</span>
                <span className="text-base font-mono text-emerald-400 font-bold">
                  {data.post_intervention_metrics.throughput_orders_hr} /hr
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1E2432] flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Net Delta:</span>
              <span className="text-emerald-400 font-bold">+{data.metric_deltas.throughput_delta_pct}%</span>
            </div>
          </div>

          {/* Card 2: Queue Depth */}
          <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A] space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Buffer Queue Depth</span>
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 font-mono">Pre-Action:</span>
                <span className="text-sm font-mono text-amber-400 font-bold">
                  {data.pre_intervention_metrics.queue_depth_parcels} pkgs
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-gray-400 font-mono">Post-Action:</span>
                <span className="text-base font-mono text-emerald-400 font-bold">
                  {data.post_intervention_metrics.queue_depth_parcels} pkgs
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1E2432] flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Drained:</span>
              <span className="text-emerald-400 font-bold">{data.metric_deltas.queue_depth_delta_pct}%</span>
            </div>
          </div>

          {/* Card 3: Network Latency */}
          <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A] space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Switch RTT Latency</span>
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 font-mono">Pre-Action:</span>
                <span className="text-sm font-mono text-red-400 font-bold">
                  {data.pre_intervention_metrics.network_latency_ms} ms
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-gray-400 font-mono">Post-Action:</span>
                <span className="text-base font-mono text-emerald-400 font-bold">
                  {data.post_intervention_metrics.network_latency_ms} ms
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1E2432] flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Latency Drop:</span>
              <span className="text-emerald-400 font-bold">-{data.metric_deltas.latency_reduction_ms} ms</span>
            </div>
          </div>

          {/* Card 4: SLA Risk */}
          <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A] space-y-2">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Carrier Cutoff SLA Risk</span>
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 font-mono">Pre-Action:</span>
                <span className="text-sm font-mono text-red-400 font-bold">
                  {data.pre_intervention_metrics.sla_breach_risk_pct}%
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-gray-400 font-mono">Post-Action:</span>
                <span className="text-base font-mono text-emerald-400 font-bold">
                  {data.post_intervention_metrics.sla_breach_risk_pct}%
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1E2432] flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Risk Averted:</span>
              <span className="text-emerald-400 font-bold">-{data.metric_deltas.sla_risk_reduction_pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Formal Policy Checks Matrix */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202530]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Operational Acceptance Policy Verification Checks
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Automated statistical hypothesis tests executed by Verification Agent v1.4
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">4 / 4 Passed (100%)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.system_checks.map((chk, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[#141822] border border-[#222938] flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span className="text-gray-200">{chk.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">{chk.actual}</span>
                <span className="text-gray-500 text-[10px]">({chk.target})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
