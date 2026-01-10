import Link from "next/link";

export default function TransportGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/guides"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Guides
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <article className="prose prose-lg mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-blue-600">
            <span className="material-symbols-outlined text-4xl">train</span>
            <span className="font-bold tracking-wider uppercase text-sm">
              Transport
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to Know About Japanese Trains
          </h1>

          <p className="lead text-xl text-gray-600 mb-8">
            Japan's train system is legendary for its efficiency, punctuality,
            and complexity. Here is how to navigate it like a pro.
          </p>

          <hr className="my-8 border-gray-100" />

          <h3>1. IC Cards (Suica, Pasmo, ICOCA)</h3>
          <p>
            The most essential tool for travel. These are rechargeable cards you
            tap at ticket gates. No need to buy individual tickets for every
            ride.
          </p>
          <ul>
            <li>
              <strong>Where to get:</strong> Ticket machines at stations.
            </li>
            <li>
              <strong>Mobile:</strong> Add "Suica" or "PASMO" to Apple Wallet
              (iPhone 8 or newer).
            </li>
            <li>
              <strong>Usage:</strong> Works on trains, buses, and even vending
              machines/convenience stores.
            </li>
          </ul>

          <h3>2. The Shinkansen (Bullet Train)</h3>
          <p>For long-distance travel (e.g., Tokyo to Kyoto).</p>
          <ul>
            <li>
              <strong>Reserved vs. Non-Reserved:</strong> Reserved guarantees a
              seat. Non-reserved is cheaper but risky during peak times.
            </li>
            <li>
              <strong>Luggage:</strong> Large luggage (over 160cm total
              dimensions) requires a special seat reservation.
            </li>
          </ul>

          <h3>3. Navigating Stations</h3>
          <p>
            Shinjuku Station is the busiest in the world. Always follow the
            yellow signs for exits and transfers. Google Maps is extremely
            accurate for platform numbers and exit names.
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose mt-8">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">lightbulb</span>
              Pro Tip
            </h4>
            <p className="text-blue-800 text-sm">
              Avoid rush hour (7:30 AM - 9:30 AM) in Tokyo if you have luggage.
              The trains are packed to 200% capacity!
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
