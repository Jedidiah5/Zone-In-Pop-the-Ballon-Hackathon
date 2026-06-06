"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import PlatformIcon from "@/components/PlatformIcon";
import { getProfile, signOut, updateProfile } from "@/lib/database";
import { loadPreferredZones, saveLocation } from "@/lib/storage";
import type { Platform } from "@/types";

const PLATFORM_LABELS: Record<Platform, string> = {
  uber: "Uber",
  bolt: "Bolt",
  deliveroo: "Deliveroo",
  stuart: "Stuart",
};

export default function ProfilePage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("bolt");
  const [homeArea, setHomeArea] = useState("");
  const [email, setEmail] = useState("");
  const [preferredZones, setPreferredZones] = useState<string[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();

        if (profile?.platform) {
          setPlatform(profile.platform);
        }
        if (profile?.home_area) {
          setHomeArea(profile.home_area);
        }
        if (profile?.email) {
          setEmail(profile.email);
        }
      } catch {
        // Profile loads from local cache if Supabase is unavailable.
      }

      setPreferredZones(loadPreferredZones());
    }

    loadProfile();
  }, []);

  const handleHomeAreaBlur = async () => {
    if (!homeArea.trim()) {
      return;
    }

    saveLocation(homeArea);

    try {
      await updateProfile({ home_area: homeArea.trim() });
    } catch {
      // Local cache still updated.
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#0A0A0A] px-5 pb-28 pt-safe text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.05em] text-white">
              My Profile
            </h1>
            {email && (
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#555555]">
                {email}
              </p>
            )}
          </div>
          <button
            className="touch-manipulation rounded-lg border border-[#222222] bg-[#141414] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#F5A623] active:opacity-80"
            onClick={() => router.push("/")}
            type="button"
          >
            New search
          </button>
        </div>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
            Platform
          </p>
          <div className="flex items-center gap-4">
            <PlatformIcon platform={platform} size={44} />
            <span className="text-2xl font-bold tracking-[-0.05em] text-white">
              {PLATFORM_LABELS[platform]}
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
            className="h-14 w-full touch-manipulation rounded-lg border border-[#222222] bg-[#0A0A0A] px-4 text-lg font-bold text-white outline-none transition-colors focus:border-[#F5A623]"
            id="home-area"
            onBlur={handleHomeAreaBlur}
            onChange={(event) => setHomeArea(event.target.value)}
            placeholder="e.g. Shoreditch"
            value={homeArea}
          />
        </section>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
            Top zones from last search
          </p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {preferredZones.length ? (
              preferredZones.map((zone) => (
                <span
                  className="whitespace-nowrap rounded-full border border-[#F5A623] bg-[#F5A623]/10 px-4 py-2 text-sm font-bold text-[#F5A623]"
                  key={zone}
                >
                  {zone}
                </span>
              ))
            ) : (
              <span className="text-sm font-bold text-[#888888]">
                Run a search to see your zones
              </span>
            )}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-[#F5A623] bg-[#141414] p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-[-0.05em] text-[#F5A623]">
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
          className="w-full touch-manipulation py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-[#888888] active:text-white disabled:opacity-60"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
