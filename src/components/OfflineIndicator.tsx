"use client";

import { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state (hydration safe)
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 text-white z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400">
            wifi_off
          </span>
          <div>
            <p className="font-semibold text-sm">You are offline</p>
            <p className="text-xs text-gray-400">
              The app will work in offline mode. Changes will sync when you
              reconnect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
