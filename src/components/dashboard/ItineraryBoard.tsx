"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUser } from "@/context/UserContext";
import { api } from "@/services/api";
import toast from "react-hot-toast";
import { Location } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

type ItineraryItem = {
  day: string;
  locationId: string;
  order: number;
  note: string;
};

// Sortable Item Component
function SortableItem({
  id,
  location,
  isOverlay = false,
}: {
  id: string;
  location: Location;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  if (!location) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded-lg shadow-sm mb-2 border border-gray-100 cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing ${
        isOverlay ? "shadow-xl rotate-2 cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {location.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.photoUrl}
            alt={location.name}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-gray-900 truncate">
            {location.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">{location.city}</p>
        </div>
      </div>
    </div>
  );
}

interface ColumnProps {
  id: string;
  title: string;
  items: ItineraryItem[];
  locations: Location[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

function Column({
  id,
  title,
  items,
  locations,
  onRename,
  onDelete,
}: ColumnProps) {
  const { setNodeRef } = useSortable({ id });
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    if (editValue.trim() && editValue !== title) {
      onRename(id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter((item) => {
      const loc = locations.find((l) => l.id === item.locationId);
      return (
        loc?.name.toLowerCase().includes(lowerQuery) ||
        loc?.city.toLowerCase().includes(lowerQuery)
      );
    });
  }, [items, locations, searchQuery]);

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 p-4 rounded-xl min-w-[280px] w-full md:w-[320px] flex-shrink-0 border border-gray-200 flex flex-col max-h-[calc(100vh-200px)]"
    >
      <div className="font-bold text-gray-700 mb-3 sticky top-0 bg-gray-50 z-10">
        <div className="flex justify-between items-center group mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-white border border-primary rounded px-1 py-0.5 text-sm w-full focus:outline-none"
              />
            ) : (
              <span
                onClick={() => title !== "Unscheduled" && setIsEditing(true)}
                className={`truncate ${
                  title !== "Unscheduled"
                    ? "cursor-pointer hover:bg-gray-200 px-1 rounded transition-colors"
                    : ""
                }`}
                title={title !== "Unscheduled" ? "Click to rename" : ""}
              >
                {title === "Unscheduled" ? t("unscheduled") : title}
              </span>
            )}
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0">
              {filteredItems.length}
              {searchQuery && (
                <span className="text-gray-400">/{items.length}</span>
              )}
            </span>
          </div>

          {title !== "Unscheduled" && (
            <button
              onClick={() => {
                if (
                  window.confirm(t("deleteDayPrompt").replace("{name}", title))
                ) {
                  onDelete(id);
                }
              }}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              title="Delete Day"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-[16px]">
                close
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SortableContext
          items={filteredItems.map((i) => i.locationId)}
          strategy={verticalListSortingStrategy}
        >
          {filteredItems.map((item) => {
            const loc = locations.find((l) => l.id === item.locationId);
            if (!loc) return null;
            return (
              <SortableItem
                key={item.locationId}
                id={item.locationId}
                location={loc}
              />
            );
          })}
        </SortableContext>
        {filteredItems.length === 0 && (
          <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            {searchQuery ? t("noMatches") : t("dropHere")}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItineraryBoard() {
  const { locations, activeTripId } = useUser();
  const { t } = useLanguage();
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [days, setDays] = useState(["Unscheduled", "Day 1", "Day 2", "Day 3"]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Sync Data on Mount
  useEffect(() => {
    if (!activeTripId) return;
    const loadItinerary = async () => {
      try {
        const data = await api.getItinerary(activeTripId);
        setItinerary(data);

        // Extract Days
        const daysFromData = Array.from(
          new Set(data.map((i: ItineraryItem) => i.day))
        ) as string[];
        const uniqueDays = daysFromData.filter((d) => d !== "Unscheduled");

        // Ensure standard days if empty? Or just respect data.
        if (uniqueDays.length > 0) {
          setDays(["Unscheduled", ...uniqueDays.sort()]);
        } else {
          setDays(["Unscheduled", "Day 1", "Day 2", "Day 3"]);
        }
      } catch (e) {
        console.error("Failed to load itinerary", e);
      }
    };
    loadItinerary();
  }, [activeTripId]);

  // Derived State: Combine Backend Itinerary with Unscheduled Locations
  const fullItinerary = useMemo(() => {
    // 1. Existing Itinerary Items
    const validItems = itinerary.filter((i) =>
      locations.some((l) => l.id === i.locationId)
    );

    // 2. Find missing locations (Unscheduled)
    const cachedIds = new Set(validItems.map((i) => i.locationId));
    const missingLocations = locations.filter((l) => !cachedIds.has(l.id));

    const unscheduledItems = missingLocations.map((l, idx) => ({
      day: "Unscheduled",
      locationId: l.id,
      order: idx,
      note: "",
    }));

    return [...validItems, ...unscheduledItems];
  }, [itinerary, locations]);

  // Sensors: Configure for Mobile (Touch) vs Desktop (Pointer/Mouse)
  // Distance constraint: 8px movement required before drag starts (allows scrolling)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string; // Could be a container ID ("Day 1") or an item ID ("loc-1")

    // Find source and destination details
    const activeItem = fullItinerary.find((i) => i.locationId === activeId);
    if (!activeItem) return;

    let newDay = "";

    // Check if dropping on a Column (Empty or Header)
    if (days.includes(overId)) {
      newDay = overId;
      // Append to end
      // const itemsInDay = fullItinerary.filter((i) => i.day === newDay);
    } else {
      // Dropping on another Item
      const overItem = fullItinerary.find((i) => i.locationId === overId);
      if (overItem) {
        newDay = overItem.day;
        // Insert before or after? simplified: swap logic or insert.
        // For SortableContext: we let arrayMove handle local state, then sync.
        // Complex part: We need to update *every* item's order in that day.
      } else {
        return; // Unknown drop target
      }
    }

    // UPDATE STATE OPTIMISTICALLY
    // NOTE: dnd-kit's "arrayMove" is for single lists. We have multiple.
    // We will manually construct the new state.

    let newItemState = [...fullItinerary];

    // 1. Remove active item from old position
    newItemState = newItemState.filter((i) => i.locationId !== activeId);

    // 2. Identify Target Day's items (excluding active)
    const targetDayItems = newItemState
      .filter((i) => i.day === newDay)
      .sort((a, b) => a.order - b.order);

    // 3. Determine Index to insert at
    let insertIndex = targetDayItems.length; // Default: End
    if (!days.includes(overId)) {
      const overIndex = targetDayItems.findIndex(
        (i) => i.locationId === overId
      );
      if (overIndex !== -1) insertIndex = overIndex;
      // If dragging downwards, might need adjustment, but simplified insertion is okay for now.
    }

    // 4. Insert Item
    targetDayItems.splice(insertIndex, 0, {
      ...activeItem,
      day: newDay,
      order: insertIndex,
    });

    // 5. Re-normalize Orders for Target Day
    const updatedTargetDayItems = targetDayItems.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    // 6. Merge back
    // Filter out target day from main list
    const otherDayItems = newItemState.filter((i) => i.day !== newDay);

    const finalState = [...otherDayItems, ...updatedTargetDayItems];

    // 7. Update Local State (Only the part that is persisted, i.e., !Unscheduled or if we treat unscheduled as persistent too?)
    // Decision: "Unscheduled" is just lack of entry in "Itinerary Sheet".
    // So if day === "Unscheduled", we remove it from the list we send to backend?
    // User requested "Drag Bucket List -> Day".
    // Does Bucket List persist order? Usually yes.
    // Let's persist EVERYTHING to the sheet for consistency, even "Unscheduled" rows if we want order.
    // OR: Unscheduled = delete from sheet?
    // Safer: Persist "Unscheduled" as a day in Sheet so we keep notes/order.

    // We update local state to reflect change immediately
    // Note: setItinerary logic handles merging, so we just set the raw list match.
    // We actually need to update the `itinerary` state which only tracks persisted items.
    // The `fullItinerary` is derived, but we need to feed changes back to `itinerary`.

    // Update local state (Optimistic)
    // We filter `finalState` to what we actually want to save (Assuming we save everything now)
    setItinerary(finalState);

    // 8. Persist to Backend
    if (!activeTripId) return;
    setIsSaving(true);
    try {
      await api.updateItinerary(activeTripId, finalState);
      setLastSaved(new Date());
      toast.success(t("itinerarySaved"));
    } catch (e) {
      console.error("Failed to save itinerary", e);
      toast.error(t("saveFailed"));
      // Revert? (loadItinerary)
    } finally {
      setIsSaving(false);
    }
  };

  // Add Day
  const addDay = () => setDays([...days, `Day ${days.length}`]);

  // Rename Day
  const handleRename = async (oldName: string, newName: string) => {
    if (days.includes(newName)) {
      toast.error(t("dayNameExists"));
      return;
    }

    // 1. Update columns
    setDays((prev) => prev.map((d) => (d === oldName ? newName : d)));

    // 2. Update items attached to this day
    const updatedItinerary = fullItinerary.map((item) =>
      item.day === oldName ? { ...item, day: newName } : item
    );

    // 3. Save
    setItinerary(updatedItinerary);
    if (!activeTripId) return;
    setIsSaving(true);
    try {
      await api.updateItinerary(activeTripId, updatedItinerary);
      setLastSaved(new Date());
      toast.success(t("dayRenamed"));
    } catch (e) {
      console.error(e);
      toast.error(t("failedToRename"));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Day
  const handleDelete = async (dayName: string) => {
    // 1. Remove column
    setDays((prev) => prev.filter((d) => d !== dayName));

    // 2. Move items to Unscheduled
    const updatedItinerary = fullItinerary.map((item) =>
      item.day === dayName ? { ...item, day: "Unscheduled" } : item
    );

    // 3. Save
    setItinerary(updatedItinerary);
    if (!activeTripId) return;
    setIsSaving(true);
    try {
      await api.updateItinerary(activeTripId, updatedItinerary);
      setLastSaved(new Date());
      toast.success(t("dayDeleted"));
    } catch (e) {
      console.error(e);
      toast.error(t("failedToDelete"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-baseline gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              {t("tripItinerary")}
            </h2>
            <div className="text-xs text-gray-500">
              {isSaving ? (
                <span className="text-blue-600 font-medium">{t("saving")}</span>
              ) : lastSaved ? (
                <span>
                  {t("savedAt")} {lastSaved.toLocaleTimeString()}
                </span>
              ) : (
                <span>{t("autoSave")}</span>
              )}
            </div>
          </div>
          <button
            onClick={addDay}
            className="text-sm bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
          >
            {t("addDay")}
          </button>
        </div>

        <div className="flex flex-1 gap-4 overflow-x-auto pb-4 items-start">
          {days.map((day) => (
            <Column
              key={day}
              id={day}
              title={day}
              items={fullItinerary
                .filter((i) => i.day === day)
                .sort((a, b) => a.order - b.order)}
              locations={locations}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <SortableItem
              id={activeId}
              location={locations.find((l) => l.id === activeId)!}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
