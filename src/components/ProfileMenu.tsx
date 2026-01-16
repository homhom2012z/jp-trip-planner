"use client";

import { useUser } from "@/context/UserContext";
import { api } from "@/services/api";
import Link from "next/link";
import { useSync } from "@/hooks/useSync";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileMenu() {
  const { user, profile, logout } = useUser();
  const { isSyncing, handleSync } = useSync();
  const { t } = useLanguage();

  if (!user) return null;

  const isLinked = !!profile?.spreadsheet_id;

  const handleConnect = async () => {
    try {
      const url = await api.getGoogleAuthUrl();
      window.location.href = url;
    } catch (e) {
      console.error("Failed to get auth url", e);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium text-gray-700 hidden xl:block">
        {user.email}
      </div>

      {/* Only show Sync/Connect if I am viewing MY OWN trip */}
      {user.id === (profile?.id || user.id) && (
        <>
          {!isLinked && (
            <button
              onClick={handleConnect}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-green-700 transition"
            >
              {t("connectSheet")}
            </button>
          )}

          {isLinked && (
            <>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className={`flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition ${
                  isSyncing ? "opacity-50 cursor-wait" : ""
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isSyncing ? "animate-spin" : ""
                  }`}
                >
                  refresh
                </span>
                <span className="hidden sm:inline">
                  {isSyncing ? t("syncing") : t("syncNow")}
                </span>
              </button>
            </>
          )}
        </>
      )}

      <Link
        href="/dashboard"
        className="text-gray-700 hover:text-primary px-2 py-1 flex items-center gap-1"
        title={t("goToDashboard")}
      >
        <span className="material-symbols-outlined text-xl">dashboard</span>
      </Link>

      {/* Dropdown or simple Logout button */}
      <button
        onClick={logout}
        className="text-gray-500 hover:text-red-600 px-2 py-1"
        title={t("signOut")}
      >
        <span className="material-symbols-outlined text-xl">logout</span>
      </button>
    </div>
  );
}
