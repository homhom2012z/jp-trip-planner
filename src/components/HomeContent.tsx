"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Images from design reference
const IMAGES = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAOn5zQZkbr9jFE1ItTqjzLQMBCvF2_BATH3ojSDg353_luSAcj2X8resm_yA-WblarYe8T4Ft-KFGCATQtDgOgD8phawmZgTs_ATIcGwzbd7smSrZ8ZPYx8iSsaSve5_qLMuIrR8rBuadGQzhpc1C8SrjyV14mtEPpdI4MJCPaETgYE9evIf6WHFElGYR9EkX_UdB_3-HU380OAKWw68eU7eXHgszR1EL-bBiKc4bZ7z6XN9d7snNFkFT6kWLghkAAy5o4mt1mgFl",
  tokyo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCG0Ur07S_wNb0rrQuziWonHcGFoEaH7I171OMuQqvzi0z1LUVvCv2_DEiR_C2OZV4uOCjV-vZj6h0F0To4KDF10APsDYosTrJh34zRrTNkNqEK0UEELi-kfNVgHO-PTXJD_qy7qjQwzrRr95kPk7kgVit9Z9CQCyIxksdDqsy8Vg6XyxE5NcOL_iOm6lOIqN_H3SfHjGPYT32uf00jIk3xGKwiHHAUhg5aNGw53FimqFjFfr6z3IZwkl_7ZmZXEok_zs5FWE7hD-S2",
  osaka:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBnW5ZIJSwXq2Afsr4_m6IxmuKwFvjGBCX2ji2uDFBPVe-ulDQKIeUu7skkAl8oBd_wRVcoooEylhAI4-Qi3e6B6vvmE6LqKy9yJr2SGs9jCEfIIzgUXh_aOkQilUITNcOIdTxi04P9dna9dYn97eSdZKZRc5Ova28dgbj9IGh19S-6QBvkUr6xJ99Cf_EoWx7Vl8heZzBZyXDmzHtOfas3adVvn4RxzBq0zZ5tXTtJNjS1emb73ZabwNyTwJT-NqvPv7sTjl0FItaS",
  kyoto:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCxNu_bag_pYbVFkbEdkaxhqnSqT0e0NI53GnBq6Z1vzMqOB_5aDCQctVAZlj2tTMCe926JWTHfA2ziSOJKwAO80EMULlmBJSOnmZiWo7G5GZ29nP7AqKUCmtjjicx8e468HxLwGAZxHrauMMgJ_dXJUUtv1Uabyy5LIJvguYbzx_E9zztCB0wpbPW-srhRPu2z7rtxCGo60XQJa90rLO64RbDhIRhu2yGfah1rGZmWQvtxYF8V8Bd9chx1tSoLA8lzteuL8cbpmD0s",
  uji: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfYyjuNLkEjgl8da8zp3V-ABaCROji7seJWFeV0p_LEywDzDboh1vCKZRWasj_dYWtEoINhjA7FSSeLNDHyAo9rbCYSZEIwInZ2bf1n8ADVofRWTpcVFGIxQFZjsvZU50mU0jj7FtyyjW-NgK2tg-YbrRun238aNbRnibgdeuZH1ydJ8HJ73Gsgfhr8nfesYIVky0CDYKoJyd66cPylr0G5cGgFdSbGgGgtOq1VY_jdTsYR4VY1O5cb57W_wGzux6bY6h7jmt-T3j1",
  kamakura:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA3KUgUOPDiw1b7Dbx96lo8T6PddwgcbXu6GYGIKkEr9M7exmU0AtNhltsrq_LMMzuePRW3XHoPVZgaKM911i1P9bL6jafY7ubAg3mfKmvDCYfbse-zbe8GliAYBRgyO7NNFuYZ3PLE8jqU8m888C2Bl6UcHcO_GlyKwxsL8TXeQuRTRZgbiNSunNGXJug8kYmNEUlqpL8Jvdi3TCDEQAHdL-YAnXTFRgOYTRUAbfsz8yFHzJF9ty9qq89SC4eH3RNokDnS5xiAUo16",
  itin1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAePvEtFKZW-2LPnzZqQJgDNcdGB4pQhhTlGdLZJfI0TnKTPOFyVPglDw2IIbLzQ89AVvhxQR6D4XaCcBEpZ_aLIupwf_4IgVXRfegoi0zoKU-dRMjDcraH4WypYbDf43MynHTpPqqU16DXSTaWxnCNWD6MLoXN96PvTNbVJGOOz1SsXt7LY0aktbUfsNrJTloEUAvrrvV-CddEIYH35WuyonIyUaPIGJNuiPR22UBh25BjxkJHaLe64yDUPErAiok2Ht2afSTtRPi8",
  itin2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5JPSkcPzC3eVNYZ5ic3vxsuzv3yrE4jD4SjpIW-HCT9KdSs2vxJqZXnwCiDopzxlU7fUhvhYphqkvrbcDncpUJqfvIY1lFBeWoK-DIG8fre9oWiuqrrV8oNqd7j6ZDSFG-ko7uC6np_uGkf-WRYz9QhnDxxITlLBrfckiIvtK6wvKXp_uBStEMPXlUTfC8oX-P19t_dwaN6SBaHPMHynd1buXb9wGDj2QAfTvgJIGTJpRoGrlqDl8ivXZ5MkVjKfuJs954c5IvZ2N",
};

