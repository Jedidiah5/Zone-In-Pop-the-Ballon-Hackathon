"use client";

import { LocateFixed, MapPin } from "lucide-react";
import type { Platform } from "@/types";
import PlatformSelector from "./PlatformSelector";

type OnboardingScreenProps = {
  selectedPlatform: Platform | null;
  location: string;
  isLoading: boolean;
  isLocating: boolean;
  error: string;
  onPlatformSelect: (platform: Platform) => void;
  onLocationChange: (location: string) => void;
  onUseCurrentLocation: () => void;
  onSubmit: () => void;
};

export default function OnboardingScreen({
  selectedPlatform,
  location,
  isLoading,
  isLocating,
  error,
  onPlatformSelect,
  onLocationChange,
  onUseCurrentLocation,
  onSubmit,
}: OnboardingScreenProps) {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-white px-5 pb-8 pt-safe text-black">
      <div className="mx-auto flex w-full max-w-xl flex-col py-6">
        <div className="mb-10 text-2xl font-bold tracking-[-0.04em]">
          ZoneIn<span className="text-black font-bold">.</span>
        </div>

        <form className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="mb-8">
            <h1 className="max-w-[360px] text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-black">
              Know before you go.
            </h1>
            <p className="mt-5 text-base font-medium leading-7 text-[#666666]">
              Real-time zone intelligence for London drivers.
            </p>
          </div>

          <div className="mb-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#999999]">
              Your platform
            </p>
            <PlatformSelector
              onSelect={onPlatformSelect}
              selected={selectedPlatform}
            />
          </div>

          <div className="mb-3">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#999999]">
              Your location
            </p>
            <div className="relative">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-black"
                size={22}
                strokeWidth={2.5}
              />
              <input
                autoCapitalize="words"
                autoComplete="off"
                autoCorrect="off"
                className="h-14 w-full touch-manipulation rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] pl-12 pr-4 text-base font-bold text-black outline-none transition-colors placeholder:text-[#999999] focus:border-black"
                enterKeyHint="go"
                id="location"
                name="location"
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="e.g. Shoreditch"
                type="text"
                value={location}
              />
            </div>
          </div>

          <button
            className="mb-5 flex h-12 w-full touch-manipulation cursor-pointer select-none items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] text-sm font-bold uppercase tracking-[0.08em] text-black active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading || isLocating}
            onClick={onUseCurrentLocation}
            type="button"
          >
            <LocateFixed
              aria-hidden="true"
              className={isLocating ? "animate-pulse text-black" : "text-black"}
              size={18}
              strokeWidth={2.5}
            />
            {isLocating ? "LOCATING..." : "USE MY CURRENT LOCATION"}
          </button>

          {error && (
            <p
              className="mb-4 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3 text-sm font-bold text-black"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-2">
            <button
              className="flex h-14 w-full touch-manipulation cursor-pointer select-none items-center justify-center rounded-lg bg-black text-base font-bold uppercase tracking-[0.08em] text-white active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading || isLocating}
              type="submit"
            >
              {isLoading ? "FINDING ZONES..." : "FIND MY ZONE →"}
            </button>
            <p className="pointer-events-none mt-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
              Live demand updated every 2 minutes
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
