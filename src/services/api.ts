import axios from "axios";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Helper to get current session token
async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export const api = {
  // Auth
  getGoogleAuthUrl: async () => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/auth/google/url`, { headers });
    return response.data.url;
  },

  linkGoogleAccount: async (code: string) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/auth/google/callback`,
      { code },
      { headers }
    );
    return response.data;
  },

  // Locations
  getLocations: async (ownerId: string) => {
    const headers = await getAuthHeader();
    // Pass ownerId in query
    const response = await axios.get(
      `${API_URL}/api/locations?ownerId=${ownerId}`,
      { headers }
    );
    return response.data.locations;
  },

  syncLocations: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/api/locations/sync`,
      { ownerId },
      { headers }
    );
    return response.data;
  },

  syncWithGoogle: async (ownerId: string) => {
    // Deprecated? This seems to duplicate syncLocations but calling /sheets/sync.
    // Let's forward to syncLocations logic or update it.
    // The previous implementation called /sheets/sync.
    // Let's assume syncLocations (above) is the correct one now.
    // But to be safe, let's keep this as alias or update.
    // The previous code: axios.post(`${API_URL}/sheets/sync`, { ownerId });
    // Let's match syncLocations signature.
    return api.syncLocations(ownerId);
  },

  // Itinerary
  syncItinerary: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const res = await axios.get(
      `${API_URL}/api/itinerary/sync?ownerId=${ownerId}`,
      { headers }
    );
    return res.data;
  },

  getItinerary: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const res = await axios.get(`${API_URL}/api/itinerary?ownerId=${ownerId}`, {
      headers,
    });
    return res.data;
  },

  updateItinerary: async (ownerId: string, items: any[]) => {
    const headers = await getAuthHeader();
    const res = await axios.post(
      `${API_URL}/api/itinerary/update`,
      {
        ownerId,
        items,
      },
      { headers }
    );
    return res.data;
  },

  updateLocation: async (
    ownerId: string,
    id: string,
    updates: Record<string, unknown>
  ) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/api/locations/update`,
      { ownerId, locationId: id, updates },
      { headers }
    );
    return response.data;
  },

  disconnectSheet: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/api/locations/disconnect`,
      { ownerId },
      { headers }
    );
    return response.data;
  },

  previewLocation: async (name?: string, city?: string, url?: string) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/api/locations/preview`,
      { name, city, url },
      { headers }
    );
    return response.data;
  },

  deleteLocation: async (locationId: string, ownerId?: string) => {
    const headers = await getAuthHeader();
    const body: any = { locationId };
    if (ownerId) body.ownerId = ownerId;

    const response = await axios.post(`${API_URL}/api/locations/delete`, body, {
      headers,
    });
    return response.data;
  },

  addLocation: async (
    name: string,
    city: string,
    previewData: any,
    ownerId?: string
  ) => {
    const headers = await getAuthHeader();
    // If ownerId is provided, use it (for owner actions).
    // The backend `validateAccess` likely uses `req.targetOwnerId`.
    // If we are the owner, we pass our ID.
    const body: any = { name, city, previewData };
    if (ownerId) body.ownerId = ownerId; // Backend expects targetOwnerId if different? Or maybe just ownerId.

    // In locations.routes.ts: `validateAccess` is used.
    // Usually it checks req.body.ownerId or req.query.ownerId.
    // We'll pass it in body to be safe.

    const response = await axios.post(`${API_URL}/api/locations/add`, body, {
      headers,
    });
    return response.data;
  },

  batchAddLocations: async (urls: string[], ownerId?: string) => {
    const headers = await getAuthHeader();
    const body: any = { urls };
    if (ownerId) body.ownerId = ownerId;

    const response = await axios.post(
      `${API_URL}/api/locations/batch-add`,
      body,
      {
        headers,
      }
    );
    return response.data;
  },

  // Collaborators
  listCollaborators: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const res = await axios.get(
      `${API_URL}/api/collaborators?ownerId=${ownerId}`,
      { headers }
    );
    return res.data;
  },

  inviteCollaborator: async (ownerId: string, email: string) => {
    const headers = await getAuthHeader();
    const res = await axios.post(
      `${API_URL}/api/collaborators/invite`,
      { ownerId, email },
      { headers }
    );
    return res.data;
  },

  removeCollaborator: async (ownerId: string, email: string) => {
    const headers = await getAuthHeader();
    const res = await axios.delete(
      `${API_URL}/api/collaborators/${email}?ownerId=${ownerId}`,
      { headers }
    );
    return res.data;
  },

  getAccessibleTrips: async () => {
    const headers = await getAuthHeader();
    const res = await axios.get(`${API_URL}/api/collaborators/accessible`, {
      headers,
    });
    return res.data;
  },

  getTripOwnerProfile: async (ownerId: string) => {
    const headers = await getAuthHeader();
    const res = await axios.get(
      `${API_URL}/api/collaborators/${ownerId}/profile`,
      { headers }
    );
    return res.data;
  },
};
