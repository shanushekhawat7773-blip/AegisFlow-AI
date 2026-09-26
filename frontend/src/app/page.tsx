"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  GitBranch,
  Cpu,
  Terminal,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Server,
  Cloud
} from "lucide-react";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(0);

  const workflowStages = [
    {
      id: "detect",
      name: "1. Detect",
      agent: "Sentinel Anomaly Agent",
      title: "Real-time Multi-Sensor Telemetry Ingestion",
      summary: "Continuously monitors throughput vectors, optical scanner availability, buffer queue depth, and network latency using statistical EWMA and dynamic Z-score thresholds.",
      badge: "Z-score > 2.5",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
      codeSnippet: `// Sentinel Anomaly Trigger\n{\n  "facility": "WH-03-ORD",\n  "metric": "induction_throughput",\n  "observed": 780.0,\n  "baseline": 1600.0,\n  "z_score": 4.82,\n  "anomaly_confidence": 0.94\n}`
    },
    {
      id: "investigate",
      name: "2. Investigate",
      agent: "Investigation Agent",
      title: "Cross-Subsystem Signal Correlation",
      summary: "Traverses distributed topology maps in real time, linking interface TenGigE0/1/24 CRC packet drops on Core Switch SW-03 to HTTP 504 timeouts on the optical barcode scanner subnet.",
      badge: "Causal Graph",
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      codeSnippet: `// Investigation Signal Correlation\n{\n  "source_device": "Switch-SW-03.ord",\n  "correlated_event": "Scanner-Cluster-Rack08.504",\n  "correlation_coefficient": 0.982,\n  "evidence_items": 6\n}`
    },
    {
      id: "simulate",
      name: "3. Simulate",
      agent: "Simulation Agent",
      title: "In Silico Counterfactual Modeling",
      summary: "Evaluates candidate operational interventions before dispatching physical commands. Applies deterministic queuing theory (M/M/c) to forecast queue drain time, recovery duration, and collateral blast radius.",
      badge: "M/M/c Fluid Dynamics",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      codeSnippet: `// Counterfactual Scenario Evaluation\n{\n  "scenario_b": "traffic.reroute_processing_queue",\n  "predicted_recovery_min": 6,\n  "predicted_throughput": 1580.0,\n  "residual_sla_risk": "2.8%",\n  "downtime_sec": 0\n}`
    },
    {
      id: "approve",
      name: "4. Approve",
      agent: "Risk Governance Agent",
      title: "Human-in-the-Loop Policy Gate",
      summary: "Enforces enterprise security boundaries and least-privilege action allowlists. Classifies actions into Risk Tiers: Low (autonomous), Medium (single operator sign-off), and High (multi-party authorization).",
      badge: "Role-Based Sign-off",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      codeSnippet: `// Policy Evaluation Gate\n{\n  "action": "traffic.reroute_processing_queue",\n  "risk_tier": "MEDIUM",\n  "approvals_required": 1,\n  "authorizing_role": "OPERATOR",\n  "status": "APPROVED"\n}`
    },
    {
      id: "act",
      name: "5. Act",
      agent: "Controlled Action Gateway",
      title: "Allowlisted Command Dispatch",
      summary: "Dispatches cryptographically verified, idempotent commands to facility edge routers over mutual TLS. Automatically snapshots system state before execution to guarantee zero-loss rollback.",
      badge: "mTLS Allowlist",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      codeSnippet: `// Gateway Execution Dispatch\n{\n  "dispatch_target": "ord-gw-01.internal:8443",\n  "idempotency_token": "aegis_token_90f23a",\n  "rollback_snapshot": "SNAP-ORD-4091",\n  "status": "COMPLETED"\n}`
    },
    {
      id: "verify",
      name: "6. Verify",
      agent: "Verification Agent",
      title: "Continuous Telemetry Drift Watcher",
      summary: "Mathematically compares pre-intervention and post-intervention telemetry. Validates throughput restoration, monitors buffer drainage, and watches for telemetry drift across a 15-minute stability window.",
      badge: "Statistical Recovery",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      codeSnippet: `// Recovery Verification Result\n{\n  "status": "VERIFIED_RECOVERED",\n  "throughput_delta": "+100.6%",\n  "queue_drained": "80.5%",\n  "sla_risk_collapse": "88.5% -> 2.9%",\n  "confidence": 0.991\n}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#090B0E] text-[#F0F3F6] flex flex-col selection:bg-sky-500/30">
      {/* Editorial Navigation Bar */}
      <header className="h-16 border-b border-[#1E232E] px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-sky-400 font-mono font-bold text-base shadow-sm">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
            AegisFlow <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs font-mono text-gray-400">
            AWS Hackathon Enterprise Flagship
          </span>
          <Link
            href="/overview"
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition-colors"
          >
            <span>Launch Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Editorial Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 lg:py-24 space-y-16">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141822] border border-[#242C3D] text-xs font-mono text-sky-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Operational Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            From operational signal to verified action.
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl font-normal">
            AegisFlow AI closes the loop between cloud observability and mission-critical physical operations. It detects emerging failures, isolates Bayesian root causes, simulates counterfactual interventions, and verifies system recovery.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <Link
              href="/overview"
              className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl transition-colors font-mono"
            >
              <span>Enter Operational Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/incidents/INC-4091"
              className="px-6 py-3 rounded-lg bg-[#141822] hover:bg-[#1E2432] border border-[#262E3E] text-gray-300 text-sm font-semibold flex items-center justify-center gap-2 transition-colors font-mono"
            >
              <Activity className="w-4 h-4 text-red-400" />
              <span>Inspect P1 Live Incident</span>
            </Link>
          </div>
        </div>

        {/* Tagline Pillar Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#1C212B]">
          <div className="p-4 rounded-xl bg-[#11141A] border border-[#1F2532]">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase block">1. Predict</span>
            <p className="text-xs text-gray-400 mt-1">Multi-sensor telemetry stream anomaly scoring with EWMA and Z-scores.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#11141A] border border-[#1F2532]">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase block">2. Investigate</span>
            <p className="text-xs text-gray-400 mt-1">Cross-subsystem topology correlation and directed causal chain graph synthesis.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#11141A] border border-[#1F2532]">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase block">3. Simulate</span>
            <p className="text-xs text-gray-400 mt-1">Deterministic queuing theory models evaluate candidate interventions in silico.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#11141A] border border-[#1F2532]">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase block">4. Act & Verify</span>
            <p className="text-xs text-gray-400 mt-1">Role-based approval gate, allowlisted execution, and mathematical verification.</p>
          </div>
        </div>

        {/* Interactive 6-Stage Closed-Loop Interactive Visualizer */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400">
                Closed-Loop Operational Workflow
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                How AegisFlow Resolves an Operational Incident
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Click stages to step through the lifecycle
            </span>
          </div>

          <div className="rounded-xl border border-[#202530] bg-[#11141A] overflow-hidden shadow-2xl">
            {/* Stage Selector Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-[#202530] bg-[#0E1116] text-xs font-mono">
              {workflowStages.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(i)}
                  className={`py-3 px-2 text-center transition-colors border-r last:border-r-0 border-[#202530] ${
                    activeStage === i
                      ? "bg-[#161C28] text-sky-300 font-bold border-b-2 border-b-sky-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            {/* Stage Details Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${workflowStages[activeStage].badgeColor}`}>
                    {workflowStages[activeStage].badge}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    Agent: <span className="text-gray-200">{workflowStages[activeStage].agent}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {workflowStages[activeStage].title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {workflowStages[activeStage].summary}
                </p>

                <div className="pt-2">
                  <Link
                    href="/overview"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 font-bold"
                  >
                    <span>Inspect this stage in live platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Code / Telemetry Payload Preview */}
              <div className="rounded-lg border border-[#202530] bg-[#090B0E] p-4 font-mono text-xs text-sky-300 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A202C] text-[10px] text-gray-500">
                  <span>TELEMETRY PAYLOAD</span>
                  <span>JSON / IDEMPOTENT</span>
                </div>
                <pre>{workflowStages[activeStage].codeSnippet}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* AWS Architecture Alignment Blueprint Section */}
        <div className="rounded-xl border border-[#202530] bg-[#11141A] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Enterprise AWS Cloud Native Architecture
            </h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
            AegisFlow AI is engineered for enterprise AWS deployments. Telemetry events ingest via <strong className="text-white">Amazon EventBridge</strong>, anomaly detection feeds into <strong className="text-white">Amazon OpenSearch & CloudWatch</strong>, counterfactual reasoning leverages <strong className="text-white">Amazon Bedrock (Claude 3.5 Sonnet & Titan)</strong>, and execution dispatches through secure <strong className="text-white">AWS Lambda & ECS</strong> micro-services with role authentication via <strong className="text-white">Amazon Cognito</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded bg-[#141822] border border-[#222938]">
              <span className="text-sky-400 font-bold block">Amazon Bedrock</span>
              <span className="text-[10px] text-gray-400">Agentic Reasoning & Synthesis</span>
            </div>
            <div className="p-3 rounded bg-[#141822] border border-[#222938]">
              <span className="text-sky-400 font-bold block">Amazon EventBridge</span>
              <span className="text-[10px] text-gray-400">Real-time Telemetry Routing</span>
            </div>
            <div className="p-3 rounded bg-[#141822] border border-[#222938]">
              <span className="text-sky-400 font-bold block">Amazon OpenSearch</span>
              <span className="text-[10px] text-gray-400">Log Correlation & Causal Indices</span>
            </div>
            <div className="p-3 rounded bg-[#141822] border border-[#222938]">
              <span className="text-sky-400 font-bold block">AWS Lambda / ECS</span>
              <span className="text-[10px] text-gray-400">Controlled Action Gateway</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C212B] py-8 px-6 lg:px-12 text-xs font-mono text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-white font-bold">AegisFlow AI</span> — Predict. Investigate. Simulate. Act.
        </div>
        <div>From operational signal to verified action.</div>
      </footer>
    </div>
  );
}
