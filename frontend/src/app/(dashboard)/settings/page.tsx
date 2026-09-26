"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Sliders,
  Cpu,
  Lock,
  Server,
  Cloud,
  CheckCircle2,
  Save,
  RotateCcw
} from "lucide-react";

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState("deterministic");
  const [awsRegion, setAwsRegion] = useState("us-east-1");
  const [bedrockModelId, setBedrockModelId] = useState("anthropic.claude-3-5-sonnet-20240620-v1:0");
  const [zScoreThreshold, setZScoreThreshold] = useState("2.5");
  const [ewmaAlpha, setEwmaAlpha] = useState("0.3");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Platform Configuration
            </span>
            <span>•</span>
            <span>Enterprise Settings & Security</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            System & Governance Settings
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure AI provider abstractions, anomaly detection sensitivity, and Action Gateway safety policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition-colors"
        >
          {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? "Settings Saved" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Provider & AWS Bedrock */}
        <div className="p-5 rounded-xl border border-[#202530] bg-[#11141A] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#202530]">
            <Cloud className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">AI Engine & Cloud Provider</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-gray-400 mb-1">Active AI Provider:</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full bg-[#161B24] border border-[#252C3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="deterministic">Local Deterministic Provider (Offline Fail-Safe)</option>
                <option value="bedrock">Amazon Bedrock (Claude 3.5 Sonnet / Titan)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">AWS Region:</label>
              <input
                type="text"
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                className="w-full bg-[#161B24] border border-[#252C3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Bedrock Foundation Model ID:</label>
              <input
                type="text"
                value={bedrockModelId}
                onChange={(e) => setBedrockModelId(e.target.value)}
                className="w-full bg-[#161B24] border border-[#252C3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Anomaly Detection Parameters */}
        <div className="p-5 rounded-xl border border-[#202530] bg-[#11141A] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#202530]">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Sentinel Anomaly Detection</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-gray-400 mb-1">Z-Score Alert Threshold (Standard Deviations):</label>
              <input
                type="number"
                step="0.1"
                value={zScoreThreshold}
                onChange={(e) => setZScoreThreshold(e.target.value)}
                className="w-full bg-[#161B24] border border-[#252C3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Default: 2.5 std devs (p &lt; 0.01)</span>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">EWMA Smoothing Factor (α):</label>
              <input
                type="number"
                step="0.05"
                value={ewmaAlpha}
                onChange={(e) => setEwmaAlpha(e.target.value)}
                className="w-full bg-[#161B24] border border-[#252C3D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Higher α gives more weight to recent telemetry</span>
            </div>

            <div className="p-2.5 rounded bg-[#161B24] border border-[#222938] text-[11px] text-gray-300">
              <span className="text-emerald-400 font-bold">Sentinel Active: </span>
              Sampling across 4 facilities at 500ms intervals.
            </div>
          </div>
        </div>

        {/* Card 3: Controlled Action Gateway Allowlist */}
        <div className="p-5 rounded-xl border border-[#202530] bg-[#11141A] space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-[#202530]">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Action Gateway Governance & Allowlist</h3>
          </div>

          <p className="text-xs text-gray-300">
            AegisFlow enforces controlled autonomy. Only explicitly allowlisted actions can be dispatched to facility control controllers. Arbitrary script execution is permanently blocked.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#141822] border border-[#222938]">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block">Tier 1: Low Risk</span>
              <span className="text-white font-bold block mt-1">Autonomous / 1-Click</span>
              <span className="text-gray-400 text-[10px]">Rolling daemon reset, workforce floor rebalance</span>
            </div>

            <div className="p-3 rounded-lg bg-[#141822] border border-[#222938]">
              <span className="text-[10px] font-bold text-amber-400 uppercase block">Tier 2: Medium Risk</span>
              <span className="text-white font-bold block mt-1">1 Human Approval Required</span>
              <span className="text-gray-400 text-[10px]">Dynamic traffic reroute, diverter line bypass</span>
            </div>

            <div className="p-3 rounded-lg bg-[#141822] border border-[#222938]">
              <span className="text-[10px] font-bold text-red-400 uppercase block">Tier 3: High Risk</span>
              <span className="text-white font-bold block mt-1">Dual-Signoff Required</span>
              <span className="text-gray-400 text-[10px]">Switch port isolation, facility intake throttling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
