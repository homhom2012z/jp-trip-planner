"use client";

import { useUser } from "@/context/UserContext";
import { Location } from "@/lib/types";
import LocationList from "../LocationList";
import { useState, useMemo } from "react";

export default function BucketList() {
  const { locations } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // Group by City
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const lowerQuery = searchQuery.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(lowerQuery) ||
        loc.city.toLowerCase().includes(lowerQuery) ||
        loc.description?.toLowerCase().includes(lowerQuery),
    );
  }, [locations, searchQuery]);

  const locationsByCity = filteredLocations.reduce(
    (acc, loc) => {
      const city = loc.city || "Other";
      if (!acc[city]) acc[city] = [];
      acc[city].push(loc);
      return acc;
    },
    {} as Record<string, Location[]>,
  );

  const cities = Object.keys(locationsByCity).sort();

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          search
        </span>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-main placeholder:text-text-secondary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {cities.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-border shadow-sm">
          <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">
            search_off
          </span>
          <p className="text-text-secondary">
            {searchQuery
              ? `No locations found matching "${searchQuery}"`
              : "No saved places yet."}
          </p>
        </div>
      ) : (
        cities.map((city) => (
          <div key={city} className="flex flex-col gap-4">
            <div className="flex items-center justify-between sticky top-[60px] bg-background/95 py-2 backdrop-blur-sm z-10 transition-colors duration-300">
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary">
                  location_city
                </span>
                {city}
              </h3>
              <span className="bg-surface border border-border text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                {locationsByCity[city].length} Places
              </span>
            </div>

            <LocationList locations={locationsByCity[city]} />
          </div>
        ))
      )}
    </div>
  );
}
