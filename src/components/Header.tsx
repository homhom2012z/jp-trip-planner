"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LoginButton from "./LoginButton";
import ProfileMenu from "./ProfileMenu";
import TripSwitcher from "./TripSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
// Material Symbols are loaded in layout.tsx

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Logo Section */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">
                travel_explore
              </span>
            </div>
            <h1 className="hidden sm:block text-xl font-bold tracking-tight text-text-main">
              JapanTripPlanner
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href={isHome ? "#destinations" : "/#destinations"}
              className="text-sm font-medium text-text-main/80 hover:text-primary transition-colors"
              scroll={!isHome}
            >
              {t("destinations")}
            </Link>
            <Link
              href={isHome ? "#itineraries" : "/#itineraries"}
              className="text-sm font-medium text-text-main/80 hover:text-primary transition-colors"
              scroll={!isHome}
            >
              {t("itineraries")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop: Show all controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center h-8 w-10 text-xs font-bold text-text-main bg-surface-alt hover:bg-border rounded-lg transition-colors border border-border"
              aria-label={
                language === "en" ? "Switch to Thai" : "Switch to English"
              }
            >
              {language === "en" ? "TH" : "EN"}
            </button>
          </div>

          <TripSwitcher />
          <LoginButton />
          <ProfileMenu />

          {/* Mobile: Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-surface-alt text-text-main hover:bg-border transition-colors"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 mr-4 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden md:hidden z-50">
            <div className="p-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors text-text-main w-full"
              >
                <span className="material-symbols-outlined text-[20px]">
                  language
                </span>
                <span className="text-sm font-medium">
                  {language === "en" ? "ภาษาไทย" : "English"}
                </span>
              </button>

              <div
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-text-main">
                  {language === "en" ? "dark_mode" : "light_mode"}
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
