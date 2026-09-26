"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  FileText,
  Search,
  ChevronRight,
  Database,
  Terminal,
  Activity,
  Maximize2
} from "lucide-react";
import { api } from "@/lib/api";
import { Incident, EvidenceItem, CausalNode, EvidenceType } from "@/lib/types";

export default function IncidentInvestigationPage() {
  const params = useParams();
  const incidentId = (params?.id as string) || "INC-4091";

  const [incident, setIncident] = useState<Incident | null>(null);
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);
  const [activeEvidenceFilter, setActiveEvidenceFilter] = useState<string>("ALL");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    async function loadIncident() {
      try {
        const inc = await api.getIncident(incidentId);
        setIncident(inc);
        if (inc.causal_graph?.nodes?.length) {
          const rootNode = inc.causal_graph.nodes.find(n => n.is_root_cause) || inc.causal_graph.nodes[0];
          setSelectedNode(rootNode);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadIncident();
  }, [incidentId]);

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Loading Incident Investigation Workspace #{incidentId}...
      </div>
    );
  }

  const causalGraph = incident.causal_graph;
  const evidenceList = incident.evidence || [];

  const filteredEvidence = evidenceList.filter(ev => {
    if (activeEvidenceFilter === "ALL") return true;
    return ev.evidence_type === activeEvidenceFilter;
  });

  const stages = [
    { name: "Anomaly Detected", time: "10:53:12 UTC", status: "COMPLETED", detail: "Sentinel Agent Z-score 4.82 breach" },
    { name: "Historical Comparison", time: "10:53:28 UTC", status: "COMPLETED", detail: "Matched against 12 historical incidents" },
    { name: "Logs Correlated", time: "10:54:02 UTC", status: "COMPLETED", detail: "Switch CRC errors linked to scanner 504s" },
    { name: "Dependency Analysis", time: "10:54:19 UTC", status: "COMPLETED", detail: "Subnet topology map traversed" },
    { name: "Root Cause Identified", time: "10:54:40 UTC", status: "COMPLETED", detail: "Core Switch SW-03 buffer overrun isolated" },
    { name: "Intervention Simulated", time: "10:55:10 UTC", status: "COMPLETED", detail: "4 counterfactual candidates modeled" },
    { name: "Recommendation Generated", time: "10:55:25 UTC", status: "COMPLETED", detail: "Scenario B (Dynamic Reroute) selected" },
    { name: "Approval Requested", time: "10:55:30 UTC", status: "ACTIVE", detail: "Awaiting Operator digital sign-off" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Incident Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <Link href="/incidents" className="hover:text-sky-400">Incidents</Link>
            <span>/</span>
            <span className="text-gray-200">Investigation Workspace</span>
            <span>/</span>
            <span className="text-sky-400">{incident.id}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {incident.title}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              P1 CRITICAL
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {incident.status}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            Facility: <span className="text-gray-200 font-medium">{incident.facility_name}</span> • 
            Detected: <span className="text-gray-200 font-mono">{incident.detected_at}</span> • 
            SLA Risk: <span className="text-red-400 font-bold font-mono">{incident.sla_risk_pct}%</span>
          </p>
        </div>

        {/* Action Button to Simulation Studio */}
        <div className="flex items-center gap-3">
          <Link
            href="/simulations"
            className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors"
          >
            <Cpu className="w-4 h-4" />
            <span>Proceed to Simulation Studio</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Investigation Lifecycle Progress Bar */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-4 overflow-x-auto">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-3 font-semibold">
          Autonomous Investigation Progression
        </span>
        <div className="flex items-center justify-between min-w-[750px] gap-2">
          {stages.map((st, i) => {
            const isCompleted = st.status === "COMPLETED";
            const isActive = st.status === "ACTIVE";
            return (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold mb-1.5 z-10 ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : isActive
                      ? "bg-sky-500 text-white animate-pulse"
                      : "bg-[#1A202C] text-gray-500 border border-[#2D3748]"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] font-medium leading-tight ${isActive ? "text-sky-300 font-bold" : "text-gray-300"}`}>
                  {st.name}
                </span>
                <span className="text-[9px] font-mono text-gray-500 mt-0.5">{st.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Causal Chain Visualization & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Causal Chain Graph */}
        <div className="lg:col-span-2 rounded-xl border border-[#202530] bg-[#11141A] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Root Cause Causal Chain</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Directed dependency graph synthesized by Bayesian Root Cause Agent v1.8
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              Root Cause Isolated: Switch SW-03
            </span>
          </div>

          {/* Graph Nodes View */}
          <div className="flex-1 flex flex-col justify-center space-y-3 py-4">
            {causalGraph?.nodes?.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isRoot = node.is_root_cause;
              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#182030] border-sky-500 shadow-md ring-1 ring-sky-500/50"
                        : isRoot
                        ? "bg-[#181215] border-red-500/50 hover:border-red-400"
                        : "bg-[#151922] border-[#252C3D] hover:border-[#38435C]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isRoot ? "bg-red-500 animate-pulse" : "bg-amber-400"
                          }`}
                        />
                        <span className="text-xs font-mono font-bold text-white">
                          {node.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E1116] text-gray-400 border border-[#242C3D]">
                          {node.subsystem}
                        </span>
                        {isRoot && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                            ROOT CAUSE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#222938] text-[11px] font-mono text-gray-400">
                      <div>
                        <span>Observed: </span>
                        <span className="text-red-400 font-bold">{node.metric_value}</span>
                      </div>
                      <div>
                        <span>Baseline: </span>
                        <span className="text-gray-300">{node.baseline_value}</span>
                      </div>
                      <div>
                        <span>Confidence: </span>
                        <span className="text-sky-400">{Math.round(node.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {idx < (causalGraph?.nodes?.length || 0) - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="w-0.5 h-4 bg-sky-500/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Root Cause AI Summary */}
          <div className="mt-4 p-3 rounded-lg bg-[#0E1116] border border-[#242C3D] text-xs text-gray-300 leading-relaxed font-mono">
            <span className="text-sky-400 font-bold block mb-1">
              [AGENT REASONING SUMMARY]:
            </span>
            {causalGraph?.root_cause_summary}
          </div>
        </div>

        {/* Right Col: Selected Node Inspector & Subsystem Telemetry */}
        <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#202530]">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                Node Inspector
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {selectedNode?.id}
              </span>
            </div>

            {selectedNode && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
                  <span className="text-xs text-gray-400 mt-0.5 block">Subsystem: {selectedNode.subsystem}</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-[#151922] p-2.5 rounded border border-[#222938]">
                    <span className="text-[10px] text-gray-400 uppercase block">Telemetry Metric</span>
                    <span className="text-sm font-bold text-red-400 mt-0.5 block">
                      {selectedNode.metric_value}
                    </span>
                    <span className="text-[10px] text-gray-400">Expected: {selectedNode.baseline_value}</span>
                  </div>

                  <div className="bg-[#151922] p-2.5 rounded border border-[#222938]">
                    <span className="text-[10px] text-gray-400 uppercase block">Causal Confidence</span>
                    <span className="text-sm font-bold text-sky-400 mt-0.5 block">
                      {Math.round(selectedNode.confidence * 100)}% Verified
                    </span>
                    <span className="text-[10px] text-gray-400">P-value &lt; 0.0001 (Pearson r = 0.94)</span>
                  </div>
                </div>

                {/* Evidence Links */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400 block mb-2 font-semibold">
                    Supporting Evidence Items
                  </span>
                  <div className="space-y-1.5">
                    {selectedNode.evidence_ids.map(eid => {
                      const evItem = evidenceList.find(e => e.id === eid);
                      return (
                        <div
                          key={eid}
                          onClick={() => setSelectedEvidence(evItem || null)}
                          className="p-2 rounded bg-[#161B24] border border-[#252C3D] hover:border-sky-500/50 cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-sky-400 font-bold">{eid}</span>
                            <span className="text-[9px] font-mono px-1 rounded bg-[#1F2633] text-gray-300">
                              {evItem?.evidence_type}
                            </span>
                          </div>
                          <span className="text-gray-300 text-[11px] mt-0.5 block truncate">
                            {evItem?.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#202530]">
            <Link
              href="/simulations"
              className="w-full py-2 px-3 rounded-lg bg-[#1B2230] hover:bg-[#252E40] border border-[#2E394E] text-xs font-semibold text-center block text-sky-300 transition-colors"
            >
              Test Interventions in Simulation Studio &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise Evidence Drawer (Observed vs Correlated vs Inferred vs Predicted) */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#202530]">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Enterprise Evidence Drawer</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified telemetry observations clearly distinguished from AI-generated causal inference.
            </p>
          </div>

          {/* Evidence Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#0E1116] p-1 rounded-lg border border-[#202530] text-xs font-mono">
            {["ALL", "OBSERVED", "CORRELATED", "INFERRED", "PREDICTED"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveEvidenceFilter(tab)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeEvidenceFilter === tab
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEvidence.map((ev) => {
            const isObserved = ev.evidence_type === "OBSERVED";
            const isCorrelated = ev.evidence_type === "CORRELATED";
            const isInferred = ev.evidence_type === "INFERRED";
            const isPredicted = ev.evidence_type === "PREDICTED";

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvidence(ev)}
                className="p-3.5 rounded-lg border bg-[#141822] border-[#222938] hover:border-[#333E54] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-gray-400">{ev.id}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isObserved
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isCorrelated
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : isInferred
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {ev.evidence_type}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-tight">{ev.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1F2634] flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="truncate max-w-[140px]">{ev.source}</span>
                  <span className="text-sky-400 font-bold">{Math.round(ev.confidence * 100)}% conf</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Evidence Payload Inspector Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#11141A] border border-[#283244] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#202530]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{selectedEvidence.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B2230] text-gray-300">
                    {selectedEvidence.evidence_type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedEvidence.title}</h3>
                <span className="text-xs text-gray-400 font-mono">Source: {selectedEvidence.source}</span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1E2533]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {selectedEvidence.description}
            </p>

            {selectedEvidence.telemetry_delta && (
              <div className="bg-[#151922] p-3 rounded border border-[#222938] text-xs font-mono">
                <span className="text-gray-400 block text-[10px] uppercase">Observed Signal Delta:</span>
                <span className="text-red-400 font-bold">{selectedEvidence.telemetry_delta}</span>
              </div>
            )}

            {selectedEvidence.raw_payload && (
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Raw Sensor / Syslog Telemetry Payload (JSON)
                </span>
                <pre className="bg-[#090B0E] p-3 rounded border border-[#1E2432] text-xs font-mono text-emerald-400 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedEvidence.raw_payload, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 rounded-md bg-[#1C2230] hover:bg-[#252D40] text-xs font-medium text-gray-200 border border-[#2E374C]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
