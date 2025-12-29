import { Location } from "./types";

const CITY_HUBS: Record<string, { lat: number; lng: number; name: string }> = {
  Tokyo: { lat: 35.6812, lng: 139.7671, name: "Tokyo Station" },
  Kyoto: { lat: 34.9858, lng: 135.7588, name: "Kyoto Station" },
  Osaka: { lat: 34.7025, lng: 135.4959, name: "Osaka Station" },
  Hakone: { lat: 35.2333, lng: 139.1039, name: "Hakone-Yumoto" },
};

function toRad(x: number): number {
  return (x * Math.PI) / 180;
}

// Haversine formula
export function getDistanceFromHub(
  city: string,
  targetLat: number,
  targetLng: number
): { distanceKm: string; hubName: string } | null {
  const hub = CITY_HUBS[city];
  if (!hub) return null;

  const R = 6371; // km
  const dLat = toRad(targetLat - hub.lat);
  const dLon = toRad(targetLng - hub.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(hub.lat)) *
      Math.cos(toRad(targetLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return {
    distanceKm: d.toFixed(1),
    hubName: hub.name,
  };
}
