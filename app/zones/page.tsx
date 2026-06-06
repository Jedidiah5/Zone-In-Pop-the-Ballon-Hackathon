"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ZoneCard from "@/components/ZoneCard";
import { useStoredZones } from "@/hooks/useStoredZones";
import { loadLocation } from "@/lib/storage";

const DynamicZonesMap = dynamic(() => import("@/components/ZonesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
      Loading London demand map
    </div>
  ),
});

export default function ZonesPage() {
  const router = useRouter();
  const { zones, isReady, hasSearch } = useStoredZones();
  const [currentTime, setCurrentTime] = useState("");
  const [driverArea, setDriverArea] = useState("");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!hasSearch) {
      router.replace("/");
    }
  }, [hasSearch, isReady, router]);

  useEffect(() => {
    setDriverArea(loadLocation());
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const avgSurge = useMemo(() => {
    return zones.length
      ? zones.reduce((sum, zone) => sum + zone.surgeMultiplier, 0) / zones.length
      : 0;
  }, [zones]);

  const activeJobs = useMemo(() => {
    return zones.reduce((sum, zone) => sum + zone.activeJobs, 0);
  }, [zones]);

  if (!isReady || !hasSearch) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
        Loading zones...
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0A0A0A] pb-24 text-white">
      <section className="relative overflow-hidden border-b border-[#222222] bg-[#0A0A0A]">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#FF3B30]/40 bg-[#141414]/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#FF3B30]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF3B30]" />
          LIVE
        </div>
        <div className="absolute right-4 top-4 z-10 rounded-full border border-[#222222] bg-[#141414]/95 px-3 py-2 text-sm font-bold text-white">
          {currentTime}
        </div>

        <DynamicZonesMap zones={zones} />
      </section>

      <section className="px-5 pt-5">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.04em] text-white">
                Top Zones Now
              </h1>
              {driverArea && (
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#555555]">
                  Near {driverArea}
                </p>
              )}
            </div>
            <Link
              className="shrink-0 touch-manipulation rounded-lg border border-[#222222] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#F5A623] active:opacity-80"
              href="/"
            >
              New search
            </Link>
          </div>

          <div className="mb-5 flex snap-x gap-3 overflow-x-auto pb-1">
            <div className="shrink-0 rounded-full border border-[#222222] bg-[#141414] px-4 py-2 text-sm font-bold text-[#F5A623]">
              Avg Surge: {avgSurge.toFixed(1)}x
            </div>
            <div className="shrink-0 rounded-full border border-[#222222] bg-[#141414] px-4 py-2 text-sm font-bold text-[#F5A623]">
              Active Jobs: {Math.round(activeJobs / 10) * 10}+
            </div>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 no-scrollbar">
            {zones.map((zone) => (
              <div className="snap-center shrink-0" key={zone.name}>
                <ZoneCard zone={zone} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
