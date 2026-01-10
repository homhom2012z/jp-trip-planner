"use client";

"use client";

import { Location } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GlobalMap from "@/components/dashboard/GlobalMap";
import { useJsApiLoader } from "@react-google-maps/api";

interface SharedTripData {
  owner: {
    email: string;
  };
  locations: Location[];
  itinerary: any[];
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function SharedTripPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<SharedTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Scroll to list item when marker is clicked
  const handleMarkerClick = (id: string) => {
    setFocusedId(id);
    const element = document.getElementById(`loc-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (!slug) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    fetch(`${apiUrl}/share/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Trip not found");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fcf8f9]">
        <div className="text-xl font-bold text-primary">Loading Trip...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fcf8f9] gap-4">
        <div className="text-2xl font-bold text-[#1b0d12]">Trip Not Found</div>
        <p className="text-gray-500">This link may be invalid or expired.</p>
        <Link href="/" className="text-primary hover:underline font-bold">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-[#fcf8f9] font-display overflow-hidden">
      {/* Header (Read Only) */}
      <header className="flex h-14 md:h-16 items-center justify-between border-b border-[#f3e7eb] bg-white px-4 md:px-6 shadow-sm flex-shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-black tracking-tight text-[#1b0d12]">
            JapanTrip
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] md:text-xs font-bold text-primary whitespace-nowrap">
            READ ONLY
          </span>
        </div>
        <div className="text-xs md:text-sm font-medium text-gray-500 truncate max-w-[150px] md:max-w-none">
          {data.owner.email}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Sidebar List */}
        <div className="order-2 md:order-1 flex w-full md:w-[400px] flex-1 flex-col border-r border-[#f3e7eb] bg-white md:flex-none z-10 overflow-hidden">
          <div className="p-4 border-b border-[#f3e7eb] bg-white flex-shrink-0">
            <h2 className="text-lg font-bold text-[#1b0d12]">
              {data.locations.length} Saved Places
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            <div className="flex flex-col gap-3 pb-20 md:pb-0">
              {data.locations.map((loc) => (
                <div
                  key={loc.id}
                  id={`loc-${loc.id}`}
                  onClick={() => setFocusedId(loc.id)}
                  className={`flex gap-3 rounded-xl border p-3 shadow-sm cursor-pointer transition-all ${
                    focusedId === loc.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-gray-100 bg-[#fcf8f9] hover:bg-gray-50"
                  }`}
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    {loc.photoUrl ? (
                      <img
                        src={loc.photoUrl}
                        alt={loc.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1b0d12] line-clamp-1">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {loc.city}
                    </p>
                    <div className="mt-2 flex gap-1">
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500 border border-gray-100">
                        {loc.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="order-1 md:order-2 h-[35vh] md:h-auto w-full md:flex-1 relative border-b md:border-b-0 border-[#f3e7eb] flex-shrink-0">
          {isLoaded && (
            <GlobalMap
              locations={data.locations}
              onMarkerClick={handleMarkerClick}
              focusedLocationId={focusedId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
