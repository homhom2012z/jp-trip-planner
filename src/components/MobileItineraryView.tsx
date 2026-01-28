import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import DraggableLocationCard from "./DraggableLocationCard";
import { Day } from "@/context/ItineraryContext";
import { Location } from "@/lib/types";

interface MobileItineraryViewProps {
  days: Day[];
  unscheduledItems: string[];
  getLocation: (id: string) => Location | undefined;
  onRemoveDay: (id: string) => void;
  onAddDay: () => void;
}

// Helper for Droppable
function DroppableSection({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

export default function MobileItineraryView({
  days,
  unscheduledItems,
  getLocation,
  onRemoveDay,
  onAddDay,
}: MobileItineraryViewProps) {
  return (
    <div className="flex flex-col h-full bg-background pb-24">
      {/* Unscheduled Items - Horizontal Scroll at Top */}
      <div className="bg-surface p-4 shadow-sm border-b border-gray-100 z-10 sticky top-0">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">
            inventory_2
          </span>
          Unscheduled ({unscheduledItems.length})
        </h3>
        <DroppableSection id="unscheduled" className="min-h-[60px]">
          <SortableContext
            id="unscheduled"
            items={unscheduledItems}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {unscheduledItems.length === 0 ? (
                <div className="text-sm text-gray-300 italic w-full text-center py-2">
                  Empty pool
                </div>
              ) : (
                unscheduledItems.map((id) => {
                  const loc = getLocation(id);
                  return loc ? (
                    <div key={id} className="min-w-[200px] snap-start">
                      <DraggableLocationCard id={id} location={loc} />
                    </div>
                  ) : null;
                })
              )}
            </div>
          </SortableContext>
        </DroppableSection>
      </div>

      {/* Timeline Days */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {days.map((day, dayIndex) => (
          <div key={day.id} className="relative">
            {/* Day Header */}
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 py-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                  {dayIndex + 1}
                </div>
                <h2 className="text-xl font-bold text-text-main">
                  {day.title}
                </h2>
              </div>
              {days.length > 1 && (
                <button
                  onClick={() => onRemoveDay(day.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>

            {/* Timeline Line */}
            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />

            {/* Locations Droppable */}
            <DroppableSection
              id={day.id}
              className="pl-12 flex flex-col gap-4 min-h-[50px]"
            >
              <SortableContext
                id={day.id}
                items={day.locationIds}
                strategy={verticalListSortingStrategy}
              >
                {day.locationIds.length === 0 && (
                  <div className="text-sm text-gray-300 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    Drop places here
                  </div>
                )}
                {day.locationIds.map((locId) => {
                  const loc = getLocation(locId);
                  return loc ? (
                    <div key={locId} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-primary shadow-sm z-10" />
                      <DraggableLocationCard id={locId} location={loc} />
                    </div>
                  ) : null;
                })}
              </SortableContext>
            </DroppableSection>
          </div>
        ))}

        <button
          onClick={onAddDay}
          className="w-full py-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <span className="material-symbols-outlined">add</span>
          Add Another Day
        </button>
      </div>
    </div>
  );
}
