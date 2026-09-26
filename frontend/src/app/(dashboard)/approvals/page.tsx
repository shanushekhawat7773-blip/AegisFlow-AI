"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApprovalsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/actions");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64 text-gray-400 font-mono text-xs">
      Navigating to Action Gateway & Human-in-the-Loop Approval Center...
    </div>
  );
}
