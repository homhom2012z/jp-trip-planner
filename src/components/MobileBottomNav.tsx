import { useLanguage } from "@/context/LanguageContext";

interface MobileBottomNavProps {
  activeTab: "explore" | "planner";
  setActiveTab: (tab: "explore" | "planner") => void;
  showMobileMap: boolean;
  setShowMobileMap: (show: boolean) => void;
  activeFilter: string;
  setActiveFilter: (filter: any) => void;
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  showMobileMap,
  setShowMobileMap,
  activeFilter,
  setActiveFilter,
}: MobileBottomNavProps) {
  const { t } = useLanguage();

  // Determine current active section
  const getCurrentSection = () => {
    if (showMobileMap) return "map";
    if (activeTab === "planner") return "plan";
    if (activeFilter === "saved") return "saved";
    return "explore";
  };

  const navItems = [
    {
      id: "explore",
      label: t("explore"),
      icon: "search",
      onClick: () => {
        setShowMobileMap(false);
        setActiveTab("explore");
        if (activeFilter === "saved") setActiveFilter("all");
      },
    },
    {
      id: "map",
      label: t("viewMap"),
      icon: "map",
      onClick: () => {
        setShowMobileMap(true);
      },
    },
    {
      id: "saved",
      label: t("saved"),
      icon: "bookmark",
      onClick: () => {
        setShowMobileMap(false);
        setActiveTab("explore");
        setActiveFilter("saved");
      },
    },
    {
      id: "plan",
      label: t("planner"),
      icon: "calendar_month",
      onClick: () => {
        setShowMobileMap(false);
        setActiveTab("planner");
      },
    },
  ];

  const currentSection = getCurrentSection();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-[100] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = currentSection === item.id;
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? "text-primary -translate-y-1" : "text-gray-400"
            }`}
          >
            <div
              className={`p-1.5 rounded-full transition-colors ${
                isActive ? "bg-primary/10" : "bg-transparent"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? "fill-1" : ""
                }`}
              >
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-wide">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
