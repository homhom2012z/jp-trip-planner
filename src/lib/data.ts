import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { Location } from "./types";

// Enriched coordinate map based on search results and common knowledge
const COORDINATE_MAP: Record<string, { lat: number; lng: number }> = {
  // Kyoto
  Mishimatei: { lat: 35.0083, lng: 135.7681 },
  "Honke Owariya": { lat: 35.0116, lng: 135.7615 },
  "Menya Inoichi": { lat: 35.0044, lng: 135.7667 },
  "Gion Karyo": { lat: 35.0048, lng: 135.7765 },
  "Katsukura Sanjo": { lat: 35.009, lng: 135.768 },
  "Izuju Sushi": { lat: 35.0036, lng: 135.7768 },
  "Chao Chao Gyoza": { lat: 35.0035, lng: 135.7705 },
  Shigetsu: { lat: 35.0157, lng: 135.6737 },

  // Uji
  "Nakamura Tokichi": { lat: 34.8893, lng: 135.8016 },
  "Itoh Kyuemon": { lat: 34.8935, lng: 135.798 },
  Tatsumiya: { lat: 34.8906, lng: 135.8068 },
  "Tsuen Tea": { lat: 34.8913, lng: 135.8078 },
  Agetsuchi: { lat: 34.892, lng: 135.805 },
  "Renge-chaya": { lat: 34.89, lng: 135.808 },
  "Kyoto Rokujoan": { lat: 34.895, lng: 135.8 },
  Kyotousen: { lat: 34.893, lng: 135.803 },

  // Kamakura
  "Matsubara-an": { lat: 35.3113, lng: 139.5352 },
  Caraway: { lat: 35.3193, lng: 139.554 },
  Raitei: { lat: 35.3175, lng: 139.525 },
  Hachinoki: { lat: 35.326, lng: 139.55 },
  "Ichirin Hanare": { lat: 35.312, lng: 139.536 },
  Shirasuya: { lat: 35.305, lng: 139.495 },
  "Taiyaki Namihei": { lat: 35.315, lng: 139.54 },
  "Kamakura Kura": { lat: 35.318, lng: 139.551 },

  // Tokyo
  "Ichiran Ramen": { lat: 35.6604, lng: 139.7005 },
  "Manten Sushi": { lat: 35.6795, lng: 139.7635 },
  "Maisen Tonkatsu": { lat: 35.666, lng: 139.7115 },
  "Bondy Curry": { lat: 35.696, lng: 139.757 },
  "Ningyocho Imahan": { lat: 35.689, lng: 139.703 }, // Shinjuku
  "Kanda Matsuya": { lat: 35.6968, lng: 139.769 },
  Fuunji: { lat: 35.6875, lng: 139.6975 },
  Yoroniku: { lat: 35.662, lng: 139.713 },

  // Osaka
  "Okonomiyaki Mizuno": { lat: 34.6685, lng: 135.5015 },
  "Takoyaki Wanaka": { lat: 34.6655, lng: 135.503 },
  "Endo Sushi": { lat: 34.686, lng: 135.48 },
  "Kushikatsu Daruma": { lat: 34.652, lng: 135.506 },
  "Yakiniku M": { lat: 34.668, lng: 135.502 },
  "Dotombori Imai": { lat: 34.6686, lng: 135.5013 },
  "Gyukatsu Motomura": { lat: 34.665, lng: 135.5025 },
  "Izakaya Toyo": { lat: 34.696, lng: 135.533 },
};

// Fallback logic to prevent stacking if missing (random jitter around city center)
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  Tokyo: { lat: 35.6895, lng: 139.6917 },
  Osaka: { lat: 34.6937, lng: 135.5023 },
  Kyoto: { lat: 35.0116, lng: 135.7681 },
  Uji: { lat: 34.8893, lng: 135.8016 },
  Kamakura: { lat: 35.3191, lng: 139.5467 },
};

async function parseCsv(filePath: string): Promise<any[]> {
  const absolutePath = path.join(process.cwd(), "public/data", filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf8");

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error: unknown) => reject(error),
    });
  });
}

function transformData(rawRow: any, index: number): Location {
  const name =
    rawRow["Restaurant Name"] || rawRow["Landmark Name"] || "Unknown";
  const city = rawRow["City"] || "Tokyo";

  // Find coord or fallback to city center + jitter
  let coords = COORDINATE_MAP[name];
  if (!coords) {
    const cityCenter = CITY_CENTERS[city] || CITY_CENTERS["Tokyo"];
    coords = {
      lat: cityCenter.lat + (Math.random() - 0.5) * 0.02,
      lng: cityCenter.lng + (Math.random() - 0.5) * 0.02,
    };
  }

  return {
    id: `loc-${index}-${name.replace(/\s+/g, "-").toLowerCase()}`,
    city: city,
    name: name,
    type: rawRow["Cuisine Type"] || "Spot",
    priceJpy: rawRow["Price (JPY)"] || "-",
    priceThb: rawRow["Price (THB)"] || "-",
    googleMapsUrl: rawRow["Google Maps"] || "#",
    lat: coords.lat,
    lng: coords.lng,
    distanceFromMetro: "Check Map",
  };
}

export async function getAllLocations(): Promise<Location[]> {
  const trip1Day = await parseCsv("JP - Restuarants - 1-day-trip.csv");
  const tripMain = await parseCsv("JP - Restuarants - main-trip-city.csv");

  const allRaw = [...trip1Day, ...tripMain].filter((row) => row["City"]); // Filter empty rows

  return allRaw.map((row, idx) => transformData(row, idx));
}

export async function getLocationsByCity(
  cityName: string
): Promise<Location[]> {
  const all = await getAllLocations();
  return all.filter((l) => l.city.toLowerCase() === cityName.toLowerCase());
}
