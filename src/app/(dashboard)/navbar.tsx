"use client";

import Link from "next/link";
import { MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { UserButton } from "@/features/auth/components/user-button"
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";

export const Navbar = () => {
  const [location, setLocation] = useState<string>("123 Creator Lane, Web City");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if geolocation is available
    if ("geolocation" in navigator) {
      setIsLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Use reverse geocoding API to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Giftora-App'
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              const address = data.address;

              // Format the address nicely
              const formattedLocation = [
                address.road || address.suburb || address.neighbourhood,
                address.city || address.town || address.village || address.county,
                address.state,
              ]
                .filter(Boolean)
                .join(", ");

              setLocation(formattedLocation || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          // Keep default location on error
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  return (
    <nav className="w-full flex items-center px-6 h-[68px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50">
      {/* Location/Address Section */}
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer group">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MapPin className="size-4" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 dark:opacity-40">Current Location</span>
          <span className="text-xs font-semibold">{location}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Admin Login Link */}
        <Link href="/admin/login">
          <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 font-semibold rounded-xl transition-all">
            <ShieldCheck className="size-5" />
            Admin Portal
          </Button>
        </Link>

        <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-2" />

        <div className="flex items-center gap-2 mr-2">
          <LanguageSelector />
        </div>

        <UserButton />
      </div>
    </nav>
  );
};
