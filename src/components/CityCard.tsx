import Link from "next/link";

interface CityCardProps {
  slug: string;
  name: string;
  description: string;
  locationCount: number;
}

export default function CityCard({
  slug,
  name,
  description,
  locationCount,
}: CityCardProps) {
  return (
    <Link
      href={`/city/${slug}`}
      className="group flex flex-col bg-surface-light rounded-xl overflow-hidden border border-[#f3e7eb] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {/* Gradient Placeholder matching design vibe until image load */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 transition-transform duration-700 group-hover:scale-110`}
        />

        {/* Simulated Image Content (Generic) */}
        <div className="absolute inset-0 flex items-center justify-center text-primary/20">
          <span className="material-symbols-outlined text-[64px]">
            landscape
          </span>
        </div>

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-primary hover:scale-110 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[20px] block">
            favorite
          </span>
        </button>

        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
          City Guide
        </div>
      </div>

      <div className="flex flex-col p-4 gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-text-main leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-[#fff8e1] px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold">
            <span className="material-symbols-outlined text-[14px] fill-1">
              star
            </span>
            4.9
          </div>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2">
          {description}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs font-medium text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              location_on
            </span>
            {locationCount} Spots
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            Best for 2-3 Days
          </span>
        </div>
      </div>
    </Link>
  );
}
