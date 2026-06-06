"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useStoredZones } from "@/hooks/useStoredZones";
import { getProfile } from "@/lib/database";
import { loadActiveZone, loadLocation } from "@/lib/storage";

export default function ShiftPage() {
  const { zones, isReady } = useStoredZones();
  const [activeZone, setActiveZone] = useState("Hackney");
  const [driverArea, setDriverArea] = useState("");

  useEffect(() => {
    async function loadShiftData() {
      setDriverArea(loadLocation());

      try {
        const profile = await getProfile();
        setActiveZone(
          profile?.active_zone ??
            loadActiveZone() ??
            zones[0]?.name ??
            "Hackney"
        );
      } catch {
        setActiveZone(loadActiveZone() ?? zones[0]?.name ?? "Hackney");
      }
    }

    loadShiftData();
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
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold text-[#888888]">
        Loading shift...
      </main>
    );
  }

  return (
    <AppLayout>
      <div className="page-shell-wide py-6 lg:max-w-none lg:py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
          Live shift
        </h1>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="grid grid-cols-2 gap-4">
            <div className="bolt-card p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
                Online
              </p>
              <p className="text-3xl font-bold tracking-[-0.06em] lg:text-4xl">
                2h 34m
              </p>
            </div>
            <div className="bolt-card p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
                Current zone
              </p>
              <p className="text-2xl font-bold tracking-[-0.06em] text-[#F5A623] lg:text-3xl">
                {activeZone}
              </p>
            </div>
          </section>

          <section className="bolt-card p-5 lg:row-span-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00FF94]" />
              <h2 className="text-xl font-bold tracking-[-0.04em]">Shift log</h2>
            </div>
            <div className="space-y-4">
              {shiftEvents.map((event) => (
                <div
                  className="flex gap-4 border-b border-[#2A2A2A] pb-4 last:border-b-0 last:pb-0"
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
      </div>
    </AppLayout>
  );
}
