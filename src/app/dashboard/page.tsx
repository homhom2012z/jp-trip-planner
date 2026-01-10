"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import dynamic from "next/dynamic";

// Dynamic imports for heavy components
const GlobalMap = dynamic(() => import("@/components/dashboard/GlobalMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 animate-pulse" />,
});
const DataHealthGrid = dynamic(
  () => import("@/components/dashboard/DataHealthGrid"),
  { ssr: false }
);
const ItineraryBoard = dynamic(
  () => import("@/components/dashboard/ItineraryBoard"),
  {
    ssr: false,
  }
);
const BucketList = dynamic(() => import("@/components/dashboard/BucketList"), {
  ssr: false,
});
const DangerZone = dynamic(() => import("@/components/dashboard/DangerZone"), {
  ssr: false,
});

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"map" | "grid" | "itinerary">(
    "map"
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fcf8f9]">
        <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
          refresh
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f9] pb-20">
      <DashboardHero currentView={currentView} setView={setCurrentView} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Data Grid View */}
        {currentView === "grid" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Data Verification
              </h2>
              <p className="text-sm text-gray-500">
                Check for missing photos or coordinates
              </p>
            </div>
            <DataHealthGrid />
            <div className="mt-8">
              <DangerZone />
            </div>
          </div>
        )}

        {/* Itinerary View */}
        {currentView === "itinerary" && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 h-[calc(100vh-200px)]">
            <ItineraryBoard />
          </div>
        )}

        {/* Map View (Default) */}
        {currentView === "map" && (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[#202124]">
                Trip Overview
              </h2>
              <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
                <GlobalMap />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#202124] mb-6">
                Your Bucket List
              </h2>
              <BucketList />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
