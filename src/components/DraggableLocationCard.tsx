"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Location } from "@/lib/types";
import { getFallbackImage } from "@/lib/images";

interface DraggableLocationCardProps {
  id: string;
  location: Location;
  isOverlay?: boolean;
}

export default function DraggableLocationCard({
  id,
  location,
  isOverlay = false,
}: DraggableLocationCardProps) {
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
    zIndex: isDragging ? 999 : "auto",
  };

  const image = location.photoUrl || getFallbackImage(location.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex gap-3 
        group hover:border-blue-300 hover:shadow-md transition-all
        ${isOverlay ? "shadow-2xl ring-2 ring-blue-500 rotate-2 scale-105" : ""}
      `}
    >
      {/* Handle / Image */}
      <div className="size-12 rounded-md bg-gray-100 shrink-0 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={location.name}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {location.name}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {location.type} • {location.city}
        </p>
      </div>

      {/* Drag Handle */}
      <div
        {...listeners}
        className="flex items-center text-gray-300 group-hover:text-gray-400 cursor-grab active:cursor-grabbing p-1 touch-none"
      >
        <span className="material-symbols-outlined text-[20px]">
          drag_indicator
        </span>
      </div>
    </div>
  );
}
