"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/war-room/dashboard-header";
import { TabNavigation, TabId } from "@/components/war-room/tab-navigation";
import { OpsView } from "@/components/war-room/ops-view";
import { IntelView } from "@/components/war-room/intel-view";
import { TreasuryView } from "@/components/war-room/treasury-view";
import { ArchivesView } from "@/components/war-room/archives-view";

export default function WarRoomPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("ops");

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("tlayersolution_gatekeeper")
        : null;
    if (token === "granted") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.replace("/gatekeeper");
    }
  }, [router]);

  if (isAuthorized === null) return null;
  if (!isAuthorized) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-cyan-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <DashboardHeader />

        {/* Navigation & Content */}
        <div className="flex flex-col gap-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="min-h-[500px]">
            {activeTab === "ops" && <OpsView />}
            {activeTab === "intel" && <IntelView />}
            {activeTab === "treasury" && <TreasuryView />}
            {activeTab === "archives" && <ArchivesView />}
          </div>
        </div>

      </div>
    </main>
  );
}
