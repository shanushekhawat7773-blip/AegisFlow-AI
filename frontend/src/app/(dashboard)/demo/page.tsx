"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Radio
} from "lucide-react";
import { api } from "@/lib/api";

export default function DemoLabPage() {
  const [activeScenario, setActiveScenario] = useState("WH-03-ORD_SCANNER_OUTAGE");
  const [statusMessage, setStatusMessage] = useState("");

  const scenarios = [
    {
      id: "WH-03-ORD_SCANNER_OUTAGE",
      name: "1. Warehouse Scanner Network Failure (Flagship)",
      severity: "P1_CRITICAL",
      facility: "Warehouse 03 (Chicago)",
      impact: "Switch SW-03 buffer drops drop scanner packets; throughput collapses 51%; SLA breach risk 88.5%.",
      recommendedAction: "traffic.reroute_processing_queue",
      badge: "PRIMARY DEMO"
    },
    {
      id: "WH-02-DFW_ORDER_SURGE",
      name: "2. Unexpected Order Surge & Queue Saturation",
      severity: "P2_HIGH",
      facility: "Warehouse 02 (Dallas)",
      impact: "Unscheduled supplier truck arrivals push staging queue to 3,450 units (+210% over capacity).",
      recommendedAction: "workforce.rebalance_stations",
      badge: "CAPACITY"
    },
    {
      id: "WH-01-SEA_MOTOR_DRIFT",
      name: "3. Conveyor Frequency Inverter Motor Jitter",
      severity: "P3_MEDIUM",
      facility: "Warehouse 01 (Seattle)",
      impact: "Motor temperature telemetry drift on induction line 2 indicates impending mechanical bearing failure.",
      recommendedAction: "cluster.restart_scanner_service",
      badge: "TELEMETRY"
    },
    {
      id: "WH-04-ATL_NETWORK_PACKET_LOSS",
      name: "4. Cross-Dock Network Switch Packet Loss",
      severity: "P2_HIGH",
      facility: "Warehouse 04 (Atlanta)",
      impact: "Packet discard rates spike to 3.8% across air freight sortation router, lagging barcode lookups.",
      recommendedAction: "traffic.reroute_processing_queue",
      badge: "NETWORK"
    },
    {
      id: "INVENTORY_MISMATCH_SURGE",
      name: "5. Inventory Discrepancy & Barcode Read Mismatch",
      severity: "P3_MEDIUM",
      facility: "Warehouse 03 (Chicago)",
      impact: "SKU mismatch errors trigger PLC safety interlocks, stalling outbound staging conveyor.",
      recommendedAction: "workforce.rebalance_stations",
      badge: "WMS"
    },
    {
      id: "SERVICE_DEPENDENCY_FAILURE",
      name: "6. Upstream Carrier API Service Dependency Outage",
      severity: "P2_HIGH",
      facility: "All Facilities",
      impact: "External carrier rate-limiting stalls label generation; queue accumulates at packing stations.",
      recommendedAction: "traffic.reroute_processing_queue",
      badge: "API"
    },
    {
      id: "BASELINE_NOMINAL",
      name: "7. All Facilities — Nominal Healthy Baseline",
      severity: "NOMINAL",
      facility: "All 4 Hubs",
      impact: "Nominal operational state. Zero active anomalies. 99.4% overall network reliability.",
      recommendedAction: "none",
      badge: "BASELINE"
    }
  ];

  const handleActivateScenario = async (id: string, name: string) => {
    setActiveScenario(id);
    try {
      await api.switchScenario(id);
      setStatusMessage(`Scenario activated: ${name}`);
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetDemo();
      setActiveScenario("WH-03-ORD_SCANNER_OUTAGE");
      setStatusMessage("Demo environment reset to initial Warehouse 03 P1 state.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Hackathon Presentation Lab
            </span>
            <span>•</span>
            <span>Deterministic Scenario Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Deterministic Demo Scenario Switcher
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Trigger reproducible operational incidents with 1 click to demonstrate the complete closed-loop workflow to judges.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-[#161B24] hover:bg-[#202736] border border-[#283244] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to P1 Baseline</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => {
          const isActive = activeScenario === sc.id;
          const isCrit = sc.severity === "P1_CRITICAL";

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-[#161C28] border-sky-500 ring-1 ring-sky-500/50 shadow-md"
                  : isCrit
                  ? "bg-[#141217] border-red-500/30 hover:border-red-400"
                  : "bg-[#11141A] border-[#202530] hover:border-[#2C3445]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-400">{sc.facility}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isCrit
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    }`}
                  >
                    {sc.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">{sc.name}</h3>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{sc.impact}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2634] flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400 truncate max-w-[180px]">
                  Action: {sc.recommendedAction}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActivateScenario(sc.id, sc.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      isActive
                        ? "bg-sky-500 text-white"
                        : "bg-[#161B24] hover:bg-[#202738] text-gray-300 hover:text-white border border-[#252C3D]"
                    }`}
                  >
                    {isActive ? "Active Now" : "Inject Scenario"}
                  </button>
                  {isActive && (
                    <Link
                      href="/overview"
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-xs font-mono flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
