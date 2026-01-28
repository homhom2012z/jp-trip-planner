"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LoginButton from "./LoginButton";
import ProfileMenu from "./ProfileMenu";
import TripSwitcher from "./TripSwitcher";
import { ThemeToggle } from "./ThemeToggle";
// Material Symbols are loaded in layout.tsx

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <TripSwitcher />
          <LoginButton />
          <ProfileMenu />

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
      </div>
    </header>
  );
}
