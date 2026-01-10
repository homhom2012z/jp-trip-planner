import Link from "next/link";

export default function KonbiniGuidePage() {
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
          <div className="flex items-center gap-3 mb-6 text-orange-600">
            <span className="material-symbols-outlined text-4xl">
              storefront
            </span>
            <span className="font-bold tracking-wider uppercase text-sm">
              Food & Dining
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            The Art of the Konbini (Convenience Store)
          </h1>

          <p className="lead text-xl text-gray-600 mb-8">
            Japanese convenience stores are a cultural phenomenon. They are
            nothing like the gas stations back home.
          </p>

          <hr className="my-8 border-gray-100" />

          <h3>The Big Three</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <span className="font-bold block text-green-700 text-xl mb-1">
                7-Eleven
              </span>
              <span className="text-sm text-gray-600">Best ATM & Food</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <span className="font-bold block text-blue-700 text-xl mb-1">
                Lawson
              </span>
              <span className="text-sm text-gray-600">Best Fried Chicken</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border">
              <span className="font-bold block text-green-500 text-xl mb-1">
                FamilyMart
              </span>
              <span className="text-sm text-gray-600">Best Hot Snacks</span>
            </div>
          </div>

          <h3>Must-Try Items</h3>
          <ul>
            <li>
              <strong>Onigiri (Rice Balls):</strong> Tunas mayo and Salmon are
              classics. Peel the wrapper carefully (follow numbers 1, 2, 3).
            </li>
            <li>
              <strong>Fried Chicken:</strong> Famichiki (FamilyMart) and
              Karaage-kun (Lawson).
            </li>
            <li>
              <strong>Egg Salad Sandwich:</strong> A cult favorite at 7-Eleven.
            </li>
            <li>
              <strong>Bento Boxes:</strong> High quality meals heated up for you
              by the staff.
            </li>
          </ul>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 not-prose mt-8">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">local_atm</span>
              Cash is King
            </h4>
            <p className="text-orange-800 text-sm">
              7-Eleven ATMs are the most reliable place to withdraw cash with a
              foreign card. They are open 24/7.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
