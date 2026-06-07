"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import LoadingScreen from "@/components/LoadingScreen";
import { useShiftTimer } from "@/hooks/useShiftTimer";
import { getProfile } from "@/lib/database";
import {
  endShift,
  formatLogTime,
  formatShiftDuration,
  formatShiftMinutes,
  startShift,
} from "@/lib/shift";
import { loadActiveZone, loadLocation } from "@/lib/storage";

export default function ShiftPage() {
  const router = useRouter();
  const { session, setSession, elapsedSeconds, totalMinutes, refresh } =
    useShiftTimer();
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [driverArea, setDriverArea] = useState("");
  const [ready, setReady] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    async function loadShiftData() {
      setDriverArea(loadLocation());

      try {
        const profile = await getProfile();
        setActiveZone(profile?.active_zone ?? loadActiveZone() ?? null);
      } catch {
        setActiveZone(loadActiveZone());
      }

      setReady(true);
    }

    loadShiftData();
  }, []);

  const isActive = session.active;
  const timeOnlineLabel = isActive
    ? formatShiftDuration(elapsedSeconds)
    : formatShiftMinutes(totalMinutes);

  const handleStartShift = () => {
    const nextSession = startShift({
      homeArea: driverArea,
      activeZone: activeZone,
    });
    setSession(nextSession);
    refresh();
  };

  const handleEndShift = () => {
    setIsEnding(true);
    const endedSession = endShift();
    setSession(endedSession);
    refresh();
    setIsEnding(false);
  };

  if (!ready) {
    return <LoadingScreen message="Loading shift..." />;
  }

  return (
    <AppLayout>
      <div className="page-shell-wide py-6 lg:max-w-none lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
            Live shift
          </h1>
          {isActive ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-3 py-1.5 text-xs font-bold text-black">
              <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
              Shift in progress
            </span>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <section className="grid grid-cols-2 gap-4">
            <div className="bolt-card p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
                Online
              </p>
              <p className="text-3xl font-bold tracking-[-0.06em] lg:text-4xl">
                {timeOnlineLabel}
              </p>
            </div>
            <div className="bolt-card p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
                Current zone
              </p>
              <p className="text-2xl font-bold tracking-[-0.06em] text-black lg:text-3xl">
                {activeZone ?? "—"}
              </p>
            </div>
          </section>

          <section className="bolt-card p-5 lg:row-span-2">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? "animate-pulse bg-black" : "bg-[#CCCCCC]"
                }`}
              />
              <h2 className="text-xl font-bold tracking-[-0.04em]">Shift log</h2>
            </div>

            {session.log.length > 0 ? (
              <ul className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
                {session.log.map((entry) => (
                  <li
                    className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] pb-3 last:border-0 last:pb-0"
                    key={entry.id}
                  >
                    <p className="text-sm font-bold text-black">
                      {entry.message}
                    </p>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[#999999]">
                      {formatLogTime(entry.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[120px] flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-black">
                  No shift activity yet
                </p>
                <p className="mt-1 text-xs text-[#666666]">
                  {driverArea
                    ? `Start a shift near ${driverArea} to begin tracking.`
                    : "Start a shift from Earnings to begin tracking."}
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          {isActive ? (
            <button
              className="bolt-btn-primary flex-1 disabled:opacity-70"
              disabled={isEnding}
              onClick={handleEndShift}
              type="button"
            >
              {isEnding ? "Ending shift..." : "End shift"}
            </button>
          ) : (
            <button
              className="bolt-btn-primary flex-1"
              onClick={handleStartShift}
              type="button"
            >
              Start shift
            </button>
          )}
          <button
            className="rounded-md border border-[#E5E5E5] bg-white px-5 py-3 text-sm font-bold text-black active:opacity-80"
            onClick={() => router.push("/zones")}
            type="button"
          >
            View zones
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
