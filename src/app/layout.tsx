import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SavedPlacesProvider } from "@/context/SavedPlacesContext";
import { LanguageProvider } from "@/context/LanguageContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "JapanTripPlanner - Your Planner",
  description:
    "Your personalized guide to the best eats, sights, and hidden gems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased h-full flex flex-col bg-background-light text-text-main custom-scrollbar overflow-hidden">
        <LanguageProvider>
          <SavedPlacesProvider>
            <Header />
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </SavedPlacesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
