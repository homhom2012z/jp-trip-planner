"use client";

import { GoogleMap, useJsApiLoader, Libraries } from "@react-google-maps/api";
import { useUser } from "@/context/UserContext";
import { Location } from "@/lib/types";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { defaultMapStyle } from "../mapStyles";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import toast from "react-hot-toast";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: Libraries = ["places", "geometry"];

interface GlobalMapProps {
  locations?: Location[];
  onMarkerClick?: (locationId: string) => void;
  focusedLocationId?: string | null;
}

export default function GlobalMap({
  locations: propLocations,
  onMarkerClick,
  focusedLocationId,
}: GlobalMapProps) {
  const { locations: contextLocations } = useUser();
  const locations = propLocations || contextLocations;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // Pan to focused location
  useEffect(() => {
    if (map && focusedLocationId && locations.length > 0) {
      const loc = locations.find((l) => l.id === focusedLocationId);
      if (loc && loc.lat && loc.lng) {
        map.panTo({ lat: loc.lat, lng: loc.lng });
        map.setZoom(15);
      }
    }
  }, [map, focusedLocationId, locations]);

  // Clustering Logic
  useEffect(() => {
    if (!map) return;

    // cleanup old
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current.setMap(null); // Detach
    }
    // Cleanup old markers if any remain (though clusterer.clearMarkers should parse them?)
    // Actually MarkerClusterer keeps references. Safe to just clear.
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const newMarkers = locations
      .filter((loc) => loc.lat && loc.lng)
      .map((loc) => {
        const marker = new google.maps.Marker({
          position: { lat: loc.lat!, lng: loc.lng! },
          title: loc.name,
          // map: map, // Clusterer will handle map attachment
        });
        marker.addListener("click", () => {
          onMarkerClick?.(loc.id);
        });
        return marker;
      });

    markersRef.current = newMarkers;

    if (newMarkers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers: newMarkers,
      });
    }

    // Cleanup function
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.setMap(null);
      }
    };
  }, [map, locations, onMarkerClick]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        let hasValid = false;
        locations.forEach((loc) => {
          if (loc.lat && loc.lng) {
            bounds.extend({ lat: loc.lat, lng: loc.lng });
            hasValid = true;
          }
        });
        if (hasValid) {
          map.fitBounds(bounds);
        }
      } else {
        map.setCenter({ lat: 36.2048, lng: 138.2529 });
        map.setZoom(5);
      }
    },
    [locations]
  );

  const handleLocateMe = () => {
    if (!map) return;
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.panTo(pos);
          map.setZoom(15);
          new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            },
            title: "You are here",
          });
          setIsLocating(false);
          toast.success("Location found!");
        },
        () => {
          toast.error("Error: The Geolocation service failed.");
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
      setIsLocating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      />
      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute top-4 right-14 bg-white text-gray-600 p-2 rounded-sm shadow-md hover:text-gray-900 focus:outline-none flex items-center justifying-center h-10 w-10 disabled:opacity-50"
        title="Locate Me"
      >
        <span className="material-symbols-outlined">
          {isLocating ? "location_searching" : "my_location"}
        </span>
      </button>
    </div>
  );
}
