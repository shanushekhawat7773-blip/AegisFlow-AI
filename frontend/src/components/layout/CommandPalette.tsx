"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  AlertTriangle,
  GitBranch,
  Cpu,
  Terminal,
  CheckCircle2,
  Bot,
  History,
  Play,
  RotateCcw,
  X
} from "lucide-react";
import { api } from "@/lib/api";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { title: "Command Center Overview", path: "/overview", icon: LayoutDashboard, category: "Navigation" },
    { title: "Active Incidents (Warehouse 03)", path: "/incidents", icon: AlertTriangle, category: "Incidents" },
    { title: "Deep Root Cause Investigation (INC-4091)", path: "/incidents/INC-4091", icon: GitBranch, category: "Investigation" },
    { title: "Simulation Studio & Scenarios", path: "/simulations", icon: Cpu, category: "Simulations" },
    { title: "Action Gateway & Command Terminal", path: "/actions", icon: Terminal, category: "Execution" },
    { title: "Continuous Verification Workspace", path: "/verification", icon: CheckCircle2, category: "Verification" },
    { title: "Autonomous AI Agents Directory", path: "/agents", icon: Bot, category: "Architecture" },
    { title: "Tamper-Evident Audit Trail", path: "/audit", icon: History, category: "Audit" }
  ];

  const actions = [
    {
      title: "Activate Demo Scenario: WH-03 Scanner Outage (P1)",
      category: "Demo Trigger",
      icon: Play,
      run: async () => {
        await api.switchScenario("WH-03-ORD_SCANNER_OUTAGE");
        router.push("/overview");
        onClose();
      }
    },
    {
      title: "Activate Demo Scenario: WH-02 Order Surge (P2)",
      category: "Demo Trigger",
      icon: Play,
      run: async () => {
        await api.switchScenario("WH-02-DFW_ORDER_SURGE");
        router.push("/overview");
        onClose();
      }
    },
    {
      title: "Reset Demo Environment to Baseline Incident",
      category: "Demo Trigger",
      icon: RotateCcw,
      run: async () => {
        await api.resetDemo();
        router.push("/overview");
        onClose();
      }
    }
  ];

  const filteredNav = quickNav.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-24 z-50 p-4">
      <div className="bg-[#11141A] border border-[#2A3345] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#202635] gap-3">
          <Search className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, jump to page, or trigger scenario..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-[#1E2533]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-3 py-1">
                Navigation & Workspaces
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#1A202C] text-left text-xs text-gray-200 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-400" />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{item.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Demo Scenario Triggers */}
          {filteredActions.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-sky-400 px-3 py-1">
                Demo Quick Controls
              </p>
              <div className="space-y-0.5">
                {filteredActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={action.run}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#1A202C] text-left text-xs text-gray-200 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-300" />
                        <span className="text-sky-300 font-mono text-xs">{action.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        TRIGGER
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#202635] bg-[#0E1015] flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>AegisFlow Command Interface</span>
          <span className="flex items-center gap-2">
            <span>Esc to close</span>
            <span>↵ to select</span>
          </span>
        </div>
      </div>
    </div>
  );
}
