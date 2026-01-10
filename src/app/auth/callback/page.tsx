"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Not router from next/router
import { api } from "@/services/api";
import { useUser } from "@/context/UserContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshLocations } = useUser();
  const [status, setStatus] = useState("Processing...");
  const processingRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Parse 'code' from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        // Clear the code from the URL immediately to prevent reuse
        window.history.replaceState({}, "", "/auth/callback");
      }

      if (!code) {
        // If we already processed it (URL cleared) or came here without one, redirect home.
        setStatus("Redirecting...");
        setTimeout(() => router.push("/"), 1000);
        return;
      }

      if (processingRef.current) return;
      processingRef.current = true;

      try {
        setStatus("Linking Google Account...");
        await api.linkGoogleAccount(code);
        setStatus("Success! Syncing data...");
        await refreshLocations();
        router.push("/");
      } catch (err) {
        console.error("Link failed", err);
        // Even if it failed, we can't retry the SAME code.
        setStatus("Failed to link account. Please try again.");
      }
    };

    handleCallback();
  }, [router, refreshLocations]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600 font-medium">{status}</p>
    </div>
  );
}
