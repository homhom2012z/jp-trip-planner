"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 0);
      // Small delay to allow render before animating in
      setTimeout(() => setIsVisible(true), 10);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsVisible(false), 0);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isRendered) return null;

  // Use portal to render at root level to avoid z-index issues
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden h-[85vh] ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div
          className="flex justify-center p-4 cursor-pointer"
          onClick={onClose}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-safe">{children}</div>
      </div>
    </>,
    document.body,
  );
}
