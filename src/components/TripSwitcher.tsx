"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function TripSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { user, availableTrips, activeTripId, switchTrip } = useUser();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const hasOptions = availableTrips.length > 0;

  // Find current active trip object
  const activeTrip =
    availableTrips.find((t) => t.id === activeTripId) ||
    availableTrips.find((t) => t.id === user.id);

  // Label helper
  const getTripLabel = (trip: any) => {
    const isMine = trip.id === user.id;
    return isMine
      ? t("myTrip")
      : trip.full_name || trip.email
      ? `${trip.full_name || trip.email}${t("sTrip")}`
      : t("sharedTrip");
  };

  const currentLabel = activeTrip ? getTripLabel(activeTrip) : t("myTrip");

  const handleSelect = (tripId: string) => {
    switchTrip(tripId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Backdrop to close on click outside */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {/* Trigger Button */}
      <button
        onClick={() => hasOptions && setIsOpen(!isOpen)}
        disabled={!hasOptions}
        className={`
            flex items-center gap-2 
            bg-white/50 hover:bg-white/80 border border-gray-200 
            text-[#1b0d12] text-xs sm:text-sm font-medium 
            rounded-lg px-3 py-1.5 sm:py-2 
            transition-all cursor-pointer 
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${!hasOptions ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
        `}
      >
        <span className="truncate flex-1 text-left">{currentLabel}</span>
        <span
          className={`material-symbols-outlined text-[18px] text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
          {availableTrips.map((trip) => {
            const isSelected = trip.id === activeTripId;
            return (
              <button
                key={trip.id}
                onClick={() => handleSelect(trip.id)}
                className={`
                    w-full text-left px-4 py-2 text-sm flex items-center justify-between
                    ${
                      isSelected
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
              >
                <span className="truncate">{getTripLabel(trip)}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
