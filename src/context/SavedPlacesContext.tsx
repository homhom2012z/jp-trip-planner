"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Location } from "@/lib/types";

interface SavedPlacesContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

const SavedPlacesContext = createContext<SavedPlacesContextType | undefined>(
  undefined
);

export function SavedPlacesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jp_trip_saved_places");
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved places", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jp_trip_saved_places", JSON.stringify(savedIds));
    }
  }, [savedIds, isLoaded]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <SavedPlacesContext.Provider value={{ savedIds, isSaved, toggleSaved }}>
      {children}
    </SavedPlacesContext.Provider>
  );
}

export function useSavedPlaces() {
  const context = useContext(SavedPlacesContext);
  if (context === undefined) {
    throw new Error("useSavedPlaces must be used within a SavedPlacesProvider");
  }
  return context;
}
