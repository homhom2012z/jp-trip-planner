"use client";

import React, { useState, useMemo, useEffect } from "react";
import MobileItineraryView from "./MobileItineraryView";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
  DropAnimation,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Location } from "@/lib/types";
import { useSavedPlaces } from "@/context/SavedPlacesContext";
import { useItinerary } from "@/context/ItineraryContext";
import DraggableLocationCard from "./DraggableLocationCard";

// Droppable Container Helper
function DroppableContainer({
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

interface ItineraryPlannerProps {
  locations: Location[];
}

export default function ItineraryPlanner({ locations }: ItineraryPlannerProps) {
  const { savedIds } = useSavedPlaces();
  const { days, setDays, addDay, removeDay } = useItinerary();
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. Calculate Unscheduled items
  // Must be in savedIds, present in 'locations' lookup, and NOT in any day
  const unscheduledItems = useMemo(() => {
    const scheduledIds = new Set(days.flatMap((d) => d.locationIds));
    return savedIds
      .filter((id) => !scheduledIds.has(id))
      .filter((id) => locations.find((l) => l.id === id));
  }, [savedIds, days, locations]);

  // We treat "unscheduled" as a container with ID "unscheduled"
  // and each day as a container with ID = day.id

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findContainer = (id: string) => {
    if (id === "unscheduled") return "unscheduled";
    if (unscheduledItems.find((l) => l === id)) return "unscheduled";

    // Check days
    const day = days.find((d) => d.locationIds.includes(id) || d.id === id);
    if (day) return day.id;

    console.log("Could not find container for", id);
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over?.id as string;

    if (!overId) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (activeContainer && overContainer) {
      // 1. Reordering within Same Container
      if (activeContainer === overContainer) {
        if (activeContainer === "unscheduled") {
          // We generally don't persist order of unscheduled list (it's derived from savedIds)
          // So we do nothing, or we'd need to reorder savedIds in SavedPlacesContext (complex)
        } else {
          // Reorder inside a Day
          const dayIndex = days.findIndex((d) => d.id === activeContainer);
          if (dayIndex !== -1) {
            const oldIndex = days[dayIndex].locationIds.indexOf(activeId);
            const newIndex = days[dayIndex].locationIds.indexOf(overId);
            if (oldIndex !== newIndex) {
              const newDays = [...days];
              newDays[dayIndex].locationIds = arrayMove(
                newDays[dayIndex].locationIds,
                oldIndex,
                newIndex,
              );
              setDays(newDays);
            }
          }
        }
      }
      // 2. Moving Between Containers
      else {
        // Remove from source
        const newDays = [...days];

        // If source was a Day, remove it
        if (activeContainer !== "unscheduled") {
          const sourceDayIndex = newDays.findIndex(
            (d) => d.id === activeContainer,
          );
          newDays[sourceDayIndex].locationIds = newDays[
            sourceDayIndex
          ].locationIds.filter((id) => id !== activeId);
        }

        // Add to destination
        if (overContainer !== "unscheduled") {
          const destDayIndex = newDays.findIndex((d) => d.id === overContainer);
          const overItemIndex =
            newDays[destDayIndex].locationIds.indexOf(overId);

          if (overItemIndex !== -1) {
            // Dropped on an item
            // logic simplified
          } else {
            // Dropped on the container
          }

          // Insert at end
          newDays[destDayIndex].locationIds.push(activeId);
        }

        setDays(newDays);
      }
    }

    setActiveId(null);
  };

  // Helper to lookup location data
  const getLocation = (id: string) => locations.find((l) => l.id === id);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onDragOver omitted for simplicity
    >
      {isMobile ? (
        <MobileItineraryView
          days={days}
          unscheduledItems={unscheduledItems}
          getLocation={getLocation}
          onRemoveDay={removeDay}
          onAddDay={addDay}
        />
      ) : (
        <div className="flex flex-col h-full bg-gray-50">
          {/* Unscheduled Pool */}
          {/* Unscheduled Pool */}
          <DroppableContainer
            id="unscheduled"
            className="bg-white border-b border-gray-200 p-4 shadow-sm z-10"
          >
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Unscheduled Places ({unscheduledItems.length})
            </h3>
            <SortableContext
              id="unscheduled"
              items={unscheduledItems} // passing strings is safe if they are unique
              strategy={verticalListSortingStrategy}
            >
              {unscheduledItems.length === 0 ? (
                <div className="text-sm text-gray-400 italic py-2">
                  All saved places scheduled!
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {/* Horizontal list of unscheduled items? Or vertical? 
                        Design: "Unscheduled" usually pool on top or side. 
                        Let's make it a horizontal carousel for space efficiency.
                        BUT, SortableContext with vertical strategy might expect vertical. 
                        Actually, let's just make it a simple list for now.
                    */}
                  <div className="flex flex-col gap-2 w-full max-h-[200px] overflow-y-auto min-h-[50px]">
                    {unscheduledItems.map((id) => {
                      const loc = getLocation(id);
                      return loc ? (
                        <DraggableLocationCard
                          key={id}
                          id={id}
                          location={loc}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </SortableContext>
          </DroppableContainer>

          {/* Days List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            {days.map((day) => (
              <div key={day.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">{day.title}</h2>
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(day.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  )}
                </div>

                <DroppableContainer
                  id={day.id}
                  className="bg-gray-100 rounded-lg min-h-[100px] p-2 border-2 border-dashed border-gray-200 transition-colors hover:border-blue-200"
                >
                  <SortableContext
                    id={day.id}
                    items={day.locationIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2 min-h-[50px]">
                      {day.locationIds.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-4 pointer-events-none">
                          Drag places here
                        </div>
                      )}
                      {day.locationIds.map((locId) => {
                        const loc = getLocation(locId);
                        return loc ? (
                          <DraggableLocationCard
                            key={locId}
                            id={locId}
                            location={loc}
                          />
                        ) : null;
                      })}
                    </div>
                  </SortableContext>
                </DroppableContainer>
              </div>
            ))}

            <button
              onClick={addDay}
              className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-medium hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Add Day
            </button>
          </div>
        </div>
      )}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
          getLocation(activeId) ? (
            <DraggableLocationCard
              id={activeId}
              location={getLocation(activeId)!}
              isOverlay
            />
          ) : null
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
