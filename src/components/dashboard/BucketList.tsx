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
        loc.description?.toLowerCase().includes(lowerQuery)
    );
  }, [locations, searchQuery]);

  const locationsByCity = filteredLocations.reduce((acc, loc) => {
    const city = loc.city || "Other";
    if (!acc[city]) acc[city] = [];
    acc[city].push(loc);
    return acc;
  }, {} as Record<string, Location[]>);

  const cities = Object.keys(locationsByCity).sort();

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {cities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
            search_off
          </span>
          <p className="text-gray-500">
            {searchQuery
              ? `No locations found matching "${searchQuery}"`
              : "No saved places yet."}
          </p>
        </div>
      ) : (
        cities.map((city) => (
          <div key={city} className="flex flex-col gap-4">
            <div className="flex items-center justify-between sticky top-[60px] bg-gray-50/95 py-2 backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">
                  location_city
                </span>
                {city}
              </h3>
              <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
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
