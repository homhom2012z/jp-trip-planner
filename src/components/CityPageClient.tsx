"use client";

import { Location } from "@/lib/types";
import LocationList from "./LocationList";
import LocationDetailPanel from "./LocationDetailPanel";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSavedPlaces } from "@/context/SavedPlacesContext";
import { ItineraryProvider } from "@/context/ItineraryContext";
import ItineraryPlanner from "./ItineraryPlanner";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

const MapMap = dynamic(() => import("./MapMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
      <span className="material-symbols-outlined animate-spin text-4xl">
        refresh
      </span>
    </div>
  ),
});

interface CityPageClientProps {
  cityName: string;
  locations: Location[];
}

export default function CityPageClient({
  cityName,
  locations,
}: CityPageClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [isMobilePanelExpanded, setIsMobilePanelExpanded] = useState(false);

  const [activeFilter, setActiveFilter] = useState<
    "all" | "dining" | "attractions" | "top-rated" | "saved"
  >("all");

  const [searchQuery, setSearchQuery] = useState("");
  const { isSaved } = useSavedPlaces();
  const { t } = useLanguage();
  const { user, locations: userLocations } = useUser();

  const finalLocations = useMemo(() => {
    if (user && userLocations.length > 0) {
      return userLocations.filter(
        (l) => l.city?.toLowerCase() === cityName.toLowerCase()
      );
    }
    return locations;
  }, [user, userLocations, locations, cityName]);

  const filteredLocations = useMemo(() => {
    let result = [...finalLocations];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q)
      );
    }

    if (activeFilter === "dining") {
      result = result.filter((l) => {
        const t = l.type.toLowerCase();
        return (
          t.includes("ramen") ||
          t.includes("sushi") ||
          t.includes("restaurant") ||
          t.includes("cafe") ||
          t.includes("food") ||
          t.includes("izakaya") ||
          t.includes("bar") ||
          t.includes("sukiyaki") ||
          t.includes("soba") ||
          t.includes("udon")
        );
      });
    } else if (activeFilter === "attractions") {
      result = result.filter((l) => {
        const t = l.type.toLowerCase();
        return (
          t.includes("temple") ||
          t.includes("shrine") ||
          t.includes("park") ||
          t.includes("landmark") ||
          t.includes("museum") ||
          t.includes("view") ||
          t.includes("shopping")
        );
      });
    } else if (activeFilter === "top-rated") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeFilter === "saved") {
      result = result.filter((l) => isSaved(l.id));
    }

    return result;
  }, [finalLocations, activeFilter, isSaved, searchQuery]);

  const [nearestStation, setNearestStation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  /* DYNAMIC CENTER CALCULATION */
  const cityCenter = useMemo((): [number, number] => {
    // 1. If we have filtered locations, find the average center
    if (filteredLocations.length > 0) {
      const validLocs = filteredLocations.filter((l) => l.lat && l.lng);
      if (validLocs.length > 0) {
        const avgLat =
          validLocs.reduce((sum, l) => sum + (l.lat || 0), 0) /
          validLocs.length;
        const avgLng =
          validLocs.reduce((sum, l) => sum + (l.lng || 0), 0) /
          validLocs.length;
        return [avgLat, avgLng];
      }
    }

    // 2. Fallback to first regular location if filtered is empty but main list exists
    if (
      finalLocations.length > 0 &&
      finalLocations[0].lat &&
      finalLocations[0].lng
    ) {
      return [finalLocations[0].lat, finalLocations[0].lng];
    }

    // 3. Absolute Fallbacks for specific cities if data is missing
    if (cityName === "Kyoto") return [35.0116, 135.7681];
    if (cityName === "Osaka") return [34.6937, 135.5023];
    if (cityName === "Uji") return [34.8968, 135.8037]; // Approx Uji center

    // 4. Tokyo default
    return [35.6895, 139.6917];
  }, [filteredLocations, finalLocations, cityName]);

  const [showTransit, setShowTransit] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "planner">("explore");

  return (
    <ItineraryProvider>
      <div className="flex flex-1 overflow-hidden relative bg-[#fcf8f9] h-full">
        {/* ... Left Panel ... */}

        {/* Left Panel: Always Search & List */}
        <div className="w-full lg:w-1/2 h-full relative border-r border-[#dadce0] bg-white z-10 shadow-xl lg:shadow-none shrink-0 z-20">
          <div className="h-full flex flex-col w-full bg-white">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-[900px] mx-auto px-8 py-8 flex flex-col gap-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-[#70757a]">
                  <Link href="/" className="hover:text-primary">
                    Japan
                  </Link>
                  <span>›</span>
                  <span className="font-medium text-[#202124]">{cityName}</span>
                </nav>

                {/* Search Bar */}
                <div className="relative">
                  <div className="flex w-full items-center bg-white border border-transparent shadow-[0_2px_6px_rgba(0,0,0,0.15)] rounded-lg h-10 px-4 focus-within:ring-2 focus-within:ring-[#1a73e8]/50 transition-all">
                    <input
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-[#202124] placeholder:text-[#5f6368] outline-none h-full"
                      placeholder={`${t("searchPlaceholder")} ${cityName}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-2">
                      <button className="p-1.5 text-[#1a73e8]">
                        <span className="material-symbols-outlined text-[20px]">
                          search
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Page Heading */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-normal text-[#202124]">
                    {cityName}
                  </h1>
                  <p className="text-xs text-[#70757a] leading-relaxed">
                    {cityName === "Kyoto" &&
                      "Cultural capital famous for classical Buddhist temples, gardens, imperial palaces."}
                    {cityName === "Tokyo" &&
                      "Neon-lit fusion of future and tradition."}
                    {!["Kyoto", "Tokyo"].includes(cityName) &&
                      `${t("explore")} ${cityName}.`}
                  </p>
                </div>

                {/* View Toggle Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab("explore")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === "explore"
                        ? "bg-white text-[#1a73e8] shadow-sm"
                        : "text-[#5f6368] hover:text-[#202124]"
                    }`}
                  >
                    {t("explore")}
                  </button>
                  <button
                    onClick={() => setActiveTab("planner")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === "planner"
                        ? "bg-white text-[#1a73e8] shadow-sm"
                        : "text-[#5f6368] hover:text-[#202124]"
                    }`}
                  >
                    {t("planner")}
                  </button>
                </div>

                {activeTab === "explore" ? (
                  <>
                    {/* Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <button
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === "top-rated" ? "all" : "top-rated"
                          )
                        }
                        className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-full border text-xs font-medium transition-colors ${
                          activeFilter === "top-rated"
                            ? "bg-[#e8f0fe] text-[#1a73e8] border-[#e8f0fe]"
                            : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-gray-50"
                        }`}
                      >
                        {t("topRated")}
                      </button>
                      <button
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === "saved" ? "all" : "saved"
                          )
                        }
                        className={`flex h-8 shrink-0 items-center justify-center gap-1 px-3 rounded-full border text-xs font-medium transition-colors ${
                          activeFilter === "saved"
                            ? "bg-[#e8f0fe] text-[#1a73e8] border-[#e8f0fe]"
                            : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-gray-50"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          bookmark
                        </span>
                        {t("saved")}
                      </button>
                      <button
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === "dining" ? "all" : "dining"
                          )
                        }
                        className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-full border text-xs font-medium transition-colors ${
                          activeFilter === "dining"
                            ? "bg-[#e8f0fe] text-[#1a73e8] border-[#e8f0fe]"
                            : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-gray-50"
                        }`}
                      >
                        {t("dining")}
                      </button>
                      <button
                        onClick={() =>
                          setActiveFilter(
                            activeFilter === "attractions"
                              ? "all"
                              : "attractions"
                          )
                        }
                        className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-full border text-xs font-medium transition-colors ${
                          activeFilter === "attractions"
                            ? "bg-[#e8f0fe] text-[#1a73e8] border-[#e8f0fe]"
                            : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-gray-50"
                        }`}
                      >
                        {t("attractions")}
                      </button>
                    </div>

                    <div className="h-px bg-gray-200 w-full" />

                    {/* List Results */}
                    <LocationList
                      locations={filteredLocations}
                      onLocationClick={(loc) => {
                        setSelectedLocation(loc);
                        setNearestStation(null); // Reset station when changing selection
                        setShowMobileMap(true); // Auto-switch to map on mobile
                      }}
                      onDelete={async (id) => {
                        try {
                          // Optimistic update logic if needed
                          // But usually we wait for sync.
                          // Trigger API
                          await import("@/services/api").then((m) =>
                            m.api.deleteLocation(id)
                          );
                          // Force refresh via window reload or sync hooks?
                          // Simple reload for safety as IDs shift
                          window.location.reload();
                        } catch (e) {
                          console.error("Delete failed", e);
                          alert("Failed to delete location");
                        }
                      }}
                    />
                  </>
                ) : (
                  <ItineraryPlanner locations={finalLocations} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Map */}
        <div
          className={`bg-gray-100 h-full lg:block lg:w-1/2 lg:relative ${
            showMobileMap
              ? "fixed inset-0 z-40 w-full block"
              : "hidden relative w-full"
          }`}
        >
          <MapMap
            locations={filteredLocations}
            center={cityCenter}
            zoom={13}
            onMarkerClick={(loc) => {
              setSelectedLocation(loc);
              setNearestStation(null);
            }}
            selectedLocation={selectedLocation}
            onCloseInfoWindow={() => {
              setSelectedLocation(null);
              setNearestStation(null);
            }}
            stationMarker={nearestStation}
            onStationClick={() => {
              if (nearestStation) {
                const stationLoc: Location = {
                  id: `station-${nearestStation.name}`,
                  name: nearestStation.name,
                  city: cityName,
                  lat: nearestStation.lat,
                  lng: nearestStation.lng,
                  type: "Train Station",
                  priceJpy: "-",
                  priceThb: "-",
                  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${nearestStation.lat},${nearestStation.lng}`,
                  description: `Transit hub in ${cityName}`,
                };
                setSelectedLocation(stationLoc);
              }
            }}
            showTransitLayer={showTransit}
            onPoiClick={(loc) => {
              setSelectedLocation(loc);
              setNearestStation(null);
            }}
            onToggleTransit={() => setShowTransit(!showTransit)}
          />

          {/* Floating Search Bar (Mobile & Map View) */}
          <div className="absolute top-20 md:top-4 left-4 right-16 z-10 md:w-80 md:right-auto md:left-4">
            <div className="flex w-full items-center bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg h-11 px-4 focus-within:ring-2 focus-within:ring-[#1a73e8]/50 transition-all">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#202124] placeholder:text-[#5f6368] outline-none h-full min-w-0"
                placeholder={`${t("searchPlaceholder")} ${cityName}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-500 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              )}
              {!searchQuery && (
                <button className="p-1.5 text-[#1a73e8] border-l border-gray-200 ml-2 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Floating Detail Panel (Option A) */}
          {selectedLocation && (
            <div
              className={`absolute inset-x-0 bottom-0 z-50 md:h-[calc(100%-32px)] md:w-[400px] md:top-4 md:left-4 md:bottom-auto bg-white rounded-t-xl md:rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-10 md:slide-in-from-left-4 fade-in ${
                isMobilePanelExpanded ? "h-[80vh]" : "h-[45vh]"
              }`}
            >
              <LocationDetailPanel
                location={selectedLocation}
                onBack={() => {
                  setSelectedLocation(null);
                  setNearestStation(null);
                  setIsMobilePanelExpanded(false);
                }}
                onStationFound={setNearestStation}
                onLocationSelect={setSelectedLocation}
                isExpanded={isMobilePanelExpanded}
                onToggleExpand={() =>
                  setIsMobilePanelExpanded(!isMobilePanelExpanded)
                }
              />
            </div>
          )}

          {/* Floating Map Controls moved to MapMap.tsx */}
        </div>

        {/* Mobile Map Toggle FAB - Always visible on mobile */}
        <button
          onClick={() => setShowMobileMap(!showMobileMap)}
          className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#202124] text-white px-5 py-3 rounded-full shadow-lg font-medium text-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showMobileMap ? "list" : "map"}
          </span>
          {showMobileMap ? t("showList") : t("viewMap")}
        </button>
      </div>
    </ItineraryProvider>
  );
}
