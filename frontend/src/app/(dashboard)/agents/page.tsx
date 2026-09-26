"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Terminal,
  Cpu,
  Layers,
  Wrench,
  Radio,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";
import { AgentProfile } from "@/lib/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        const ags = await api.getAgents();
        setAgents(ags);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Autonomous Agent Orchestration Registry
            </span>
            <span>•</span>
            <span>Architecture: Micro-Agent Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Specialized Operational Intelligence Agents
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Distributed multi-agent pipeline with least-privilege tool allowlists and mathematical verification boundaries.
          </p>
        </div>

        {/* Global Agent Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938]">
            <span className="text-[10px] text-gray-400 uppercase block">Active Pipeline</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              9 / 9 Agents Online
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938]">
            <span className="text-[10px] text-gray-400 uppercase block">Tool Policy</span>
            <span className="text-sm font-bold text-sky-400">Least Privilege</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((ag) => {
          const isActive = ag.status === "ACTIVE";
          return (
            <div
              key={ag.id}
              className="p-5 rounded-xl border border-[#202530] bg-[#11141A] hover:border-[#2F394D] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#161B24] border border-[#242C3D] flex items-center justify-center text-sky-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        Stage: {ag.stage}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight">{ag.name}</h3>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {ag.status}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {ag.role_description}
                </p>

                {/* Model Engine & Telemetry */}
                <div className="mt-4 pt-3 border-t border-[#1E2432] space-y-2 text-xs font-mono">
                  <div className="bg-[#141822] p-2.5 rounded border border-[#202838]">
                    <span className="text-[10px] text-gray-400 block uppercase">Engine / Model Architecture</span>
                    <span className="text-sky-300 font-semibold text-xs mt-0.5 block truncate">
                      {ag.engine_model}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-400">Inference Latency:</span>
                      <span className="text-white font-bold block">{ag.latency_ms} ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Accuracy / SLA:</span>
                      <span className="text-emerald-400 font-bold block">{ag.accuracy_pct}%</span>
                    </div>
                  </div>
                </div>

                {/* Permitted Tools (Least-Privilege Security) */}
                <div className="mt-3 pt-2">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-gray-400" /> Permitted Tool Scope:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ag.permitted_tools.map((tool, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161B24] text-gray-300 border border-[#222938]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Task */}
              <div className="mt-4 pt-3 border-t border-[#1E2432] text-[11px] font-mono text-gray-400 flex items-center justify-between">
                <span className="truncate max-w-[190px]">Task: {ag.current_task || "Standby"}</span>
                <span className="text-gray-400">{ag.last_active}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
