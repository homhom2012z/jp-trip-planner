"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Material Symbols are loaded in layout.tsx

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f3e7eb] bg-[#fcf8f9]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Logo Section */}
        <div className={`flex items-center ${isHome ? "" : "gap-8"}`}>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">
                travel_explore
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1b0d12]">
              JapanTravel
            </h1>
          </Link>

          {/* Desktop Navigation - Left Aligned (Non-Home) */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                Destinations
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                Itineraries
              </a>
              <a
                href="#"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                Guides
              </a>
            </nav>
          )}
        </div>

        {/* Desktop Navigation - Centered (Home Only) */}
        {isHome && (
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
            >
              Destinations
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
            >
              Itineraries
            </a>
            <a
              href="#"
              className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
            >
              Guides
            </a>
          </nav>
        )}

        {/* Mobile Menu Trigger (No User Section) */}
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-[#1b0d12]">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
