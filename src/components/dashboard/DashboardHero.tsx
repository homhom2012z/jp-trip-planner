import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useSync } from "@/hooks/useSync";
import ShareModal from "./ShareModal";
import toast from "react-hot-toast";
import { api } from "@/services/api";

import { useLanguage } from "@/context/LanguageContext";

interface DashboardHeroProps {
  currentView: "map" | "grid" | "itinerary";
  setView: (view: "map" | "grid" | "itinerary") => void;
}

export default function DashboardHero({
  currentView,
  setView,
}: DashboardHeroProps) {
  const { user, profile, locations, refreshProfile } = useUser();
  const { isSyncing, handleSync } = useSync();
  const { t } = useLanguage();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const cityCount = new Set(locations.map((l) => l.city)).size;
  const totalSpots = locations.length;
  // Use activeTripId to check if we are on a shared trip
  const isOwner = user?.id === (profile?.id || user?.id);
  const isLinked = !!profile?.spreadsheet_id;

  if (!user || !profile) return null;

  return (
    <div className="relative bg-[#202124] text-white overflow-hidden">
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        user={user}
        onProfileUpdate={refreshProfile}
        isOwner={isOwner}
      />

      {/* Background Pattern or Image */}
      <div className="absolute inset-0 bg-[url('/dashboard-bg.jpg')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#202124] via-black/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${
                isOwner ? "bg-blue-600" : "bg-purple-600"
              }`}
            >
              {profile.email?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-200 text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {isOwner
                ? t("myTrip")
                : `${t("editing")}: ${profile.full_name || profile.email}`}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-white drop-shadow-md">
            {profile.full_name ? `${profile.full_name}'s Trip` : "Japan Trip"}
          </h1>
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">{totalSpots}</span>
              <span>{t("savedPlaces")}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">{cityCount}</span>
              <span>{t("cities")}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLinked
                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "bg-red-500"
                }`}
              />
              <span>{isLinked ? t("sheetConnected") : t("noSheet")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="grid grid-cols-3 gap-1 md:flex bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setView("map")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === "map"
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">map</span>
              {t("mapView")}
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === "grid"
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                grid_view
              </span>
              {t("listView")}
            </button>
            <button
              onClick={() => setView("itinerary")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === "itinerary"
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                calendar_month
              </span>
              {t("itineraryView")}
            </button>
          </div>
        </div>

        {/* Action Buttons: Always visible if valid user */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 sm:mt-0">
          {/* Connect Sheet Button - Show if NOT linked */}
          {!isLinked && isOwner && (
            <button
              onClick={async () => {
                try {
                  const url = await api.getGoogleAuthUrl();
                  window.location.href = url;
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to get auth url");
                }
              }}
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined">add_link</span>
              {t("connectSheet")}
            </button>
          )}

          {/* Sync Button - Only if Linked AND Owner */}
          {isLinked && isOwner && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 whitespace-nowrap flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-[#1a73e8]"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isSyncing ? "animate-spin" : ""
                }`}
              >
                refresh
              </span>
              {isSyncing ? t("syncing") : t("syncNow")}
            </button>
          )}

          {/* Reconnect (Refresh Token) */}
          {isLinked && isOwner && (
            <button
              onClick={async () => {
                try {
                  const url = await api.getGoogleAuthUrl();
                  window.location.href = url;
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to get auth url");
                }
              }}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-all shadow-lg border border-white/10"
              title={t("reconnectSheet")}
            >
              <span className="material-symbols-outlined text-[20px]">
                sync_lock
              </span>
            </button>
          )}

          {/* Disconnect */}
          {isLinked && isOwner && (
            <button
              onClick={async () => {
                if (!confirm(t("disconnectSheet") + "?")) return;
                try {
                  await api.disconnectSheet(profile.id);
                  toast.success("Disconnected");
                  window.location.reload();
                } catch (e) {
                  toast.error("Failed");
                }
              }}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-900/50 hover:bg-red-900/80 text-red-200 hover:text-white transition-all shadow-lg border border-red-500/30"
              title={t("disconnectSheet")}
            >
              <span className="material-symbols-outlined text-[20px]">
                link_off
              </span>
            </button>
          )}

          {/* Open Sheet - Only if Linked (Visible to Owner & Viewers) */}
          {isLinked && (
            <a
              href={`https://docs.google.com/spreadsheets/d/${profile?.spreadsheet_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-11 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all shadow-lg border border-white/10 text-gray-300 hover:text-white"
              title="Open Google Sheet"
            >
              <span className="material-symbols-outlined text-[20px]">
                open_in_new
              </span>
            </a>
          )}

          {/* Share Button - Always visible if Owner (or maybe even editors?) */}
          {isOwner && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex leading-none items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95 bg-gray-800 hover:bg-gray-700 text-white border border-white/10"
              title="Share & Collaborate"
            >
              <span className="material-symbols-outlined text-[20px]">
                share
              </span>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
