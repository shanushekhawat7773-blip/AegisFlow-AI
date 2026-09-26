"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootCauseRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/incidents/INC-4091");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
      Navigating to Bayesian Root Cause Causal Graph Workspace...
    </div>
  );
}
