"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Layers,
  Radio,
  Server,
  Cpu,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { FacilityStatus, TelemetryHistory } from "@/lib/types";

export default function LiveOperationsPage() {
  const [facilities, setFacilities] = useState<FacilityStatus[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState("WH-03-ORD");
  const [history, setHistory] = useState<TelemetryHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const facs = await api.getFacilities();
        setFacilities(facs);
        const hist = await api.getHistory(selectedFacilityId, 30);
        setHistory(hist);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [selectedFacilityId]);

  const activeFac = facilities.find(f => f.facility_id === selectedFacilityId) || facilities[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-sky-400 font-semibold uppercase tracking-wider">
              Live Telemetry & Topology Stream
            </span>
            <span>•</span>
            <span>Edge Sampling: 500ms</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Fulfillment Center Network Topology
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time physical sensor data, network switch counters, optical scanners, and induction line metrics.
          </p>
        </div>

        {/* Facility Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#11141A] p-1.5 rounded-xl border border-[#202530] text-xs font-mono overflow-x-auto">
          {facilities.map((fac) => (
            <button
              key={fac.facility_id}
              onClick={() => setSelectedFacilityId(fac.facility_id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedFacilityId === fac.facility_id
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {fac.facility_name.split(" ")[0]} ({fac.facility_id.split("-")[1]})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Facility Deep Telemetry Card */}
      {activeFac && (
        <div className="rounded-xl border border-[#202530] bg-[#11141A] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#202530]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-gray-400">{activeFac.facility_id}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    activeFac.status === "critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {activeFac.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeFac.facility_name}</h2>
              <span className="text-xs text-gray-400 font-mono">{activeFac.location}</span>
            </div>

            {activeFac.status === "critical" && (
              <Link
                href="/incidents/INC-4091"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono flex items-center gap-2 shadow-md transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Incident: Investigate &rarr;</span>
              </Link>
            )}
          </div>

          {/* Real-time Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#141822] p-4 rounded-lg border border-[#222938]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Induction Throughput</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {activeFac.current_throughput} <span className="text-xs text-gray-400 font-normal">/hr</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">Target: {activeFac.target_throughput}/hr</span>
            </div>

            <div className="bg-[#141822] p-4 rounded-lg border border-[#222938]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Buffer Queue Depth</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                {activeFac.queue_depth} <span className="text-xs text-gray-400 font-normal">pkgs</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">Safe Capacity: 2,500</span>
            </div>

            <div className="bg-[#141822] p-4 rounded-lg border border-[#222938]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Scanner Availability</span>
              <span className={`text-xl font-bold font-mono mt-1 block ${activeFac.scanner_availability < 80 ? "text-red-400" : "text-emerald-400"}`}>
                {activeFac.scanner_availability}%
              </span>
              <span className="text-[10px] font-mono text-gray-400">Lines 1-8 Readers</span>
            </div>

            <div className="bg-[#141822] p-4 rounded-lg border border-[#222938]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Intra-Facility RTT</span>
              <span className={`text-xl font-bold font-mono mt-1 block ${activeFac.network_latency_ms > 50 ? "text-red-400" : "text-sky-400"}`}>
                {activeFac.network_latency_ms} <span className="text-xs text-gray-400 font-normal">ms</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">Packet Loss: {activeFac.packet_loss_pct}%</span>
            </div>
          </div>

          {/* Time Series History Table */}
          {history && (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold block mb-2">
                Rolling 30-Minute Telemetry Log Window
              </span>
              <div className="rounded-lg border border-[#1F2636] bg-[#0E1116] overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141924] border-b border-[#202738] text-gray-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Throughput (/hr)</th>
                      <th className="py-2.5 px-3">Queue Depth</th>
                      <th className="py-2.5 px-3">Scanner Avail</th>
                      <th className="py-2.5 px-3">Latency (ms)</th>
                      <th className="py-2.5 px-3">Packet Loss</th>
                      <th className="py-2.5 px-3">Anomaly Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2230]">
                    {history.points.slice(-10).map((pt, i) => (
                      <tr key={i} className="hover:bg-[#131722]">
                        <td className="py-2 px-3 text-gray-400">{pt.timestamp}</td>
                        <td className={`py-2 px-3 ${pt.metrics.throughput < 1000 ? "text-red-400 font-bold" : "text-gray-200"}`}>
                          {pt.metrics.throughput}
                        </td>
                        <td className={`py-2 px-3 ${pt.metrics.queue_depth > 3000 ? "text-amber-400 font-bold" : "text-gray-300"}`}>
                          {pt.metrics.queue_depth}
                        </td>
                        <td className={`py-2 px-3 ${pt.metrics.scanner_availability < 60 ? "text-red-400" : "text-gray-300"}`}>
                          {pt.metrics.scanner_availability}%
                        </td>
                        <td className="py-2 px-3 text-gray-300">{pt.metrics.network_latency}</td>
                        <td className="py-2 px-3 text-gray-300">{pt.metrics.packet_loss}%</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                            pt.anomaly_detected ? "bg-red-500/20 text-red-400 font-bold" : "text-gray-500"
                          }`}>
                            {pt.anomaly_score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
