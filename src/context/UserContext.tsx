"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { api } from "@/services/api";
import { Location, Profile } from "@/lib/types";

interface UserContextType {
  user: User | null;
  profile: Profile | null; // Profile of the ACTIVE trip owner
  loading: boolean;
  locations: Location[];
  refreshLocations: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  syncWithGoogle: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;

  // Collaboration
  activeTripId: string | null;
  availableTrips: Profile[];
  switchTrip: (tripOwnerId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Collaboration State
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [availableTrips, setAvailableTrips] = useState<Profile[]>([]);

  // Load Profile of a specific user (Trip Owner)
  const loadProfile = useCallback(
    async (tripOwnerId: string) => {
      try {
        // 1. If it's ME, fetch directly (fast, standard)
        if (user && tripOwnerId === user.id) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", tripOwnerId)
            .single();

          if (error) {
            console.error("Failed to load my profile", error);
          } else {
            setProfile(data as Profile);
          }
          return;
        }

        // 2. If it's someone else (Shared Trip), ALWAYS use the backend proxy
        //    Direct fetch will fail due to RLS "Users can view own profile" policy
        try {
          const proxyData = await api.getTripOwnerProfile(tripOwnerId);
          setProfile(proxyData);
        } catch (proxyErr) {
          console.error("Failed to load profile via proxy", proxyErr);
          // Don't clear profile here immediately, maybe we show an error state
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    },
    [user]
  );

  const loadLocations = useCallback(async (tripOwnerId: string) => {
    try {
      const data = await api.getLocations(tripOwnerId);
      setLocations(data);
    } catch (err) {
      console.error("Failed to load locations:", err);
    }
  }, []);

  // Fetch trips explicitly shared with me
  const loadSharedTrips = useCallback(async () => {
    try {
      const sharedTrips = await api.getAccessibleTrips();
      return sharedTrips;
    } catch (err) {
      console.error("Failed to load shared trips", err);
      return [];
    }
  }, []);

  // 1. Init Session & Auth Listener (Run ONCE)
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const myUserId = session.user.id;

        // Persistence: Check localStorage first
        const storedTripId = localStorage.getItem("activeTripId");
        const initialTripId = storedTripId || myUserId;

        // Set active trip
        setActiveTripId(initialTripId);

        // Load my profile & available trips
        const { data: myProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", myUserId)
          .single();

        if (myProfile) {
          setAvailableTrips([myProfile]);
          setProfile(myProfile); // Initial profile is mine
        }

        // Load shared trips in background
        loadSharedTrips().then((shared) => {
          if (mounted && myProfile) {
            setAvailableTrips([myProfile, ...shared]);
          }
        });
      } else {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Only reset dependencies if we are switching USERS (login/logout)
        // We do NOT want to reset if we are just switching TRIPS
        if (!activeTripId) {
          const myUserId = session.user.id;
          // Persistence check in listener to prevent overwriting with default
          const storedTripId = localStorage.getItem("activeTripId");
          setActiveTripId(storedTripId || myUserId);
          // ... (rest of re-init logic if needed, but usually covered by initSession for page loads)
          // For simple auth state change (like token refresh), we might not need to do anything.
          // If it's a new login:
        }
      } else {
        // Logged out
        setUser(null);
        setProfile(null);
        setLocations([]);
        setActiveTripId(null);
        setAvailableTrips([]);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Dependency is EMPTY -> Runs once

  // 2. React to activeTripId changes
  useEffect(() => {
    if (activeTripId) {
      // When active trip changes, load that trip's data
      // We do NOT reset activeTripId here.
      setLoading(true);
      Promise.all([
        loadProfile(activeTripId),
        loadLocations(activeTripId),
      ]).finally(() => setLoading(false));
    }
  }, [activeTripId, loadProfile, loadLocations]);

  const switchTrip = async (tripOwnerId: string) => {
    setActiveTripId(tripOwnerId);
    localStorage.setItem("activeTripId", tripOwnerId);
    // Data fetching handled by useEffect[activeTripId]
  };

  const syncWithGoogle = async () => {
    if (!activeTripId) return;
    try {
      await api.syncLocations(activeTripId);
      await loadLocations(activeTripId);
      await loadProfile(activeTripId);
    } catch (err) {
      console.error("Failed to sync:", err);
      throw err;
    }
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLocations([]);
    setActiveTripId(null);
    setAvailableTrips([]);
    localStorage.removeItem("activeTripId");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        locations,
        refreshLocations: async () => {
          if (activeTripId) await loadLocations(activeTripId);
        },
        refreshProfile: async () => {
          if (activeTripId) await loadProfile(activeTripId);
        },
        syncWithGoogle,
        login,
        logout,
        activeTripId,
        availableTrips,
        switchTrip,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
