"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, Compass } from "lucide-react";

interface Step {
  id: number;
  label: string;
  sub: string;
  href: string;
  statusMatch: (path: string) => boolean;
}

export default function DemoTourBanner() {
  const pathname = usePathname();

  const steps: Step[] = [
    {
      id: 1,
      label: "1. Detect",
      sub: "Anomaly in WH-03",
      href: "/overview",
      statusMatch: (p) => p === "/overview" || p === "/"
    },
    {
      id: 2,
      label: "2. Investigate",
      sub: "Causal Graph & Evidence",
      href: "/incidents/INC-4091",
      statusMatch: (p) => p.includes("/incidents/INC-4091")
    },
    {
      id: 3,
      label: "3. Simulate",
      sub: "Counterfactual Studio",
      href: "/simulations",
      statusMatch: (p) => p.includes("/simulations")
    },
    {
      id: 4,
      label: "4. Approve & Act",
      sub: "Gateway Dispatch",
      href: "/actions",
      statusMatch: (p) => p.includes("/actions")
    },
    {
      id: 5,
      label: "5. Verify",
      sub: "Recovery Telemetry",
      href: "/verification",
      statusMatch: (p) => p.includes("/verification")
    },
    {
      id: 6,
      label: "6. Learn",
      sub: "Executive Post-Mortem",
      href: "/reports/INC-4091",
      statusMatch: (p) => p.includes("/reports")
    }
  ];

  return (
    <div className="bg-[#0C0F14] border-b border-[#202736] px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-sky-400 flex items-center gap-1.5">
            Operational Lifecycle Walkthrough:
          </span>
        </div>

        {/* Steps Carousel / Flow */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-xs">
          {steps.map((step, idx) => {
            const isActive = step.statusMatch(pathname);
            return (
              <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={step.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                    isActive
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium shadow-xs"
                      : "bg-[#141822] hover:bg-[#1A202E] text-gray-400 hover:text-gray-200 border border-[#242C3D]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isActive ? "bg-sky-500 text-white" : "bg-[#202635] text-gray-400"
                  }`}>
                    {step.id}
                  </span>
                  <span className="font-mono text-[11px]">{step.label}</span>
                </Link>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
