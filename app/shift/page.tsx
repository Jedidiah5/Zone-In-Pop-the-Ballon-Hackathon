"use client";

import BottomNav from "@/components/BottomNav";

const SHIFT_EVENTS = [
  { time: "20:12", label: "Started shift near Shoreditch" },
  { time: "20:44", label: "Moved into Hackney demand pocket" },
  { time: "21:18", label: "Best surge seen in Westminster" },
];

export default function ShiftPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[32px] font-bold leading-tight tracking-[-0.05em] text-white">
          Live Shift
        </h1>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Online
            </p>
            <p className="text-4xl font-bold tracking-[-0.06em] text-white">
              2h 34m
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Current Zone
            </p>
            <p className="text-4xl font-bold tracking-[-0.06em] text-[#F5A623]">
              Hackney
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
            {SHIFT_EVENTS.map((event) => (
              <div
                className="flex gap-4 border-b border-[#222222] pb-4 last:border-b-0 last:pb-0"
                key={`${event.time}-${event.label}`}
              >
                <span className="font-bold text-[#F5A623]">{event.time}</span>
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
