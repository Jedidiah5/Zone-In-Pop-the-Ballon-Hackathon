"use client";

import type { Platform } from "@/types";
import AppHeader from "./AppHeader";
import MaterialIcon from "./MaterialIcon";
import PlatformSelector from "./PlatformSelector";
import ZoneInLogo from "./ZoneInLogo";

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <section className="relative hidden overflow-hidden bg-primary lg:flex lg:w-[45%] lg:flex-col lg:justify-between xl:w-1/2">
        <div className="absolute inset-0 opacity-10">
          <div className="grid h-full w-full grid-cols-6 gap-4 p-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-on-primary/20" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center p-12 xl:p-16">
          <div className="mb-6 flex items-center gap-3">
            <ZoneInLogo className="h-10 w-10 rounded-full" size={40} />
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-primary/60">
              ZoneIn
            </span>
            <span className="h-2 w-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="font-label-caps text-[10px] uppercase text-on-primary/60">
              Live
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg leading-tight text-on-primary">
            Where should you drive right now?
          </h1>
          <p className="mt-4 max-w-md font-body-lg text-on-primary/70">
            ZoneIn analyses London demand in real time so you can earn more with
            every shift.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Real-time zone rankings across Uber, Bolt, Deliveroo & Stuart",
              "AI-powered demand insights for every neighbourhood",
              "Live surge and active job counts updated every 2 minutes",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <MaterialIcon
                  className="mt-0.5 text-secondary-container"
                  icon="check_circle"
                />
                <p className="font-body-md text-on-primary/80">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-on-primary/10 px-12 py-6 xl:px-16">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary-container" />
            <span className="font-label-caps text-[10px] uppercase text-on-primary/60">
              High Demand in SE1
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MaterialIcon
              className="text-[14px] text-on-primary/60"
              icon="update"
            />
            <span className="font-label-caps text-[10px] uppercase text-on-primary/60">
              Updated 2m ago
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-1 flex-col">
        <AppHeader variant="onboarding" />
        <main className="flex flex-grow items-center justify-center p-gutter lg:p-8 xl:p-12">
          <div className="w-full max-w-lg overflow-hidden border border-outline-variant bg-surface transition-all duration-300 lg:shadow-sm">
            <div className="space-y-section-gap p-container-padding lg:space-y-8 lg:p-8">
              <div className="space-y-unit lg:hidden">
                <h1 className="font-display-lg text-[32px] leading-tight text-primary">
                  Where should you drive right now?
                </h1>
                <p className="font-body-lg text-on-surface-variant">
                  ZoneIn analyses London demand in real time.
                </p>
              </div>

              <div className="hidden space-y-unit lg:block">
                <h2 className="font-headline-md text-headline-md text-primary">
                  Set up your session
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  Choose your platform and current location to find the best
                  zones nearby.
                </p>
              </div>

              <PlatformSelector
                onSelect={onPlatformSelect}
                selected={selectedPlatform}
              />

              <div className="space-y-stack-gap">
                <label
                  className="font-label-caps text-label-caps uppercase text-on-surface-variant"
                  htmlFor="location"
                >
                  Current Location
                </label>
                <div className="relative">
                  <MaterialIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    icon="near_me"
                  />
                  <input
                    className="h-[56px] w-full border border-outline-variant bg-surface-container-lowest pl-10 pr-4 font-body-md outline-none transition-all focus:border-primary focus:ring-0 lg:h-12"
                    id="location"
                    onChange={(e) => onLocationChange(e.target.value)}
                    placeholder="e.g. Shoreditch High St"
                    type="text"
                    value={location}
                  />
                </div>
              </div>

              <div className="pt-unit">
                <button
                  className="flex h-[56px] w-full items-center justify-center gap-2 bg-primary font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-all hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 lg:h-12"
                  disabled={isLoading}
                  onClick={onSubmit}
                  type="button"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                      Finding zones...
                    </>
                  ) : (
                    <>
                      Find My Zone
                      <MaterialIcon icon="arrow_forward" />
                    </>
                  )}
                </button>
                {error && (
                  <p className="mt-2 text-center text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-container-padding py-4 lg:hidden">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-container" />
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  High Demand in SE1
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MaterialIcon className="text-[14px]" icon="update" />
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  Updated 2m ago
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
