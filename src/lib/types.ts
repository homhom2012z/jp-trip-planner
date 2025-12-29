export type Coordinates = [number, number];

export interface Location {
  id: string;
  city: string;
  name: string;
  type: string;
  priceJpy: string;
  priceThb: string;
  googleMapsUrl: string;
  photoUrl?: string; // Optional for now
  lat?: number;
  lng?: number;
  distanceFromMetro?: string; // e.g. "500m from Kyoto Station"
  description?: string;
  googlePlaceId?: string; // For locations clicked directly from map POIs
}

export interface CityInfo {
  name: string;
  slug: string; // e.g., 'kyoto'
  description: string;
  image: string; // placeholder path
  locations: Location[];
}
