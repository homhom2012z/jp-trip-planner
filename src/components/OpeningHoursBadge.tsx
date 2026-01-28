import { Location } from "@/lib/types";

interface OpeningHoursBadgeProps {
  location: Location;
}

export default function OpeningHoursBadge({
  location,
}: OpeningHoursBadgeProps) {
  if (!location.openingHours && !location.businessStatus) return null;

  const isOpen = location.openingHours?.openNow;
  const isClosed = location.businessStatus === "CLOSED_PERMANENTLY";
  const isTempClosed = location.businessStatus === "CLOSED_TEMPORARILY";

  if (isClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
        <span className="material-symbols-outlined text-[14px]">cancel</span>
        Closed Permanently
      </span>
    );
  }

  if (isTempClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
        <span className="material-symbols-outlined text-[14px]">schedule</span>
        Temporarily Closed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
        isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">
        {isOpen ? "check_circle" : "cancel"}
      </span>
      {isOpen ? "Open Now" : "Closed"}
    </span>
  );
}
