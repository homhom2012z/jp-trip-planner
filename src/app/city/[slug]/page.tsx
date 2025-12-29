import { getLocationsByCity } from "@/lib/data";
import CityPageClient from "@/components/CityPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1); // Simple capitalization

  // Fetch data
  const locations = await getLocationsByCity(cityName);

  if (!locations || locations.length === 0) {
    // If not found by exact slug matching city property in CSV, try loose match or 404
    // Our CSV has "Kyoto", "Tokyo" etc. so slug "kyoto" works if logic is case-insensitive.
    // data.ts getLocationsByCity is case-insensitive.
    if (locations.length === 0) {
      // For demo, if empty maybe strictly 404?
      // Or allow rendering empty state.
      // Let's 404 if truly invalid city in our logical set
      const validCities = ["tokyo", "osaka", "kyoto", "uji", "kamakura"];
      if (!validCities.includes(slug.toLowerCase())) {
        notFound();
      }
    }
  }

  return <CityPageClient cityName={cityName} locations={locations} />;
}

export async function generateStaticParams() {
  return [
    { slug: "tokyo" },
    { slug: "osaka" },
    { slug: "kyoto" },
    { slug: "uji" },
    { slug: "kamakura" },
  ];
}
