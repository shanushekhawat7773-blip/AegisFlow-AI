"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Search,
  Filter,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { Incident } from "@/lib/types";

export default function IncidentsDirectoryPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const list = await api.getIncidents();
        setIncidents(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadIncidents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-red-400 font-semibold uppercase tracking-wider">
              Operational Incident Directory
            </span>
            <span>•</span>
            <span>Real-time Anomaly Correlation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Active & Historical Incidents
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Classified operational failures with Bayesian causal graphs and counterfactual intervention history.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938]">
            <span className="text-[10px] text-gray-400 uppercase block">Active P1 Incidents</span>
            <span className="text-sm font-bold text-red-400">1 Incident</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#11141A] border border-[#222938]">
            <span className="text-[10px] text-gray-400 uppercase block">Mean Resolution Time</span>
            <span className="text-sm font-bold text-emerald-400">5.9m (Autonomous)</span>
          </div>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-4">
        {incidents.map((inc) => {
          const isCrit = inc.severity === "P1_CRITICAL";
          return (
            <div
              key={inc.id}
              className={`p-5 rounded-xl border transition-all ${
                isCrit
                  ? "bg-[#141217] border-red-500/40 shadow-lg"
                  : "bg-[#11141A] border-[#202530]"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isCrit
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {inc.severity.replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-400">#{inc.id}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs font-mono text-gray-400">{inc.facility_name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs font-mono text-gray-400">Detected: {inc.detected_at}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{inc.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-4xl">
                    {inc.investigation_summary || inc.current_impact}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-xs font-mono text-gray-400 flex-wrap">
                    <span>
                      SLA Risk: <span className="text-red-400 font-bold">{inc.sla_risk_pct}%</span>
                    </span>
                    <span>•</span>
                    <span>
                      Anomaly Confidence: <span className="text-sky-400 font-bold">{Math.round(inc.anomaly_confidence * 100)}%</span>
                    </span>
                    <span>•</span>
                    <span>
                      Affected Systems: <span className="text-gray-300">{inc.affected_systems?.join(", ")}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <Link
                    href={`/incidents/${inc.id}`}
                    className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors font-mono"
                  >
                    <span>Open Investigation</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
