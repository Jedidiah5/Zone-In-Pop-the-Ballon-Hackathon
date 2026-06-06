"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MOCK_ZONES } from "@/lib/mockZones";
import type { Zone } from "@/types";

function getZoneSlug(name: string) {
  return encodeURIComponent(
    name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
  );
}

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
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES);

  useEffect(() => {
    const stored = localStorage.getItem("zonein_results");
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Zone[];
      if (parsed.length) {
        setZones(parsed);
      }
    } catch {
      setZones(MOCK_ZONES);
    }
  }, []);

  const zone = useMemo(() => {
    const requestedSlug = params.zone;
    return (
      zones.find((item) => getZoneSlug(item.name) === requestedSlug) ??
      MOCK_ZONES[0]
    );
  }, [params.zone, zones]);

  const potential = getPotentialConfig(zone.potential);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 pb-28 pt-6 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-[#888888] active:scale-[0.98]"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.5} />
          Back
        </button>

        <header className="mb-6">
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.05em] text-white">
            {zone.name}
          </h1>
          <div
            className={`mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${potential.className}`}
          >
            {potential.label}
          </div>
        </header>

        <section className="mb-8 grid grid-cols-3 gap-3">
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
              ~{zone.demandWindowMinutes} mins
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <h2 className="mb-3 text-xl font-bold tracking-[-0.04em] text-white">
            Why this zone?
          </h2>
          <p className="text-base font-medium leading-7 text-[#888888]">
            {zone.detailedReasoning}
          </p>
        </section>

        <section className="rounded-xl border border-[#222222] bg-[#141414] p-5">
          <h2 className="mb-4 text-xl font-bold tracking-[-0.04em] text-white">
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

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#222222] bg-[#0A0A0A] p-5 pb-safe">
        <button
          className="flex h-14 w-full items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.12em] text-[#0A0A0A] active:scale-[0.98]"
          type="button"
        >
          START DRIVING HERE
        </button>
      </div>
    </main>
  );
}
