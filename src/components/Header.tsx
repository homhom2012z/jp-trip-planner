"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
// Material Symbols are loaded in layout.tsx

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

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
              JapanTripPlanner
            </h1>
          </Link>

          {/* Desktop Navigation - Left Aligned (Non-Home) */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                {t("destinations")}
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                {t("itineraries")}
              </a>
              <a
                href="#"
                className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
              >
                {t("guides")}
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
              {t("destinations")}
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
            >
              {t("itineraries")}
            </a>
            <a
              href="#"
              className="text-sm font-medium text-[#1b0d12]/80 hover:text-primary transition-colors"
            >
              {t("guides")}
            </a>
          </nav>
        )}

        {/* Mobile Menu Trigger & Language Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center h-8 w-10 text-xs font-bold text-[#1b0d12] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
            aria-label={
              language === "en" ? "Switch to Thai" : "Switch to English"
            }
          >
            {language === "en" ? "TH" : "EN"}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1b0d12] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full border-b border-[#f3e7eb] bg-white shadow-lg z-40 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className="px-4 py-3 text-sm font-medium text-[#1b0d12] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-400">
                travel_explore
              </span>
              {t("destinations")}
            </Link>
            <a
              href="#"
              className="px-4 py-3 text-sm font-medium text-[#1b0d12] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-400">
                map
              </span>
              {t("itineraries")}
            </a>
            <a
              href="#"
              className="px-4 py-3 text-sm font-medium text-[#1b0d12] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-400">
                book
              </span>
              {t("guides")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
