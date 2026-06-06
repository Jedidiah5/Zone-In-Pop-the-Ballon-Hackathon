"use client";

import { MapPin } from "lucide-react";
import type { Platform } from "@/types";
import PlatformSelector from "./PlatformSelector";

type OnboardingScreenProps = {
  selectedPlatform: Platform | null;
  location: string;
  isLoading: boolean;
  error: string;
  onPlatformSelect: (platform: Platform) => void;
  onLocationChange: (location: string) => void;
  onSubmit: () => void;
};

export default function OnboardingScreen({
  selectedPlatform,
  location,
  isLoading,
  error,
  onPlatformSelect,
  onLocationChange,
  onSubmit,
}: OnboardingScreenProps) {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#0A0A0A] px-5 pb-8 pt-safe text-white sm:flex sm:items-center sm:justify-center sm:px-8">
      <div className="mx-auto flex w-full max-w-xl flex-col py-6 sm:min-h-0 sm:py-0">
        <div className="mb-10 text-2xl font-bold tracking-[-0.04em] sm:mb-16">
          ZoneIn<span className="text-[#F5A623]">.</span>
        </div>

        <form className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="mb-8">
            <h1 className="max-w-[360px] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl">
              Know before you go.
            </h1>
            <p className="mt-5 text-base font-medium leading-7 text-[#888888] sm:text-lg">
              Real-time zone intelligence for London drivers.
            </p>
          </div>

          <div className="mb-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#555555]">
              Your platform
            </p>
            <PlatformSelector
              onSelect={onPlatformSelect}
              selected={selectedPlatform}
            />
          </div>

          <div className="relative mb-5">
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#F5A623]"
              size={22}
              strokeWidth={2.5}
            />
            <input
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect="off"
              className="h-14 w-full touch-manipulation rounded-lg border border-[#222222] bg-[#141414] pl-12 pr-4 text-base font-bold text-white outline-none transition-colors placeholder:text-[#555555] focus:border-[#F5A623]"
              enterKeyHint="go"
              id="location"
              name="location"
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Your current area e.g. Shoreditch"
              type="text"
              value={location}
            />
          </div>

          {error && (
            <p
              className="mb-4 rounded-lg border border-[#FF3B30] bg-[#FF3B30]/10 px-4 py-3 text-sm font-bold text-[#FF3B30]"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-6 sm:mt-10">
            <button
              className="flex h-14 w-full touch-manipulation cursor-pointer select-none items-center justify-center rounded-lg bg-[#F5A623] text-base font-bold uppercase tracking-[0.08em] text-[#0A0A0A] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "FINDING ZONES..." : "FIND MY ZONE →"}
            </button>
            <p className="pointer-events-none mt-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Live demand updated every 2 minutes
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
