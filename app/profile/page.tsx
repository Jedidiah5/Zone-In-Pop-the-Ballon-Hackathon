"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import type { Platform } from "@/types";

const PLATFORM_CONFIG: Record<Platform, { label: string; dotClass: string }> = {
  uber: { label: "Uber", dotClass: "bg-black border border-[#333333]" },
  bolt: { label: "Bolt", dotClass: "bg-[#00FF94]" },
  deliveroo: { label: "Deliveroo", dotClass: "bg-[#00C2B8]" },
  stuart: { label: "Stuart", dotClass: "bg-[#7B61FF]" },
};

const DEFAULT_ZONES = ["Soho", "Shoreditch", "Angel", "Camden", "Borough"];

export default function ProfilePage() {
  const [platform, setPlatform] = useState<Platform>("bolt");
  const [homeArea, setHomeArea] = useState("Shoreditch");
  const platformConfig = PLATFORM_CONFIG[platform];

  useEffect(() => {
    const storedPlatform = localStorage.getItem("zonein_platform") as Platform | null;
    const storedLocation = localStorage.getItem("zonein_location");

    if (storedPlatform && storedPlatform in PLATFORM_CONFIG) {
      setPlatform(storedPlatform);
    }
    if (storedLocation) {
      setHomeArea(storedLocation);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[32px] font-bold leading-tight tracking-[-0.05em] text-white">
          My Profile
        </h1>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
            Platform
          </p>
          <div className="flex items-center gap-4">
            <span className={`h-5 w-5 rounded-full ${platformConfig.dotClass}`} />
            <span className="text-3xl font-bold tracking-[-0.05em] text-white">
              {platformConfig.label}
            </span>
          </div>
        </section>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <label
            className="mb-3 block text-xs font-bold uppercase tracking-[0.14em] text-[#888888]"
            htmlFor="home-area"
          >
            Home area
          </label>
          <input
            className="h-14 w-full rounded-lg border border-[#222222] bg-[#0A0A0A] px-4 text-xl font-bold text-white outline-none transition-colors focus:border-[#F5A623]"
            id="home-area"
            onChange={(event) => setHomeArea(event.target.value)}
            value={homeArea}
          />
        </section>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
            Preferred zones
          </p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {DEFAULT_ZONES.map((zone) => (
              <span
                className="whitespace-nowrap rounded-full border border-[#F5A623] bg-[#F5A623]/10 px-4 py-2 text-sm font-bold text-[#F5A623]"
                key={zone}
              >
                {zone}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-[#F5A623] bg-[#141414] p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.05em] text-[#F5A623]">
              ZoneIn Pro
            </h2>
            <span className="rounded-full border border-[#00FF94] bg-[#00FF94]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#00FF94]">
              Active
            </span>
          </div>
          <p className="text-sm font-bold text-[#888888]">
            £2.99/month · cancel anytime
          </p>
        </section>

        <button
          className="w-full text-center text-sm font-bold uppercase tracking-[0.12em] text-[#888888]"
          type="button"
        >
          Sign Out
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
