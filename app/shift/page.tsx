"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useStoredZones } from "@/hooks/useStoredZones";
import { loadActiveZone, loadLocation } from "@/lib/storage";

export default function ShiftPage() {
  const { zones, isReady } = useStoredZones();
  const [activeZone, setActiveZone] = useState("Hackney");
  const [driverArea, setDriverArea] = useState("");

  useEffect(() => {
    setDriverArea(loadLocation());
    setActiveZone(loadActiveZone() ?? zones[0]?.name ?? "Hackney");
  }, [zones]);

  const shiftEvents = useMemo(() => {
    const topZones = zones.slice(0, 3);
    return [
      {
        time: "20:12",
        label: `Started shift near ${driverArea || "your area"}`,
      },
      {
        time: "20:44",
        label: topZones[1]
          ? `Moved into ${topZones[1].name} demand pocket`
          : "Monitoring nearby demand",
      },
      {
        time: "21:18",
        label: topZones[0]
          ? `Best surge seen in ${topZones[0].name}`
          : "Waiting for next surge window",
      },
    ];
  }, [driverArea, zones]);

  if (!isReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
        Loading shift...
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0A0A0A] px-5 pb-28 pt-safe text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[28px] font-bold leading-tight tracking-[-0.05em] text-white">
          Live Shift
        </h1>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Online
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-white sm:text-4xl">
              2h 34m
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Current Zone
            </p>
            <p className="text-2xl font-bold tracking-[-0.06em] text-[#F5A623] sm:text-3xl">
              {activeZone}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-[#222222] bg-[#141414] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00FF94]" />
            <h2 className="text-xl font-bold tracking-[-0.04em] text-white">
              Shift log
            </h2>
          </div>
          <div className="space-y-4">
            {shiftEvents.map((event) => (
              <div
                className="flex gap-4 border-b border-[#222222] pb-4 last:border-b-0 last:pb-0"
                key={`${event.time}-${event.label}`}
              >
                <span className="shrink-0 font-bold text-[#F5A623]">
                  {event.time}
                </span>
                <span className="font-medium text-[#888888]">{event.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
