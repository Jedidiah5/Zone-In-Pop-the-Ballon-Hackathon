"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import BottomSheet from "@/components/BottomSheet";
import ZoneCard from "@/components/ZoneCard";
import { useStoredZones } from "@/hooks/useStoredZones";
import { loadLocation } from "@/lib/storage";

const DynamicZonesMap = dynamic(() => import("@/components/ZonesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm font-bold text-[#888888]">
      Loading London map...
    </div>
  ),
});

export default function ZonesPage() {
  const router = useRouter();
  const { zones, isReady, hasSearch } = useStoredZones();
  const [currentTime, setCurrentTime] = useState("");
  const [driverArea, setDriverArea] = useState("");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!hasSearch) {
      router.replace("/onboarding");
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

  const sheetHeader = (
    <div className="w-full text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.04em] text-white">
            Top zones now
          </h1>
          {driverArea && (
            <p className="mt-0.5 text-xs font-medium text-[#888888]">
              Near {driverArea}
            </p>
          )}
        </div>
        <Link
          className="shrink-0 rounded-[14px] border border-[#2A2A2A] bg-[#1E1E1E] px-3 py-2 text-xs font-bold text-[#F5A623] active:opacity-80"
          href="/onboarding"
        >
          New search
        </Link>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        <span className="bolt-float-chip shrink-0 px-3 py-1.5 text-xs font-bold text-[#F5A623]">
          Avg surge {avgSurge.toFixed(1)}x
        </span>
        <span className="bolt-float-chip shrink-0 px-3 py-1.5 text-xs font-bold text-[#00FF94]">
          {Math.round(activeJobs / 10) * 10}+ active jobs
        </span>
      </div>
    </div>
  );

  if (!isReady || !hasSearch) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold text-[#888888]">
        Loading zones...
      </main>
    );
  }

  return (
    <AppLayout fullBleed hideNav={false}>
      {/* Mobile: map-first + bottom sheet */}
      <div className="relative h-dvh overflow-hidden lg:hidden">
        <div className="absolute inset-0">
          <DynamicZonesMap
            interactive
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
            zones={zones}
          />
        </div>

        <div className="absolute left-4 top-safe z-20 pt-3">
          <div className="bolt-float-chip flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF3B30]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF3B30]" />
            LIVE
          </div>
        </div>
        <div className="absolute right-4 top-safe z-20 pt-3">
          <div className="bolt-float-chip px-3 py-2 text-sm font-bold text-white">
            {currentTime}
          </div>
        </div>

        <BottomSheet header={sheetHeader}>
          <div className="space-y-3">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.name}
                onSelect={() => setSelectedZone(zone.name)}
                selected={selectedZone === zone.name}
                variant="row"
                zone={zone}
              />
            ))}
          </div>
        </BottomSheet>
      </div>

      {/* Desktop: professional split dashboard */}
      <div className="hidden min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative min-h-dvh">
          <DynamicZonesMap
            interactive
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
            zones={zones}
          />
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <div className="bolt-float-chip flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#FF3B30]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF3B30]" />
              LIVE
            </div>
            <div className="bolt-float-chip px-4 py-2 text-sm font-bold text-white">
              {currentTime}
            </div>
          </div>
        </div>

        <aside className="flex min-h-dvh flex-col border-l border-[#2A2A2A] bg-[#111111]">
          <div className="border-b border-[#2A2A2A] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-white">
                  Top zones now
                </h1>
                {driverArea && (
                  <p className="mt-1 text-sm text-[#888888]">Near {driverArea}</p>
                )}
              </div>
              <Link
                className="shrink-0 rounded-[14px] border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm font-bold text-[#F5A623] hover:opacity-90"
                href="/onboarding"
              >
                New search
              </Link>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-[#F5A623]">
                Avg surge {avgSurge.toFixed(1)}x
              </span>
              <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-[#00FF94]">
                {Math.round(activeJobs / 10) * 10}+ jobs
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6 no-scrollbar">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.name}
                onSelect={() => setSelectedZone(zone.name)}
                selected={selectedZone === zone.name}
                variant="card"
                zone={zone}
              />
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
