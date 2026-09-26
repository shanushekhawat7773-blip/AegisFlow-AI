"use client";

import { useState } from "react";
import {
  Search,
  RotateCcw,
  Sparkles,
  Shield,
  User,
  CheckCircle,
  AlertTriangle,
  Play
} from "lucide-react";
import { UserRole } from "@/lib/types";
import { api } from "@/lib/api";

interface HeaderProps {
  onOpenCommandPalette: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onRefreshData?: () => void;
}

export default function Header({
  onOpenCommandPalette,
  currentRole,
  onChangeRole,
  onRefreshData
}: HeaderProps) {
  const [activeScenario, setActiveScenario] = useState("WH-03-ORD_SCANNER_OUTAGE");
  const [isResetting, setIsResetting] = useState(false);

  const handleScenarioChange = async (scenarioId: string) => {
    setActiveScenario(scenarioId);
    try {
      await api.switchScenario(scenarioId);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      setActiveScenario("WH-03-ORD_SCANNER_OUTAGE");
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsResetting(false), 500);
    }
  };

  return (
    <header className="h-16 bg-[#11141A] border-b border-[#202530] flex items-center justify-between px-6 z-20">
      {/* Left: System Status & Global Search Trigger */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#161B22] border border-[#262D3D] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">Sentinel: ACTIVE</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Health: 99.4%</span>
        </div>

        {/* Global Search / Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#161B24] hover:bg-[#1E2430] border border-[#252C3B] text-gray-400 hover:text-gray-200 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span>Quick actions & search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#0E1116] border border-[#2E3646] text-[10px] font-mono text-gray-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Demo Scenarios, Reset, Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Scenario Switcher for Judges */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0D1016] border border-[#252C3D] rounded-md px-2 py-1">
          <span className="text-[11px] font-mono text-sky-400 flex items-center gap-1">
            <Play className="w-3 h-3 text-sky-400 fill-sky-400" /> Demo:
          </span>
          <select
            value={activeScenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="bg-transparent text-xs text-gray-200 font-mono focus:outline-none cursor-pointer pr-1"
          >
            <option value="WH-03-ORD_SCANNER_OUTAGE" className="bg-[#11141A] text-white">
              Warehouse 03 — Scanner Outage (P1 Primary)
            </option>
            <option value="WH-02-DFW_ORDER_SURGE" className="bg-[#11141A] text-white">
              Warehouse 02 — Flash Order Surge (P2)
            </option>
            <option value="BASELINE_NOMINAL" className="bg-[#11141A] text-white">
              All Facilities — Nominal Baseline
            </option>
          </select>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#161B24] hover:bg-[#202736] border border-[#283244] text-gray-300 hover:text-white text-xs font-mono transition-colors"
          title="Reset demo scenario to initial state"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-gray-400 ${isResetting ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Reset State</span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 bg-[#161B24] border border-[#283244] rounded-md px-2.5 py-1">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-gray-200 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="OPERATOR" className="bg-[#11141A] text-white">Role: Operator</option>
            <option value="ANALYST" className="bg-[#11141A] text-white">Role: Analyst</option>
            <option value="SECURITY_ADMIN" className="bg-[#11141A] text-white">Role: Security Admin</option>
            <option value="ADMINISTRATOR" className="bg-[#11141A] text-white">Role: Administrator</option>
          </select>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#252C3D]">
          <div className="w-7 h-7 rounded-full bg-[#1F2633] border border-[#2E3748] flex items-center justify-center text-xs text-sky-400 font-mono font-bold">
            SC
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-medium text-gray-200 leading-tight">Sarah Chen</span>
            <span className="text-[10px] text-gray-400 font-mono leading-tight">Ops Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