export default function HomeContent() {
  return (
    <div className="flex flex-col w-full font-display">
      {/* Hero Section */}
      <section className="relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#fcf8f9] z-10"></div>
          <img
            src={IMAGES.hero}
            alt="Mount Fuji with cherry blossoms"
            className="h-full w-full object-cover"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-6"
        >
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl drop-shadow-lg">
            Discover the Soul of Japan
          </h1>
          <p className="max-w-2xl text-lg font-medium text-white/90 sm:text-xl drop-shadow-md">
            Plan your perfect journey through ancient temples, neon cities, and
            serene landscapes.
          </p>

          {/* Search Component */}
          <div className="mt-4 flex w-full max-w-lg flex-col sm:flex-row shadow-xl rounded-xl overflow-hidden">
            <div className="relative flex w-full flex-1 items-center bg-white">
              <span className="material-symbols-outlined absolute left-4 text-primary">
                search
              </span>
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="h-14 w-full border-none bg-transparent pl-12 pr-4 text-[#1b0d12] placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:ring-inset"
              />
            </div>
            <button className="h-14 w-full sm:w-auto bg-primary px-8 text-base font-bold text-white hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
        </motion.div>
      </section>

      {/* Filters / Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#1b0d12]">
            Explore by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="group flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/25 ring-2 ring-primary ring-offset-2 ring-offset-[#fcf8f9] transition-all">
              <span className="material-symbols-outlined text-[18px]">
                travel_explore
              </span>
              All Locations
            </button>
            <button className="group flex h-10 items-center gap-2 rounded-full bg-[#f3e7eb] px-5 text-sm font-medium text-[#1b0d12] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200">
              <span className="material-symbols-outlined text-[18px]">
                location_city
              </span>
              Major Cities
            </button>
            <button className="group flex h-10 items-center gap-2 rounded-full bg-[#f3e7eb] px-5 text-sm font-medium text-[#1b0d12] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200">
              <span className="material-symbols-outlined text-[18px]">
                landscape
              </span>
              Day Trips
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: The Metropolises */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1b0d12]">
              The Metropolises
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Dive into the electric energy of Japan's biggest hubs.
            </p>
          </div>
          <a
            href="#"
            className="hidden text-sm font-bold text-primary hover:underline sm:block"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Tokyo */}
          <Link
            href="/city/tokyo"
            className="group relative flex h-[320px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-xl bg-gray-200 shadow-sm transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 h-full w-full">
              <img
                src={IMAGES.tokyo}
                alt="Tokyo"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 p-6">
              <div className="mb-2 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Urban
                </span>
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Shopping
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">Tokyo</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-medium text-white/90">
                  A neon-lit fusion of future and tradition.
                </p>
                <button className="flex size-10 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </Link>

          {/* Osaka */}
          <Link
            href="/city/osaka"
            className="group relative flex h-[320px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-xl bg-gray-200 shadow-sm transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 h-full w-full">
              <img
                src={IMAGES.osaka}
                alt="Osaka"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 p-6">
              <div className="mb-2 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Food
                </span>
                <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Nightlife
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">Osaka</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-medium text-white/90">
                  Japan's kitchen and comedy capital.
                </p>
                <button className="flex size-10 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 2: Day Trips */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-white rounded-3xl my-8">
        <div className="mb-8 text-center">
          <span className="text-primary font-bold tracking-wider uppercase text-sm">
            Escape the Rush
          </span>
          <h2 className="mt-2 text-3xl font-bold text-[#1b0d12]">
            Day Trips & Retreats
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Discover serenity just a short train ride away from the major hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Kyoto */}
          <Link
            href="/city/kyoto"
            className="group flex flex-col overflow-hidden rounded-xl bg-[#fcf8f9] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={IMAGES.kyoto}
                alt="Kyoto"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1b0d12] backdrop-blur-sm">
                2.5h from Tokyo
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                <span className="material-symbols-outlined text-[16px]">
                  temple_buddhist
                </span>
                <span>Historical</span>
              </div>
              <h3 className="text-xl font-bold text-[#1b0d12]">Kyoto</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                The cultural heart of Japan, famous for its classical Buddhist
                temples, gardens, and imperial palaces.
              </p>
              <div className="mt-auto pt-4">
                <button className="w-full rounded-lg bg-[#f3e7eb] py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                  Plan Trip
                </button>
              </div>
            </div>
          </Link>

          {/* Uji */}
          <Link
            href="/city/uji"
            className="group flex flex-col overflow-hidden rounded-xl bg-[#fcf8f9] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={IMAGES.uji}
                alt="Uji"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1b0d12] backdrop-blur-sm">
                20m from Kyoto
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                <span className="material-symbols-outlined text-[16px]">
                  local_cafe
                </span>
                <span>Matcha & Culture</span>
              </div>
              <h3 className="text-xl font-bold text-[#1b0d12]">Uji</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                A serene riverside city renowned for having the best green tea
                in the world.
              </p>
              <div className="mt-auto pt-4">
                <button className="w-full rounded-lg bg-[#f3e7eb] py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                  Plan Trip
                </button>
              </div>
            </div>
          </Link>

          {/* Kamakura */}
          <Link
            href="/city/kamakura"
            className="group flex flex-col overflow-hidden rounded-xl bg-[#fcf8f9] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={IMAGES.kamakura}
                alt="Kamakura"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1b0d12] backdrop-blur-sm">
                1h from Tokyo
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                <span className="material-symbols-outlined text-[16px]">
                  waves
                </span>
                <span>Coastal & Shrines</span>
              </div>
              <h3 className="text-xl font-bold text-[#1b0d12]">Kamakura</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                A coastal town often called the Kyoto of Eastern Japan.
              </p>
              <div className="mt-auto pt-4">
                <button className="w-full rounded-lg bg-[#f3e7eb] py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                  Plan Trip
                </button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 3: Curated Itineraries */}
      <section className="mx-auto mb-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-[#1b0d12]">
          Curated Itineraries
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative flex min-h-[240px] items-center overflow-hidden rounded-xl bg-gray-900 shadow-md group cursor-pointer">
            <img
              src={IMAGES.itin1}
              alt="7 Days in Tokyo"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
            />
            <div className="relative z-10 p-8">
              <span className="mb-3 inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Most Popular
              </span>
              <h3 className="text-3xl font-bold text-white">7 Days in Tokyo</h3>
              <p className="mt-2 max-w-md text-gray-200">
                The ultimate guide for first-timers covering Shibuya, Shinjuku,
                Asakusa.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white">
                <span>View Itinerary</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[240px] items-center overflow-hidden rounded-xl bg-gray-900 shadow-md group cursor-pointer">
            <img
              src={IMAGES.itin2}
              alt="Golden Route"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
            />
            <div className="relative z-10 p-8">
              <span className="mb-3 inline-block rounded-md bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md">
                Golden Route
              </span>
              <h3 className="text-3xl font-bold text-white">
                The Old Capital Route
              </h3>
              <p className="mt-2 max-w-md text-gray-200">
                A journey through history visiting Kyoto, Nara, and Osaka.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white">
                <span>View Itinerary</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
