"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppShell from "@/components/AppShell";
import MarketStats from "@/components/MarketStats";
import ZoneCard from "@/components/ZoneCard";
import type { Zone } from "@/types";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("zonein_results");
    if (stored) {
      try {
        setZones(JSON.parse(stored) as Zone[]);
      } catch {
        setZones([]);
      }
    }
  }, []);

  const avgSurge =
    zones.length > 0
      ? zones.reduce((sum, z) => sum + z.surgeMultiplier, 0) / zones.length
      : 0;
  const activeJobs =
    zones.length > 0
      ? zones.reduce((sum, z) => sum + z.activeJobs, 0)
      : 0;

  return (
    <AppShell>
      <AppHeader title="Top Earning Zones" />
      <main className="flex-1 bg-primary-container px-container-padding pb-24 pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 lg:mb-10">
            <p className="mb-1 font-label-caps text-label-caps text-on-primary/60">
              CURRENT RANKING
            </p>
            <h2 className="font-headline-md text-headline-md leading-tight text-on-primary lg:text-[32px] lg:leading-tight">
              Top Earning Zones
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-secondary-container animate-pulse" />
              <span className="font-status-sm text-status-sm text-on-primary">
                Live Market Update
              </span>
            </div>
          </div>

          {zones.length === 0 ? (
            <div className="border border-white/10 bg-white/5 p-8 text-center">
              <p className="font-body-md text-on-primary/70">
                No zone results yet. Go back and search for zones first.
              </p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="flex flex-col gap-stack-gap lg:col-span-2 xl:grid xl:grid-cols-2 xl:gap-4">
                {zones.map((zone) => (
                  <ZoneCard key={zone.name} zone={zone} />
                ))}
              </div>

              <aside className="mt-8 border-t border-white/10 pt-8 lg:col-span-1 lg:mt-0 lg:border-t-0 lg:pt-0">
                <div className="lg:sticky lg:top-24">
                  <p className="mb-4 font-label-caps text-label-caps text-on-primary/60">
                    MARKET OVERVIEW
                  </p>
                  <MarketStats
                    activeJobs={Math.round(activeJobs)}
                    avgSurge={Math.round(avgSurge * 10) / 10}
                  />

                  <div className="mt-4 hidden rounded-lg border border-white/10 bg-white/5 p-5 lg:block">
                    <p className="mb-2 font-label-caps text-label-caps text-on-primary/60">
                      TIP
                    </p>
                    <p className="font-body-md text-sm leading-relaxed text-on-primary/70">
                      Zones ranked by earning potential based on current demand,
                      surge pricing, and driver supply in your area.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
