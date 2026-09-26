"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Cpu,
  Layers,
  Activity,
  AlertTriangle
} from "lucide-react";

export default function AnalyticsPage() {
  const kpis = {
    mttd: "42s",
    mtti: "112s",
    mttr: "5.9 min",
    recoveryRate: "98.4%",
    falsePositiveRate: "0.6%",
    savings: "$412,500",
    incidentsResolved: "24"
  };

  const agentBenchmarks = [
    { name: "Sentinel Agent (Anomaly Detection)", accuracy: "99.4%", latency: "12.4ms", invocations: "142,800" },
    { name: "Investigation Agent (Log Correlation)", accuracy: "97.8%", latency: "180.2ms", invocations: "4,210" },
    { name: "Root Cause Agent (Causal Graph)", accuracy: "96.5%", latency: "210.0ms", invocations: "1,890" },
    { name: "Simulation Agent (Queuing Theory)", accuracy: "98.9%", latency: "45.6ms", invocations: "840" },
    { name: "Decision Agent (Recommendation)", accuracy: "98.1%", latency: "64.2ms", invocations: "840" },
    { name: "Risk Engine (Governance Policy)", accuracy: "100.0%", latency: "8.1ms", invocations: "840" },
    { name: "Action Gateway (Controlled Dispatch)", accuracy: "100.0%", latency: "18.4ms", invocations: "312" },
    { name: "Verification Agent (Telemetry Drift)", accuracy: "99.2%", latency: "22.8ms", invocations: "312" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Operational Reliability Benchmarks
            </span>
            <span>•</span>
            <span>Rolling 30-Day Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            System Reliability & Agent Performance
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Key operational metrics, automated recovery rates, carrier SLA penalty avoidance, and multi-agent latency benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>SLA Penalties Averted: <span className="font-bold text-white">$412,500</span></span>
        </div>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Mean Time to Detect</span>
          <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">{kpis.mttd}</span>
          <span className="text-[10px] text-gray-500 font-mono">Sampling: 500ms</span>
        </div>

        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Mean Investigate</span>
          <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">{kpis.mtti}</span>
          <span className="text-[10px] text-gray-500 font-mono">Causal Chain</span>
        </div>

        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Mean Time to Recover</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{kpis.mttr}</span>
          <span className="text-[10px] text-emerald-400 font-mono">Autonomous</span>
        </div>

        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Recovery Success</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{kpis.recoveryRate}</span>
          <span className="text-[10px] text-gray-500 font-mono">Verified Delta</span>
        </div>

        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">False Positive Rate</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{kpis.falsePositiveRate}</span>
          <span className="text-[10px] text-emerald-400 font-mono">Z &gt; 2.5 Filter</span>
        </div>

        <div className="p-4 rounded-xl border border-[#202530] bg-[#11141A]">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Incidents Resolved</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{kpis.incidentsResolved}</span>
          <span className="text-[10px] text-gray-500 font-mono">Past 30 Days</span>
        </div>
      </div>

      {/* Agent Performance Benchmarks Table */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202530]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Autonomous Agent Reliability & Latency Benchmarks
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Service Level Objectives (SLO) tracked across the 8 specialized agents
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">100% Availability</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0E1116] border-b border-[#202530] text-gray-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Agent Name</th>
                <th className="py-2.5 px-3">Accuracy / Precision</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">24h Invocations</th>
                <th className="py-2.5 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2330]">
              {agentBenchmarks.map((b, i) => (
                <tr key={i} className="hover:bg-[#141822]">
                  <td className="py-2.5 px-3 text-white font-medium">{b.name}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{b.accuracy}</td>
                  <td className="py-2.5 px-3 text-sky-400">{b.latency}</td>
                  <td className="py-2.5 px-3 text-gray-300">{b.invocations}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      HEALTHY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
