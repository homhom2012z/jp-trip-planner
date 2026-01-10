"use client";

import { useUser } from "@/context/UserContext";
import { api } from "@/services/api";
import { useState } from "react";

export default function DangerZone() {
  const { profile, refreshProfile } = useUser();
  const [loading, setLoading] = useState(false);

  if (!profile?.spreadsheet_id) return null;

  const handleDisconnect = async () => {
    if (
      confirm(
        "Are you sure you want to disconnect? This will clear all local data. Your Google Sheet will remain safe."
      )
    ) {
      setLoading(true);
      try {
        await api.disconnectSheet(profile.id);
        await refreshProfile();
        // Redirect or refresh
        window.location.reload();
      } catch (e) {
        alert("Failed to disconnect");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-red-900">
            Disconnect Google Sheet
          </h4>
          <p className="text-sm text-red-700 mt-1">
            This will stop syncing and remove all cached data from this app.
            Your Google Sheet file in Drive will not be deleted.
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={loading}
          className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-400 transition-colors whitespace-nowrap"
        >
          {loading ? "Disconnecting..." : "Disconnect Sheet"}
        </button>
      </div>
    </div>
  );
}
