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
  openingHours?: {
    weekdayText?: string[];
    openNow?: boolean;
  };
  businessStatus?: string;
  utcOffsetMinutes?: number;
}

export interface CityInfo {
  name: string;
  slug: string; // e.g., 'kyoto'
  description: string;
  image: string; // placeholder path
  locations: Location[];
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  spreadsheet_id?: string;
  google_refresh_token?: string; // We likely won't return this to frontend for security, but good to know
  updated_at?: string;
  public_slug?: string | null;
  is_public?: boolean;
}
