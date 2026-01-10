import { useState } from "react";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

export function useSync() {
  const { user, syncWithGoogle } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await toast.promise(syncWithGoogle(), {
        loading: "Syncing with Google Sheets...",
        success: "Sync complete! Data updated.",
        error: (err: any) => {
          // Check for "Test User" restriction (403 invalid_grant or access_denied)
          if (
            err.message?.includes("403") ||
            err.message?.includes("access_denied") ||
            err.message?.includes("invalid_grant")
          ) {
            return (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-bold">Access Denied (Test Mode)</span>
                <span>
                  Please add <b>{user.email}</b> to &quot;Test Users&quot; in
                  Google Cloud Console.
                </span>
              </div>
            );
          }
          return `Sync failed: ${err.message}`;
        },
      });
    } catch (e) {
      console.error(e);
      // Toast handles error display
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing, handleSync };
}
