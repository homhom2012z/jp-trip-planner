"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Day {
  id: string;
  title: string;
  locationIds: string[]; // Ordered list of location IDs for this day
}

interface ItineraryContextType {
  days: Day[];
  addDay: () => void;
  removeDay: (dayId: string) => void;
  updateDayTitle: (dayId: string, newTitle: string) => void;
  setDays: (days: Day[]) => void;
  isLocationScheduled: (locationId: string) => boolean;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(
  undefined
);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [days, setDays] = useState<Day[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jp_trip_itinerary");
    if (stored) {
      try {
        setDays(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse itinerary", e);
      }
    } else {
      // Default to 3 empty days
      setDays([
        { id: "day-1", title: "Day 1", locationIds: [] },
        { id: "day-2", title: "Day 2", locationIds: [] },
        { id: "day-3", title: "Day 3", locationIds: [] },
      ]);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jp_trip_itinerary", JSON.stringify(days));
    }
  }, [days, isLoaded]);

  const addDay = () => {
    const newId = `day-${days.length + 1}`;
    setDays([
      ...days,
      { id: newId, title: `Day ${days.length + 1}`, locationIds: [] },
    ]);
  };

  const removeDay = (dayId: string) => {
    setDays(days.filter((d) => d.id !== dayId));
  };

  const updateDayTitle = (dayId: string, newTitle: string) => {
    setDays(days.map((d) => (d.id === dayId ? { ...d, title: newTitle } : d)));
  };

  const isLocationScheduled = (locationId: string) => {
    return days.some((day) => day.locationIds.includes(locationId));
  };

  return (
    <ItineraryContext.Provider
      value={{
        days,
        addDay,
        removeDay,
        updateDayTitle,
        setDays,
        isLocationScheduled,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error("useItinerary must be used within a ItineraryProvider");
  }
  return context;
}
