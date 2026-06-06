"use client";

import { ArrowLeft, Navigation } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useStoredZones } from "@/hooks/useStoredZones";
import { saveActiveZone } from "@/lib/storage";
import { getMapsDirectionsUrl, getZoneSlug } from "@/lib/zoneCoordinates";
import type { Zone } from "@/types";

function getPotentialConfig(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        label: "HIGH POTENTIAL",
        className: "border-[#00FF94] bg-[#00FF94]/10 text-[#00FF94]",
      };
    case "medium":
      return {
        label: "MEDIUM",
        className: "border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623]",
      };
    case "low":
      return {
        label: "LOW",
        className: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",
      };
  }
}

export default function ZoneDetailPage() {
  const router = useRouter();
  const params = useParams<{ zone: string }>();
  const { zones, isReady } = useStoredZones();
  const [notFound, setNotFound] = useState(false);

  const zone = useMemo(() => {
    const requestedSlug = params.zone;
    return zones.find((item) => getZoneSlug(item.name) === requestedSlug);
  }, [params.zone, zones]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!zone) {
      setNotFound(true);
    }
  }, [isReady, zone]);

  const handleStartDriving = () => {
    if (!zone) {
      return;
    }

    saveActiveZone(zone.name);
    window.open(getMapsDirectionsUrl(zone.name), "_blank", "noopener,noreferrer");
  };

  if (!isReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
        Loading zone...
      </main>
    );
  }

  if (notFound || !zone) {
    return (
      <main className="flex min-h-dvh flex-col bg-[#0A0A0A] px-5 pb-28 pt-safe text-white">
        <button
          className="mb-8 flex touch-manipulation items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-[#888888] active:opacity-80"
          onClick={() => router.push("/zones")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.5} />
          Back to zones
        </button>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-xl font-bold text-white">Zone not found</p>
          <p className="mt-2 text-sm text-[#888888]">
            Run a new search to refresh your zone list.
          </p>
          <button
            className="mt-6 h-12 touch-manipulation rounded-lg bg-[#F5A623] px-6 text-sm font-bold uppercase tracking-[0.1em] text-[#0A0A0A] active:opacity-80"
            onClick={() => router.push("/")}
            type="button"
          >
            New search
          </button>
        </div>
        <BottomNav />
      </main>
    );
  }

  const potential = getPotentialConfig(zone.potential);

  return (
    <main className="min-h-dvh bg-[#0A0A0A] px-5 pb-36 pt-safe text-white">
      <div className="mx-auto max-w-4xl">
        <button
          className="mb-6 flex touch-manipulation items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-[#888888] active:opacity-80"
          onClick={() => router.push("/zones")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.5} />
          Back
        </button>

        <header className="mb-6">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.05em] text-white sm:text-[32px]">
            {zone.name}
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#555555]">
            {zone.distance}
          </p>
          <div
            className={`mt-4 inline-flex rounded px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${potential.className}`}
          >
            {potential.label}
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Surge
            </p>
            <p className="text-3xl font-bold tracking-[-0.05em] text-[#F5A623]">
              {zone.surgeMultiplier}x
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Active Jobs
            </p>
            <p className="text-3xl font-bold tracking-[-0.05em] text-[#00FF94]">
              {zone.activeJobs}
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Demand Window
            </p>
            <p className="text-3xl font-bold tracking-[-0.05em] text-white">
              ~{zone.demandWindowMinutes}m
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-white">
            Why this zone?
          </h2>
          <p className="text-[15px] leading-7 text-[#888888]">
            {zone.detailedReasoning}
          </p>
        </section>

        <section className="rounded-xl border border-[#222222] bg-[#141414] p-5">
          <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] text-white">
            Watch out for
          </h2>
          <div className="space-y-3 text-sm font-bold text-[#888888]">
            <div className="flex items-start justify-between gap-4 border-b border-[#222222] pb-3">
              <span>Congestion charge</span>
              <span
                className={
                  zone.congestionWarning ? "text-[#FF3B30]" : "text-[#00FF94]"
                }
              >
                {zone.congestionWarning ? "Check boundary" : "Not flagged"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-[#222222] pb-3">
              <span>Known dead streets</span>
              <span className="max-w-[180px] text-right text-white">
                Avoid blocked side roads after pickups
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span>Peak end time</span>
              <span className="text-[#F5A623]">{zone.peakEndTime}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 border-t border-[#222222] bg-[#0A0A0A] p-5">
        <button
          className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.12em] text-[#0A0A0A] active:opacity-80"
          onClick={handleStartDriving}
          type="button"
        >
          <Navigation aria-hidden="true" size={18} strokeWidth={2.5} />
          Start driving here
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
