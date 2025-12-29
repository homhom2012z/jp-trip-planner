export const FALLBACK_IMAGES: Record<string, string> = {
  Ramen:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQej5zdS12ZgbQ0gcfosZMC6U8bAS7SSFqHszhxGESTawHcopT8wayT8lJkJI7fsROyu_dABDVJfc4g867TMD2EBDFLntpAJHdWr_3CQVBRtMToGCBg0qDkIl7ynOSeM6mbL35PP8CiFg_SHE4Yz_6uy7Fz41PmqMozSLX6HZdenITOApCjuW6MD5rUCSjjDsgytsJXyiln16kWVgf4RrqFVa9uaBqtz0CQB3w_TRZs7vzHaxnybCyVTslhG0kmElAtLnKoVgFsUab",
  Sushi:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
  Sukiyaki:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCV23noVE_hyf3vtz6RMBVeaSIwSkxYQXnV4FxJykZ0RsUQfH9u4JSKbxhTzWvfVCrKrD5NDDBzwWWhXm0MgCJNlkPBcXMJDuaE0xAE8IonfWtly9HfQ6FPGGJwKO28P-1jByoniULCb08TiBfdHOcPYY_-3X7OpCy7MdWkoiz5utl1keYMjCfopUyRKX7a1Gakg3HmJmpRQGOny1hZeC4oveT11UwJxhII0Ycpj7yEvK9f4uXgLF8lNDhLP3ys_DsxsB9zp3rcXg7F",
  Soba: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrfxLWps5LYMloxVpIDm5nZ6cPbpj2HB10eCmHTteckLCAqe2c17Mmj0gcmJhWPsim8uWJy4ac6PheoGH39WHlUNoXLyM46cbCOnFNly7emPLFYERqbt8OrZyL3S43ADfljNDVWVE2ITD4t-wlyscBGtRu1BgaQMYTbALEyjRMDUsSKQ_rYQfKVvrw1YADBXzhbm2FOn3c1qeY6D5I-GjZ48oYMZN2PMOPrkXfujZ8MIm2Hp_t2Ws5sDcmaTKWhkIhszSyK9MSJYxk",
  Temple:
    "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?q=80&w=800&auto=format&fit=crop",
  Shrine:
    "https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?q=80&w=800&auto=format&fit=crop",
  Park: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?q=80&w=800&auto=format&fit=crop",
  Shopping:
    "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=800&auto=format&fit=crop",
  Cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  Izakaya:
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
  Udon: "https://images.unsplash.com/photo-1618841557871-b4664f70ad11?q=80&w=800&auto=format&fit=crop",
  Curry:
    "https://images.unsplash.com/photo-1626202158826-6216ddb77741?q=80&w=800&auto=format&fit=crop",
  Tonkatsu:
    "https://images.unsplash.com/photo-1615876523992-bf393d395a12?q=80&w=800&auto=format&fit=crop",
  StreetFood:
    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=800&auto=format&fit=crop",
  Tower:
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop", // Tokyo Tower style
  default:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4KLKRG9NBJ6xj2_HA-sbJyCNzaFAnN4WkEc37jXYYcK4Klws113IReBg7uTUN5hg7XYzTQ_C-PvsO46B-Gi1Qq-ongC9K1WBaopMTRgzYF0SmA-4sdhFEtbwsqpEjzfKHnQ3daFnWStnbnTiL7QklnmRjqTmrSB3u7KZxbtOiiBpHy62N4GXvEWWmjMYB7kOpwZUdmaVcVVRemSPrXMQKW3DYx1q0kImVU5d23hw1UMD1lyBc5RiEl4jx31zM7nqUJ4h6hxfv27x",
};

export const getFallbackImage = (type: string): string => {
  // Try exact match
  if (FALLBACK_IMAGES[type]) return FALLBACK_IMAGES[type];

  // Try partial match
  const lowerType = type.toLowerCase();
  if (lowerType.includes("ramen")) return FALLBACK_IMAGES.Ramen;
  if (lowerType.includes("sushi")) return FALLBACK_IMAGES.Sushi;
  if (lowerType.includes("soba") || lowerType.includes("udon"))
    return FALLBACK_IMAGES.Soba;
  if (lowerType.includes("sukiyaki") || lowerType.includes("shabu"))
    return FALLBACK_IMAGES.Sukiyaki;
  if (lowerType.includes("temple")) return FALLBACK_IMAGES.Temple;
  if (lowerType.includes("shrine")) return FALLBACK_IMAGES.Shrine;
  if (lowerType.includes("park") || lowerType.includes("garden"))
    return FALLBACK_IMAGES.Park;
  if (lowerType.includes("shopping") || lowerType.includes("mall"))
    return FALLBACK_IMAGES.Shopping;
  if (lowerType.includes("cafe") || lowerType.includes("coffee"))
    return FALLBACK_IMAGES.Cafe;
  if (lowerType.includes("izakaya") || lowerType.includes("bar"))
    return FALLBACK_IMAGES.Izakaya;
  if (lowerType.includes("udon")) return FALLBACK_IMAGES.Udon;
  if (lowerType.includes("curry") || lowerType.includes("rice"))
    return FALLBACK_IMAGES.Curry;
  if (
    lowerType.includes("tonkatsu") ||
    lowerType.includes("pork") ||
    lowerType.includes("katsu")
  )
    return FALLBACK_IMAGES.Tonkatsu;
  if (lowerType.includes("street") || lowerType.includes("market"))
    return FALLBACK_IMAGES.StreetFood;
  if (lowerType.includes("tower") || lowerType.includes("observation"))
    return FALLBACK_IMAGES.Tower;

  return FALLBACK_IMAGES.default;
};
