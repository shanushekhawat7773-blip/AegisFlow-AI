"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  GitBranch,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Bot,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Layers,
  History,
  Settings as SettingsIcon,
  Play
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { name: "Command Center", href: "/overview", icon: LayoutDashboard },
    { name: "Live Operations", href: "/operations", icon: Activity },
    { name: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "1 P1", badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30" },
    { name: "Investigation", href: "/incidents/INC-4091", icon: GitBranch },
    { name: "Simulation Studio", href: "/simulations", icon: Cpu, badge: "Flagship", badgeColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30" },
    { name: "Action Gateway", href: "/actions", icon: Terminal },
    { name: "Verification", href: "/verification", icon: CheckCircle2 },
    { name: "AI Agents", href: "/agents", icon: Bot, badge: "9", badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
    { name: "Audit Trail", href: "/audit", icon: History },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Executive Reports", href: "/reports/INC-4091", icon: FileText },
    { name: "Demo Lab", href: "/demo", icon: Play, badge: "7 Scenarios", badgeColor: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" },
    { name: "Settings", href: "/settings", icon: SettingsIcon }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#11141A] border-r border-[#202530] transition-all duration-200 z-30 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#202530]">
        {!collapsed && (
          <Link href="/overview" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-sky-400 font-mono font-bold text-base shadow-sm">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                AegisFlow <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase font-mono">Ops Intelligence</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/overview" className="mx-auto">
            <div className="w-8 h-8 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-sky-400 font-mono font-bold text-base shadow-sm">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1E232E] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Environment Pill */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-[#202530]/60 bg-[#0B0D11]">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AWS us-east-1
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1C212B] text-gray-300 border border-[#283040]">
              DEMO SIM
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#1E2533] text-white border border-sky-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#171B24]"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sky-400" : "text-gray-400"}`} />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${item.badgeColor || "bg-gray-800 text-gray-300"}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Closed Loop Tagline Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-[#202530] bg-[#0D0F13] text-[10px] text-gray-400">
          <p className="font-mono text-gray-300 font-semibold mb-0.5">Detect • Simulate • Act</p>
          <p className="text-gray-400 leading-tight">From operational signal to verified action.</p>
        </div>
      )}
    </aside>
  );
}
