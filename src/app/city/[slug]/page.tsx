import { getLocationsByCity } from "@/lib/data";
import CityPageClient from "@/components/CityPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;

  // Decode URL (e.g. %E5%AE%87... -> 宇治市)
  const decodedSlug = decodeURIComponent(slug);

  // Capitalize first letter if it's english, or just use as is
  const cityName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  // Fetch data
  const locations = await getLocationsByCity(cityName);

  // If no locations found, we could show empty state or 404.
  // Given we want to support any city that might be added,
  // we should probably just render the page (CityPageClient handles empty states).
  // But if absolutely 0 locations exist for this city in our DB,
  // maybe 404 is appropriate if we want to avoid SEO spam?
  // However, for user-added content, better to show "No spots yet".
  // But the current implementation of getLocationsByCity might return empty.

  // For now, let's ONLY 404 if it's clearly garbage?
  // Actually, removing the hardcoded check means we accept anything.
  // If getLocationsByCity returns [], CityPageClient will just show 0 spots.

  return <CityPageClient cityName={cityName} locations={locations} />;
}

export async function generateStaticParams() {
  // We can't statically generate ALL possible user cities easily without fetching from DB.
  // We can generate the popular ones we know.
  // Others will be SSR/ISR on demand.
  return [
    { slug: "tokyo" },
    { slug: "osaka" },
    { slug: "kyoto" },
    { slug: "uji" },
    { slug: "kamakura" },
  ];
}
