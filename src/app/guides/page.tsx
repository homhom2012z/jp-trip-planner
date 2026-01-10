import Link from "next/link";

export default function GuidesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-[#1b0d12] mb-4">Travel Guides</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Expertly curated guides to help you navigate Japan like a local.
        Currently under construction.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Guide 1: Transport */}
        <Link
          href="/guides/transport-101"
          className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="h-48 bg-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/80">
                train
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Transport 101
            </h3>
            <p className="text-gray-600 line-clamp-2">
              Master the trains, subways, and Shinkansen. Suica vs. Pasmo
              explanation included.
            </p>
          </div>
        </Link>

        {/* Guide 2: Konbini */}
        <Link
          href="/guides/convenience-stores"
          className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="h-48 bg-orange-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-90 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/80">
                storefront
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              Konbini Survival
            </h3>
            <p className="text-gray-600 line-clamp-2">
              What to eat at 7-Eleven, Lawson, and FamilyMart. The best onigiri
              and fried chicken.
            </p>
          </div>
        </Link>

        {/* Guide 3: Etiquette */}
        <Link
          href="/guides/etiquette"
          className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="h-48 bg-green-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-700 opacity-90 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-white/80">
                temple_buddhist
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              Basic Etiquette
            </h3>
            <p className="text-gray-600 line-clamp-2">
              Dos and Don&apos;ts in Japan. Chopsticks, bowing, and train
              manners.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
