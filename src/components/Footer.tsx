import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#f3e7eb] bg-white text-[#1b0d12]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">
                travel_explore
              </span>
              <span className="text-lg font-bold">JapanTripPlanner</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your trusted companion for exploring the Land of the Rising Sun.
              We make travel simple, authentic, and unforgettable.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  Itineraries
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  Travel Guides
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-gray-500 hover:text-primary"
                  href="#"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-500 mb-3">
              Get travel tips and exclusive deals.
            </p>
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary bg-gray-50"
                placeholder="Enter your email"
                type="email"
              />
              <button className="rounded-md bg-primary px-3 py-2 text-white hover:bg-primary/90">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2023 JapanTripPlanner. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a className="text-gray-400 hover:text-primary text-xs" href="#">
              Privacy Policy
            </a>
            <a className="text-gray-400 hover:text-primary text-xs" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
