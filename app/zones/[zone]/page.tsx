"use client";

import { ArrowLeft, Navigation } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useStoredZones } from "@/hooks/useStoredZones";
import { updateProfile } from "@/lib/database";
import { saveActiveZone } from "@/lib/storage";
import { getMapsDirectionsUrl, getZoneSlug } from "@/lib/zoneCoordinates";
import type { Zone } from "@/types";

function getPotentialConfig(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        label: "High potential",
        className: "border-[#00FF94]/40 bg-[#00FF94]/10 text-[#00FF94]",
      };
    case "medium":
      return {
        label: "Medium",
        className: "border-[#F5A623]/40 bg-[#F5A623]/10 text-[#F5A623]",
      };
    case "low":
      return {
        label: "Low",
        className: "border-[#FF3B30]/40 bg-[#FF3B30]/10 text-[#FF3B30]",
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

  const handleStartDriving = async () => {
    if (!zone) {
      return;
    }

    saveActiveZone(zone.name);

    try {
      await updateProfile({ active_zone: zone.name });
    } catch {
      // Local cache still updated.
    }

    window.open(getMapsDirectionsUrl(zone.name), "_blank", "noopener,noreferrer");
  };

  if (!isReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold text-[#888888]">
        Loading zone...
      </main>
    );
  }

  if (notFound || !zone) {
    return (
      <AppLayout>
        <div className="page-shell-wide flex min-h-[70dvh] flex-col py-6">
          <button
            className="mb-8 flex touch-manipulation items-center gap-3 text-sm font-bold text-[#888888] active:opacity-80"
            onClick={() => router.push("/zones")}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.5} />
            Back to zones
          </button>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-xl font-bold">Zone not found</p>
            <p className="mt-2 text-sm text-[#888888]">
              Run a new search to refresh your zone list.
            </p>
            <button
              className="bolt-btn-primary mt-6 !w-auto px-8"
              onClick={() => router.push("/onboarding")}
              type="button"
            >
              New search
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const potential = getPotentialConfig(zone.potential);

  return (
    <AppLayout>
      <div className="page-shell-wide pb-32 py-6 lg:max-w-4xl lg:pb-10 lg:py-10">
        <button
          className="mb-5 flex touch-manipulation items-center gap-3 text-sm font-bold text-[#888888] active:opacity-80"
          onClick={() => router.push("/zones")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.5} />
          Back
        </button>

        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-4xl">
            {zone.name}
          </h1>
          <p className="mt-2 text-sm text-[#888888]">{zone.distance}</p>
          <div
            className={`mt-4 inline-flex rounded-full border px-4 py-2 text-xs font-bold ${potential.className}`}
          >
            {potential.label}
          </div>
        </header>

        <section className="mb-5 grid grid-cols-3 gap-3">
          <div className="bolt-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#888888]">
              Surge
            </p>
            <p className="text-2xl font-bold text-[#F5A623]">
              {zone.surgeMultiplier}x
            </p>
          </div>
          <div className="bolt-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#888888]">
              Active jobs
            </p>
            <p className="text-2xl font-bold text-[#00FF94]">{zone.activeJobs}</p>
          </div>
          <div className="bolt-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#888888]">
              Demand window
            </p>
            <p className="text-2xl font-bold">~{zone.demandWindowMinutes}m</p>
          </div>
        </section>

        <section className="bolt-card mb-5 p-5">
          <h2 className="mb-3 text-lg font-bold tracking-[-0.04em]">
            Why this zone?
          </h2>
          <p className="text-[15px] leading-7 text-[#888888]">
            {zone.detailedReasoning}
          </p>
        </section>

        <section className="bolt-card p-5">
          <h2 className="mb-4 text-lg font-bold tracking-[-0.04em]">
            Watch out for
          </h2>
          <div className="space-y-3 text-sm font-bold text-[#888888]">
            <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2A] pb-3">
              <span>Congestion charge</span>
              <span
                className={
                  zone.congestionWarning ? "text-[#FF3B30]" : "text-[#00FF94]"
                }
              >
                {zone.congestionWarning ? "Check boundary" : "Not flagged"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2A] pb-3">
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

      <div className="fixed bottom-[5.5rem] left-4 right-4 z-40 lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-md">
        <button
          className="bolt-btn-primary gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          onClick={handleStartDriving}
          type="button"
        >
          <Navigation aria-hidden="true" size={18} strokeWidth={2.5} />
          Start driving here
        </button>
      </div>
    </AppLayout>
  );
}
