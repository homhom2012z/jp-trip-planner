import Link from "next/link";

export default function EtiquetteGuidePage() {
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
          <div className="flex items-center gap-3 mb-6 text-green-600">
            <span className="material-symbols-outlined text-4xl">
              temple_buddhist
            </span>
            <span className="font-bold tracking-wider uppercase text-sm">
              Culture
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Basic Etiquette for Travelers
          </h1>

          <p className="lead text-xl text-gray-600 mb-8">
            Respect is at the core of Japanese culture. A few small gestures go
            a long way in making a good impression.
          </p>

          <hr className="my-8 border-gray-100" />

          <h3>Do's</h3>
          <ul>
            <li>
              <strong>Bow:</strong> A slight nod/bow when greeting or thanking
              someone is polite.
            </li>
            <li>
              <strong>Line Up:</strong> Always queue in orderly lines for
              trains, elevators, and restaurants.
            </li>
            <li>
              <strong>Quiet on Trains:</strong> Avoid phone calls and loud
              conversations.
            </li>
            <li>
              <strong>Remove Shoes:</strong> Especially when entering homes,
              ryokans, or fitting rooms.
            </li>
          </ul>

          <h3>Don&apos;ts</h3>
          <ul>
            <li>
              <strong>No Tipping:</strong> Excellent service is standard.
              Tipping can be confusing or even offensive.
            </li>
            <li>
              <strong>Don&apos;t Eat While Walking:</strong> It is considered
              rude. Eat at the spot you bought it or find a bench (park).
            </li>
            <li>
              <strong>Chopstick Taboos:</strong>
              <ul>
                <li>Don&apos;t pass food chopstick-to-chopstick.</li>
                <li>
                  Don&apos;t stick chopsticks vertically into rice (resembles
                  funeral rites).
                </li>
              </ul>
            </li>
          </ul>

          <div className="bg-green-50 p-6 rounded-xl border border-green-100 not-prose mt-8">
            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">recycling</span>
              Trash Bins
            </h4>
            <p className="text-green-800 text-sm">
              Public trash bins are rare. Be prepared to carry your trash with
              you until you find a bin (usually at convenience stores or
              stations).
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
