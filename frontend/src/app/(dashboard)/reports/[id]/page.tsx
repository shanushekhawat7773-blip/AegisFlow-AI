"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronLeft
} from "lucide-react";
import { api } from "@/lib/api";

export default function IncidentReportPage() {
  const params = useParams();
  const incidentId = (params?.id as string) || "INC-4091";
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await api.getIncidentReport(incidentId);
        setReport(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadReport();
  }, [incidentId]);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
        Synthesizing Executive Incident Report...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 print:p-0 print:max-w-full">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2432] print:hidden">
        <Link
          href="/overview"
          className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B24] hover:bg-[#202736] border border-[#283244] text-xs font-mono text-gray-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-gray-400" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Executive Incident Report Document */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] p-8 space-y-8 shadow-2xl print:border-none print:bg-white print:text-black print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#202530] print:border-black">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 print:text-blue-700">
              <span className="font-bold">AEGISFLOW AI</span>
              <span>•</span>
              <span>OPERATIONAL INTELLIGENCE BRIEFING</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1 print:text-black">
              {report.title}
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1 print:text-gray-600">
              Facility: {report.facility} • Classification: {report.classification}
            </p>
          </div>

          <div className="text-right font-mono text-xs text-gray-400 print:text-black shrink-0">
            <span className="text-white font-bold block print:text-black">Ref: {report.report_reference}</span>
            <span>Status: <span className="text-emerald-400 font-bold print:text-green-700">{report.lifecycle_status}</span></span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            1. Executive Briefing
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans print:text-black">
            {report.executive_summary}
          </p>
        </div>

        {/* Operational Impact & Averted Losses */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            2. Operational Impact & Penalty Avoidance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-[#141822] p-3 rounded border border-[#222938] print:border-gray-300 print:bg-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase">Parcels Delayed</span>
              <span className="text-sm font-bold text-white mt-0.5 block print:text-black">
                {report.operational_impact?.delayed_parcels} pkgs
              </span>
            </div>
            <div className="bg-[#141822] p-3 rounded border border-[#222938] print:border-gray-300 print:bg-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase">Penalties Avoided</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block print:text-green-700">
                ${report.operational_impact?.sla_breach_penalties_avoided_usd?.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#141822] p-3 rounded border border-[#222938] print:border-gray-300 print:bg-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase">Recovery MTTR</span>
              <span className="text-sm font-bold text-sky-400 mt-0.5 block print:text-blue-700">
                {report.timestamps?.total_mttr_minutes} min
              </span>
            </div>
            <div className="bg-[#141822] p-3 rounded border border-[#222938] print:border-gray-300 print:bg-gray-100">
              <span className="text-[10px] text-gray-400 block uppercase">Buffer Drainage</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block print:text-green-700">
                {report.operational_impact?.queue_drain_pct}
              </span>
            </div>
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            3. Root Cause Investigation
          </h2>
          <div className="bg-[#0E1116] p-4 rounded-lg border border-[#202530] text-xs font-mono space-y-2 print:border-gray-300 print:bg-gray-50">
            <div>
              <span className="text-gray-400">Primary Failure Mechanism: </span>
              <span className="text-red-400 font-bold print:text-red-700">{report.root_cause_analysis?.primary_failure}</span>
            </div>
            <div>
              <span className="text-gray-400">Causal Propagation: </span>
              <span className="text-gray-200 print:text-black">{report.root_cause_analysis?.causal_mechanism}</span>
            </div>
          </div>
        </div>

        {/* Counterfactual Evaluation Record */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            4. Counterfactual Simulation & Decision Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0E1116] border-b border-[#202530] text-gray-400 text-[10px] uppercase print:border-gray-300">
                <tr>
                  <th className="py-2 px-3">Intervention Candidate</th>
                  <th className="py-2 px-3">Predicted Recovery</th>
                  <th className="py-2 px-3">Residual SLA Risk</th>
                  <th className="py-2 px-3">Evaluation Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2330] print:divide-gray-200">
                {report.evaluated_counterfactuals?.map((c: any, i: number) => (
                  <tr key={i}>
                    <td className="py-2 px-3 text-white font-medium print:text-black">{c.scenario}</td>
                    <td className="py-2 px-3 text-gray-300 print:text-black">{c.predicted_recovery}</td>
                    <td className="py-2 px-3 text-gray-300 print:text-black">{c.predicted_sla_risk}</td>
                    <td className="py-2 px-3 text-sky-400 font-bold print:text-blue-700">{c.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Governance & Human Approval Record */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            5. Human-in-the-Loop Governance & Audit Record
          </h2>
          <div className="bg-[#141822] p-4 rounded-lg border border-[#222938] text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-3 print:border-gray-300 print:bg-gray-50">
            <div>
              <span className="text-gray-400">Risk Policy Tier: </span>
              <span className="text-amber-400 font-bold print:text-amber-700">{report.governance_and_approval?.risk_tier}</span>
            </div>
            <div>
              <span className="text-gray-400">Authorizing Official: </span>
              <span className="text-white font-bold print:text-black">
                {report.governance_and_approval?.approver} ({report.governance_and_approval?.role})
              </span>
            </div>
            <div>
              <span className="text-gray-400">Digital Signature: </span>
              <span className="text-emerald-400 font-bold print:text-green-700">
                {report.governance_and_approval?.digital_signature}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Timestamp: </span>
              <span className="text-gray-300 print:text-black">{report.governance_and_approval?.approval_timestamp}</span>
            </div>
          </div>
        </div>

        {/* Lessons Learned & Runbook Updates */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400 print:text-blue-700">
            6. Preventative Actions & Autonomous Runbook Updates
          </h2>
          <ul className="space-y-1.5 text-xs text-gray-300 font-sans print:text-black list-disc list-inside">
            {report.preventative_actions?.map((act: string, i: number) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
