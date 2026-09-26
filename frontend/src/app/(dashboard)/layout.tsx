"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CommandPalette from "@/components/layout/CommandPalette";
import DemoTourBanner from "@/components/demo/DemoTourBanner";
import { UserRole } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("OPERATOR");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-full bg-[#090B0E] text-[#F0F3F6] overflow-hidden">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          onRefreshData={handleRefresh}
        />

        <DemoTourBanner />

        <main className="flex-1 overflow-y-auto p-6 bg-[#090B0E]">
          {children}
        </main>
      </div>

      {/* Keyboard-accessible Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
