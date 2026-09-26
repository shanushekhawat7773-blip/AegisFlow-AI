"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecommendationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/simulations");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
      Navigating to Decision Agent Recommendations & Simulation Studio...
    </div>
  );
}
