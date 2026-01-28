import { Location } from "@/lib/types";
import { getFallbackImage } from "@/lib/images";
import { useSavedPlaces } from "@/context/SavedPlacesContext";
import OpeningHoursBadge from "./OpeningHoursBadge";

interface LocationListProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  onDelete?: (locationId: string) => void;
}

export default function LocationList({
  locations,
  onLocationClick,
  onDelete,
}: LocationListProps) {
  const { isSaved, toggleSaved } = useSavedPlaces();

  const getImage = (type: string) => {
    return getFallbackImage(type);
  };

  const getTypeLabel = (type: string) => {
    if (
      type.toLowerCase().includes("ramen") ||
      type.toLowerCase().includes("dining")
    )
      return "Dining";
    if (
      type.toLowerCase().includes("temple") ||
      type.toLowerCase().includes("shrine")
    )
      return "Landmark";
    if (type.toLowerCase().includes("shopping")) return "Shopping";
    return "Spot";
  };

  const getRating = (id: string) => {
    // Stable random based on ID
    const seed = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (Math.sin(seed) + 1) / 2; // Simple pseudo-random 0-1
    return (4.5 + random * 0.4).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {locations.map((loc) => {
        const saved = isSaved(loc.id);
        return (
          <div
            key={loc.id}
            className="group flex flex-col bg-surface rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] cursor-pointer touch-manipulation"
            onClick={() => onLocationClick?.(loc)}
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={loc.photoUrl || getImage(loc.type)}
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(loc.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm active:scale-90 ${
                  saved
                    ? "bg-white text-red-500"
                    : "bg-white/90 text-gray-400 hover:text-red-500 hover:scale-110"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] block ${
                    saved ? "fill-1" : ""
                  }`}
                >
                  favorite
                </span>
              </button>

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${loc.name}?`,
                      )
                    ) {
                      onDelete(loc.id);
                    }
                  }}
                  className="absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-400 hover:text-red-600 hover:scale-110 transition-all shadow-sm z-10"
                  title="Delete Location"
                >
                  <span className="material-symbols-outlined text-[20px] block">
                    delete
                  </span>
                </button>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
                {getTypeLabel(loc.type)}
              </div>
            </div>

            {/* Content */}

            <div className="flex flex-col p-4 gap-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-text-main leading-tight group-hover:text-primary transition-colors">
                    {loc.name}
                  </h3>
                  <OpeningHoursBadge location={loc} />
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px] fill-1">
                    star
                  </span>
                  {getRating(loc.id)}
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2">
                {loc.type} •{" "}
                {loc.priceJpy !== "-" ? `¥${loc.priceJpy}` : "Price varies"}
              </p>

              <div className="mt-2 flex items-center gap-3 text-xs font-medium text-text-secondary">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationClick?.(loc);
                  }}
                  className="flex items-center gap-1 hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    location_on
                  </span>
                  Check Map
                </button>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    payments
                  </span>
                  {loc.priceThb !== "-" ? `฿${loc.priceThb}` : "Varies"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
