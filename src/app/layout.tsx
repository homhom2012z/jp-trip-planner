import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import OfflineIndicator from "@/components/OfflineIndicator";
import { SavedPlacesProvider } from "@/context/SavedPlacesContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "JapanTripPlanner - Your Planner",
  description:
    "Your personalized guide to the best eats, sights, and hidden gems.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#e91e63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
          <UserProvider>
            <SavedPlacesProvider>
              <div className="hidden md:block">
                <Header />
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                {children}
              </div>
              <OfflineIndicator />
              <Toaster position="bottom-right" reverseOrder={false} />
            </SavedPlacesProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
