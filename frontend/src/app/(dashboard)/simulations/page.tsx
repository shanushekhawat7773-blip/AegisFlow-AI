"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  Play,
  Layers,
  ChevronRight,
  Clock,
  DollarSign,
  Undo2,
  Sparkles,
  BarChart2
} from "lucide-react";
import { api } from "@/lib/api";
import {
  InterventionScenario,
  SimulationComparison,
  SimulationRunResult,
  RiskTier
} from "@/lib/types";

export default function SimulationStudioPage() {
  const [comparison, setComparison] = useState<SimulationComparison | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("SCENARIO_B_REROUTE");
  const [activeSimulationResult, setActiveSimulationResult] = useState<SimulationRunResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  useEffect(() => {
    async function loadScenarios() {
      try {
        const comp = await api.getScenarios("INC-4091");
        setComparison(comp);
        // Preload default simulation for recommended scenario
        const defRun = await api.runSimulation("SCENARIO_B_REROUTE", "INC-4091");
        setActiveSimulationResult(defRun);
      } catch (err) {
        console.error(err);
      }
    }
    loadScenarios();
  }, []);

  const handleRunSimulation = async (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setIsSimulating(true);
    setSimStep(0);

    // Restrained, realistic deterministic progression simulation
    for (let i = 1; i <= 7; i++) {
      await new Promise(r => setTimeout(r, 120));
      setSimStep(i);
    }

    try {
      const res = await api.runSimulation(scenarioId, "INC-4091");
      setActiveSimulationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!comparison) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Initializing Counterfactual Simulation Studio...
      </div>
    );
  }

  const selectedScenario = comparison.scenarios.find(s => s.id === selectedScenarioId) || comparison.scenarios[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Counterfactual Simulation Studio
            </span>
            <span>•</span>
            <span>Target: Warehouse 03 (INC-4091)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Intervention Evaluation & Blast Radius Modeling
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Test candidate operational interventions in silico using deterministic queuing models before execution.
          </p>
        </div>

        {/* Action Link to Action Gateway */}
        <Link
          href="/actions"
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors"
        >
          <span>Open Action Gateway</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Decision Agent Recommendation Banner */}
      <div className="rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-950/20 via-[#121620] to-[#11141A] p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                Autonomous Decision Agent Recommendation
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                RECOMMENDED: Scenario B
              </span>
            </div>
            <p className="text-xs text-gray-200 mt-1 leading-relaxed">
              {comparison.recommendation_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Cards Grid (Candidate Interventions) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-300">
            Candidate Interventions Matrix (4 Scenarios)
          </h2>
          <span className="text-xs font-mono text-gray-400">Click a card to simulate & compare</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparison.scenarios.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            const isRec = sc.recommended;
            return (
              <div
                key={sc.id}
                onClick={() => handleRunSimulation(sc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#161C28] border-sky-500 ring-1 ring-sky-500/50 shadow-md"
                    : isRec
                    ? "bg-[#121620] border-sky-500/40 hover:border-sky-400"
                    : "bg-[#11141A] border-[#202530] hover:border-[#2C3445]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gray-400">{sc.id}</span>
                    {isRec ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                        RECOMMENDED
                      </span>
                    ) : (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        sc.risk_tier === "LOW" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {sc.risk_tier} RISK
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white tracking-tight leading-snug">{sc.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-3 leading-relaxed">
                    {sc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1F2634] space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recovery Time:</span>
                    <span className="font-bold text-white">{sc.predicted_recovery_minutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Residual SLA Risk:</span>
                    <span className={`font-bold ${sc.predicted_sla_risk_final_pct < 10 ? "text-emerald-400" : "text-amber-400"}`}>
                      {sc.predicted_sla_risk_final_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Throughput Restored:</span>
                    <span className="text-gray-200">{sc.predicted_throughput_recovery_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reversibility:</span>
                    <span className="text-gray-200">{sc.reversibility_score_pct}%</span>
                  </div>
                </div>

                <button
                  className={`w-full mt-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                    isSelected
                      ? "bg-sky-500 text-white"
                      : "bg-[#18202E] text-gray-300 hover:text-white"
                  }`}
                >
                  {isSelected ? "Active in Studio" : "Simulate Scenario"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation Progression Terminal & Before vs Predicted After View */}
      {activeSimulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Simulation Execution Phases */}
          <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#202530]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    Model Execution Phases
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {activeSimulationResult.simulation_id}
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {activeSimulationResult.execution_phases.map((ph, idx) => {
                  const isDone = !isSimulating || simStep >= idx + 1;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded border text-xs font-mono transition-all ${
                        isDone
                          ? "bg-[#131720] border-[#222B3D] text-gray-300"
                          : "bg-[#0E1015] border-[#1A1F2B] text-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDone ? "text-sky-300" : "text-gray-500"}`}>
                          {ph.phase}
                        </span>
                        <span className="text-[10px] text-gray-500">{ph.duration_ms}ms</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{ph.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#202530] text-[11px] font-mono text-gray-400">
              <span className="text-emerald-400">✓ Deterministic Queuing Theory ($M/M/c$)</span>
            </div>
          </div>

          {/* Right 2 Cols: Before vs Predicted After Metric Impact & Action Dispatch CTA */}
          <div className="lg:col-span-2 rounded-xl border border-[#202530] bg-[#11141A] p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#202530]">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Before vs. Predicted After Intervention Comparison
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {selectedScenario.code_identifier}
                </span>
              </div>

              {/* Before vs After Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="p-3.5 rounded-lg bg-[#141822] border border-[#232A3B]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Induction Throughput</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-mono text-red-400">780 /hr (Now)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 mx-1" />
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {activeSimulationResult.predicted_throughput} /hr
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    +{Math.round(((activeSimulationResult.predicted_throughput - 780) / 780) * 100)}% Delta
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141822] border border-[#232A3B]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Buffer Queue Depth</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-mono text-amber-400">4,820 pkgs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 mx-1" />
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {activeSimulationResult.predicted_queue_depth} pkgs
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    -80.9% Drain in {selectedScenario.predicted_recovery_minutes}m
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141822] border border-[#232A3B]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Carrier SLA Breach Risk</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-mono text-red-400">88.5% (High)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 mx-1" />
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {activeSimulationResult.predicted_sla_risk}%
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    Nominal Carrier Target Restored
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Rationale */}
            <div className="p-4 rounded-lg bg-[#0E1116] border border-[#242C3D] space-y-1 text-xs">
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase block">
                Model Rationale & Trade-off Analysis:
              </span>
              <p className="text-gray-300 leading-relaxed font-mono text-xs">
                {selectedScenario.decision_rationale}
              </p>
              <div className="flex items-center gap-4 pt-2 text-[10px] font-mono text-gray-400">
                <span>Est. Cost: ${selectedScenario.operational_cost_est_usd}</span>
                <span>•</span>
                <span>Downtime: {selectedScenario.downtime_during_intervention_sec}s</span>
                <span>•</span>
                <span>Blast Radius: {selectedScenario.blast_radius_subsystems.join(", ")}</span>
              </div>
            </div>

            {/* Human Gate & Dispatch to Gateway */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs font-mono text-gray-400">
                <span>Governance Policy: </span>
                <span className="text-amber-400 font-bold">1 Operator Sign-off Required</span>
              </div>

              <Link
                href="/actions"
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <span>Request Approval & Dispatch to Action Gateway</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
