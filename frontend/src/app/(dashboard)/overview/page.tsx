"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Wifi,
  Radio,
  Server
} from "lucide-react";
import { api } from "@/lib/api";
import { FacilityStatus, Incident } from "@/lib/types";

export default function OverviewPage() {
  const [facilities, setFacilities] = useState<FacilityStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [facs, incs] = await Promise.all([
          api.getFacilities(),
          api.getIncidents()
        ]);
        setFacilities(facs);
        setIncidents(incs);
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const primaryIncident = incidents.find(i => i.id === "INC-4091") || incidents[0];
  const wh3Facility = facilities.find(f => f.facility_id === "WH-03-ORD");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
              Operational Intelligence Command Center
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-[11px] font-mono text-gray-400">AWS Region: us-east-1</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Fulfillment Network Operations
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time closed-loop anomaly detection, root cause isolation, and verified intervention.
          </p>
        </div>

        {/* Global Stats Bar */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938] flex flex-col text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Network Health</span>
            <span className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              99.4% Nominal
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938] flex flex-col text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Mean Time to Detect</span>
            <span className="text-sm font-bold font-mono text-sky-400">42s</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938] flex flex-col text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Autonomous MTTR</span>
            <span className="text-sm font-bold font-mono text-emerald-400">5.9 min</span>
          </div>
        </div>
      </div>

      {/* Flagship Active Incident Command Panel */}
      {primaryIncident && (
        <div className="relative rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/20 via-[#141217] to-[#11141A] p-6 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  P1 CRITICAL INCIDENT
                </span>
                <span className="text-xs font-mono text-gray-400">
                  ID: #{primaryIncident.id}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-400 font-mono">
                  Detected {primaryIncident.detected_at}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                  Confidence: {Math.round(primaryIncident.anomaly_confidence * 100)}%
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {primaryIncident.title}
                </h2>
                <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                  {primaryIncident.investigation_summary || primaryIncident.current_impact}
                </p>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                <div className="bg-[#161922] p-2.5 rounded-lg border border-[#252C3D]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Induction Throughput</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold font-mono text-red-400">780 /hr</span>
                    <span className="text-[10px] text-red-400 font-mono flex items-center">
                      <TrendingDown className="w-3 h-3" /> -51%
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Target: 1,600/hr</span>
                </div>

                <div className="bg-[#161922] p-2.5 rounded-lg border border-[#252C3D]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Queue Accumulation</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold font-mono text-amber-400">4,820 pkgs</span>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center">
                      <TrendingUp className="w-3 h-3" /> +467%
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Capacity: 5,200</span>
                </div>

                <div className="bg-[#161922] p-2.5 rounded-lg border border-[#252C3D]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Scanner Availability</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold font-mono text-red-400">48.2%</span>
                    <span className="text-[10px] text-red-400 font-mono">34% HTTP 504</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Baseline: 99.1%</span>
                </div>

                <div className="bg-[#161922] p-2.5 rounded-lg border border-[#252C3D]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Carrier SLA Risk</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold font-mono text-red-400">88.5%</span>
                    <span className="text-[10px] text-red-400 font-mono">Cutoff: 42m</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Est: $42.6k penalty</span>
                </div>
              </div>
            </div>

            {/* Action Buttons into Workflow */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
              <Link
                href="/incidents/INC-4091"
                className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <span>Investigate Root Cause</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulations"
                className="px-4 py-2.5 rounded-lg bg-[#1C2230] hover:bg-[#252D40] border border-[#2E374C] text-gray-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Simulate Interventions</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Matrix Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-gray-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400" />
            Operational Facility Network (4 Hubs)
          </h2>
          <span className="text-xs font-mono text-gray-400">Continuous 500ms sampling rate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilities.map((fac) => {
            const isCrit = fac.status === "critical";
            const isWarn = fac.status === "warning";
            const isRec = fac.status === "recovered";
            return (
              <div
                key={fac.facility_id}
                className={`p-4 rounded-xl border transition-all ${
                  isCrit
                    ? "bg-[#161215] border-red-500/40 shadow-sm"
                    : isWarn
                    ? "bg-[#161411] border-amber-500/40"
                    : isRec
                    ? "bg-[#111714] border-emerald-500/40"
                    : "bg-[#11141A] border-[#202530] hover:border-[#2C3445]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block">{fac.location}</span>
                    <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">{fac.facility_name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      isCrit
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : isWarn
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : isRec
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {fac.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#202530]">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">Throughput</span>
                    <span className={`text-sm font-mono font-bold ${isCrit ? "text-red-400" : "text-white"}`}>
                      {fac.current_throughput} <span className="text-[10px] text-gray-400 font-normal">/hr</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">Queue Depth</span>
                    <span className={`text-sm font-mono font-bold ${isCrit ? "text-amber-400" : "text-white"}`}>
                      {fac.queue_depth} <span className="text-[10px] text-gray-400 font-normal">pkgs</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">Scanners</span>
                    <span className={`text-xs font-mono ${isCrit ? "text-red-400" : "text-gray-300"}`}>
                      {fac.scanner_availability}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono block">SLA Risk</span>
                    <span className={`text-xs font-mono font-bold ${isCrit ? "text-red-400" : "text-emerald-400"}`}>
                      {fac.sla_risk_pct}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Latency: {fac.network_latency_ms}ms</span>
                  {isCrit ? (
                    <Link href="/incidents/INC-4091" className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold">
                      Inspect Incident &rarr;
                    </Link>
                  ) : (
                    <span className="text-emerald-400">Nominal</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Operational Event Stream Feed */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Real-Time Operational Event Feed</h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">Streaming EventBridge Bus: ord-events-bus</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-start gap-3 p-2.5 rounded bg-[#161B24] border border-red-500/20">
            <span className="text-gray-400 text-[11px] shrink-0">10:53:12</span>
            <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] shrink-0 font-bold">P1 ALERT</span>
            <span className="text-gray-300 flex-1">
              [WH-03-ORD] Sentinel Agent triggered high anomaly confidence (0.94) on Induction Lines 4-6 throughput collapse.
            </span>
            <span className="text-[10px] text-gray-400">EVT-9042</span>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded bg-[#13161E] border border-[#202530]">
            <span className="text-gray-400 text-[11px] shrink-0">10:53:20</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 text-[10px] shrink-0 font-bold">INVESTIGATE</span>
            <span className="text-gray-300 flex-1">
              [WH-03-ORD] Investigation Agent correlated TenGigE0/1/24 buffer discards with Scanner Cluster HTTP 504 timeouts.
            </span>
            <span className="text-[10px] text-gray-400">EVT-9043</span>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded bg-[#13161E] border border-[#202530]">
            <span className="text-gray-400 text-[11px] shrink-0">10:54:02</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] shrink-0 font-bold">CAUSAL CHAIN</span>
            <span className="text-gray-300 flex-1">
              [WH-03-ORD] Root Cause Agent isolated Switch SW-03 port buffer exhaustion as primary root cause. Causal graph constructed.
            </span>
            <span className="text-[10px] text-gray-400">EVT-9044</span>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded bg-[#13161E] border border-[#202530]">
            <span className="text-gray-400 text-[11px] shrink-0">10:54:45</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[10px] shrink-0 font-bold">SIMULATION</span>
            <span className="text-gray-300 flex-1">
              [WH-03-ORD] Simulation Agent completed evaluation of 4 counterfactuals. Scenario B (Dynamic Reroute) recommended.
            </span>
            <span className="text-[10px] text-gray-400">EVT-9045</span>
          </div>
        </div>
      </div>
    </div>
  );
}
