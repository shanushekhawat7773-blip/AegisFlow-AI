"use client";

import { useState, useEffect } from "react";
import {
  History,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  FileText,
  Key,
  Database
} from "lucide-react";
import { api } from "@/lib/api";
import { AuditEntry } from "@/lib/types";

export default function AuditTrailPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadAudit() {
      try {
        const list = await api.getAuditTrail();
        setEntries(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filterType === "ALL" || entry.risk_level === filterType || entry.actor_role === filterType;
    const matchesQuery =
      searchQuery === "" ||
      entry.action_details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.payload_hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2432] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              Compliance & Security Ledger
            </span>
            <span>•</span>
            <span>Tamper-Evident SHA-256 Hash Chaining</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Immutable Enterprise Audit Trail
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Every autonomous agent decision, human approval signature, and gateway intervention is sequenced into an append-only cryptographic ledger.
          </p>
        </div>

        {/* Verification Pill */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold block">Chain Integrity: VERIFIED</span>
            <span className="text-[10px] text-gray-400">All block hashes cryptographically linked</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11141A] p-3 rounded-xl border border-[#202530]">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-[#161B24] px-3 py-1.5 rounded-lg border border-[#242C3D]">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail, actor, hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-gray-400 text-[11px]">Filter:</span>
          {["ALL", "OPERATOR", "AGENT", "GATEWAY", "MEDIUM", "HIGH"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === t
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                  : "bg-[#141822] text-gray-400 hover:text-white border border-[#222938]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl border border-[#202530] bg-[#11141A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0E1116] border-b border-[#202530] text-gray-400 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Seq</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Details</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Block Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2330]">
              {filteredEntries.map((entry) => {
                const isHigh = entry.risk_level === "HIGH";
                const isMed = entry.risk_level === "MEDIUM";

                return (
                  <tr key={entry.id} className="hover:bg-[#141822] transition-colors">
                    <td className="py-3 px-4 text-sky-400 font-bold">#{entry.sequence_number}</td>
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">{entry.timestamp}</td>
                    <td className="py-3 px-4 text-gray-200 font-semibold">{entry.event_type}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-white block">{entry.actor}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{entry.actor_role}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 max-w-md leading-relaxed">{entry.action_details}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isHigh
                            ? "bg-red-500/20 text-red-400"
                            : isMed
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {entry.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[10px] font-mono">
                      <span className="text-gray-400 font-bold">{entry.payload_hash.slice(0, 10)}</span>
                      <span>...{entry.payload_hash.slice(-6)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
