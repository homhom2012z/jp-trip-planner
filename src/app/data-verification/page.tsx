"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function DataVerificationPage() {
  const { locations } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Data Verification
            </h1>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
              {filteredLocations.length} locations
            </span>
          </div>

          <div className="relative w-64 md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                {loc.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={loc.photoUrl}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl">
                      image
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                    {loc.city}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-1">{loc.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                  {loc.description || "No description available."}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    <span className="truncate max-w-[150px]">
                      {loc.lat && loc.lng
                        ? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
                        : "No coordinates"}
                    </span>
                  </div>
                  {loc.googleMapsUrl && (
                    <a
                      href={loc.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Maps
                      <span className="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredLocations.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">
                search_off
              </span>
              <p>No locations found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
