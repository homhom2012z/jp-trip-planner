import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  Libraries,
  TransitLayer,
} from "@react-google-maps/api";

import { Location } from "@/lib/types";
import { defaultMapStyle, transitMapStyle } from "./mapStyles";
import { useMemo, useCallback, useState } from "react";

interface MapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (location: Location) => void;
  selectedLocation?: Location | null;
  onCloseInfoWindow?: () => void;
  stationMarker?: { lat: number; lng: number; name: string } | null;
  onStationClick?: () => void;
  showTransitLayer?: boolean;
  onToggleTransit?: () => void; // Added callback
  onPoiClick?: (location: Location) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: Libraries = ["places", "geometry"];

export default function MapMap({
  locations,
  center = [35.6895, 139.6917], // Tokyo default
  zoom = 13,
  onMarkerClick,
  selectedLocation,
  onCloseInfoWindow,
  stationMarker,
  onStationClick,
  showTransitLayer = false,
  onToggleTransit,
  onPoiClick,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const effectiveCenter = useMemo(() => {
    // If a location is selected, center on it
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    }
    // Otherwise fallback logic
    if (locations.length === 1 && locations[0].lat && locations[0].lng) {
      return { lat: locations[0].lat, lng: locations[0].lng };
    }
    return { lat: center[0], lng: center[1] };
  }, [locations, center, selectedLocation]);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      setMap(map);
      if (locations.length > 1 && !selectedLocation) {
        const bounds = new window.google.maps.LatLngBounds();
        let hasValidLoc = false;
        locations.forEach((loc) => {
          if (loc.lat && loc.lng) {
            bounds.extend({ lat: loc.lat, lng: loc.lng });
            hasValidLoc = true;
          }
        });
        if (hasValidLoc) {
          map.fitBounds(bounds);
        }
      }
    },
    [locations, selectedLocation],
  );

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Toggle Styles based on Mode
  const currentStyles = useMemo(
    () => (showTransitLayer ? transitMapStyle : defaultMapStyle),
    [showTransitLayer],
  );

  // Handlers for controls
  const handleZoomIn = () => {
    if (map) map.setZoom((map.getZoom() || 0) + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom((map.getZoom() || 0) - 1);
  };

  const handleRecenter = () => {
    if (map && effectiveCenter) {
      map.panTo(effectiveCenter);
      map.setZoom(13);
    }
  };

  // We need to notify parent about transit toggle?
  // Actually the prop `showTransitLayer` comes from parent.
  // We should probably lift the state OR add a callback.
  // For now, let's assume the parent controls it.
  // Wait, the previous code had `setShowTransit` in CityPageClient.
  // We need to pass `onToggleTransit` to MapMap.

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
        <span className="material-symbols-outlined animate-spin text-4xl">
          refresh
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={effectiveCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: currentStyles, // Dynamic Style Switching
          disableDefaultUI: true, // We will build our own controls or rely on sidebar
          zoomControl: false, // Hidden to match "clean" look or move via CSS, but clean is better for our custom layout
          streetViewControl: false,
          mapTypeControl: false,
          clickableIcons: true, // Explicitly enable POI clicks
        }}
        onClick={(e: google.maps.MapMouseEvent | any) => {
          // 1. Standard POI Click (Business, Attraction, etc.)
          if (e.placeId && onPoiClick) {
            e.stop();
            onPoiClick({
              id: `poi-${e.placeId}`,
              googlePlaceId: e.placeId,
              name: "Loading...",
              city: "Japan",
              type: "Point of Interest",
              priceJpy: "-",
              priceThb: "-",
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${e.placeId}`,
              lat: e.latLng?.lat(),
              lng: e.latLng?.lng(),
            });
            return;
          }

          // 2. Hybrid Fallback: Click on "Dead" Transit Icon -> Search Nearby
          // If no placeId, check if we clicked near a transit/train station
          if (map && e.latLng && onPoiClick) {
            // Prevent other click handlers (like map click) if we find something?
            // Actually we are inside standard click.

            const service = new window.google.maps.places.PlacesService(map);
            const request = {
              location: e.latLng,
              radius: 100, // Increased radius
              type: "transit_station",
            };

            service.nearbySearch(request, (results, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
              ) {
                // Return the closest result
                const station = results[0];

                onPoiClick({
                  id: `transit-${station.place_id}`,
                  googlePlaceId: station.place_id,
                  name: station.name || "Transit Station",
                  city: "Japan",
                  type: "Transit Station",
                  priceJpy: "-",
                  priceThb: "-",
                  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${station.place_id}`,
                  lat: station.geometry?.location?.lat(),
                  lng: station.geometry?.location?.lng(),
                  description: "Public Transport",
                  photoUrl: station.photos?.[0]?.getUrl({ maxWidth: 400 }),
                });
              }
            });
          }
        }}
      >
        {locations.map((loc) =>
          loc.lat && loc.lng ? (
            <MarkerF
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={() => onMarkerClick?.(loc)}
              // Highlight selected marker logic could go here (e.g. different icon)
              icon={
                selectedLocation?.id === loc.id
                  ? {
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }
                  : undefined
              }
            />
          ) : null,
        )}

        {/* Nearest Station Marker */}
        {stationMarker && (
          <MarkerF
            position={{ lat: stationMarker.lat, lng: stationMarker.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/kml/shapes/rail.png", // Stand-in for "train head" - standard Google rail icon
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title={stationMarker.name}
            onClick={onStationClick}
          />
        )}

        {/* InfoWindow for Desktop */}
        {/* InfoWindow for Desktop */}
        {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
          <InfoWindowF
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={onCloseInfoWindow}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          >
            <div className="min-w-[200px] max-w-[280px] p-1">
              {/* Image */}
              <div className="h-32 w-full rounded-lg overflow-hidden mb-2 bg-gray-100 relative">
                <img
                  src={
                    selectedLocation.photoUrl?.split("?")[0] || // Simple check to avoid huge URLs if possible
                    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" // Fallback logic would typically be robust
                  }
                  // Actually, let's use the object fields directly or a helper
                  className="w-full h-full object-cover"
                  alt={selectedLocation.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Info */}
              <h3 className="font-bold text-[#202124] text-base mb-1">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-[#70757a] mb-2 line-clamp-2">
                {selectedLocation.description || selectedLocation.type}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={selectedLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1a73e8] text-white text-xs font-medium py-1.5 px-3 rounded text-center hover:bg-[#1557b0] transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </InfoWindowF>
        )}
        {showTransitLayer && <TransitLayer />}
      </GoogleMap>

      {/* Floating Controls - Now Inside MapMap */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-10 w-auto">
        {/* Recenter */}
        <button
          onClick={handleRecenter}
          className="bg-white rounded shadow-md p-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
          title="Recenter Map"
        >
          <span className="material-symbols-outlined text-[#5f6368] text-xl">
            my_location
          </span>
        </button>

        {/* Transit Toggle */}
        <button
          onClick={onToggleTransit}
          className={`bg-white rounded shadow-md p-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-colors ${
            showTransitLayer ? "text-[#1a73e8]" : "text-[#5f6368]"
          }`}
          title="Toggle Public Transit Map"
        >
          <span
            className={`material-symbols-outlined text-xl ${
              showTransitLayer ? "fill-current" : ""
            }`}
          >
            train
          </span>
        </button>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          className="bg-white rounded shadow-md p-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-[#5f6368] text-xl">
            add
          </span>
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded shadow-md p-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-[#5f6368] text-xl">
            remove
          </span>
        </button>
      </div>
    </div>
  );
}
