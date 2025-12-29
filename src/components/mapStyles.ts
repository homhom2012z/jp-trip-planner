// 1. Default Style: Clean, strictly POIs. Transit lines hidden, but stations visible/clickable.
export const defaultMapStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit.line",
    elementType: "all",
    stylers: [{ visibility: "off" }], // Hide lines by default for cleaner look
  },
];

// 2. Transit Style: Show standard transit lines and stations.
export const transitMapStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  // Removing 'poi.business' hide because many major Japanese stations are technically shopping complexes
  // and hiding 'business' disables the click target for the station itself.
  {
    featureType: "poi.attraction",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [{ visibility: "on" }], // Double ensure stations are ON
  },
];
