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
  return (
    <main className="flex min-h-screen flex-col bg-[#0A0A0A] px-5 pb-6 pt-6 text-white sm:items-center sm:justify-center sm:px-8">
      <div className="flex min-h-[calc(100vh-48px)] w-full max-w-xl flex-col sm:min-h-0">
        <div className="mb-16 text-2xl font-bold tracking-[-0.04em]">
          ZoneIn<span className="text-[#F5A623]">.</span>
        </div>

        <section className="flex flex-1 flex-col">
          <div className="mb-8">
            <h1 className="max-w-[360px] text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-white">
              Know before you go.
            </h1>
            <p className="mt-5 text-lg font-medium leading-7 text-[#888888]">
              Real-time zone intelligence for London drivers.
            </p>
          </div>

          <div className="mb-5">
            <PlatformSelector
              onSelect={onPlatformSelect}
              selected={selectedPlatform}
            />
          </div>

          <div className="relative mb-5">
            <MapPin
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5A623]"
              size={22}
              strokeWidth={2.5}
            />
            <input
              className="h-14 w-full rounded-lg border border-[#222222] bg-[#141414] pl-12 pr-4 text-base font-bold text-white outline-none transition-colors placeholder:text-white focus:border-[#F5A623]"
              id="location"
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Your current area e.g. Shoreditch"
              type="text"
              value={location}
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-[#FF3B30] bg-[#FF3B30]/10 px-4 py-3 text-sm font-bold text-[#FF3B30]">
              {error}
            </p>
          )}

          <div className="mt-auto">
            <button
              className="flex h-14 w-full items-center justify-center rounded-lg bg-[#F5A623] text-base font-bold uppercase tracking-[0.08em] text-[#0A0A0A] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
              onClick={onSubmit}
              type="button"
            >
              {isLoading ? "FINDING ZONES..." : "FIND MY ZONE →"}
            </button>
            <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Live demand updated every 2 minutes
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
