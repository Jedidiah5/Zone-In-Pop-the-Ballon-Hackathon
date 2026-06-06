"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import PlatformIcon from "@/components/PlatformIcon";
import { getProfile, signOut, updateProfile } from "@/lib/database";
import { loadPreferredZones, saveLocation } from "@/lib/storage";
import type { Platform, ShiftPreference, VehicleType } from "@/types";

const PLATFORM_LABELS: Record<Platform, string> = {
  uber: "Uber",
  bolt: "Bolt",
  deliveroo: "Deliveroo",
  stuart: "Stuart",
};

const VEHICLE_LABELS: Record<VehicleType, string> = {
  car: "Car",
  bike: "Bike",
  scooter: "Scooter",
  van: "Van",
};

const SHIFT_LABELS: Record<ShiftPreference, string> = {
  morning: "Morning (6am–12pm)",
  afternoon: "Afternoon (12pm–6pm)",
  evening: "Evening (6pm–12am)",
  night: "Night (12am–6am)",
  flexible: "Flexible",
};

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [platform, setPlatform] = useState<Platform>("bolt");
  const [homeArea, setHomeArea] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [shiftPreference, setShiftPreference] = useState<ShiftPreference | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [preferredZones, setPreferredZones] = useState<string[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();

        if (profile?.full_name) setFullName(profile.full_name);
        if (profile?.platform) setPlatform(profile.platform);
        if (profile?.home_area) setHomeArea(profile.home_area);
        if (profile?.vehicle_type) setVehicleType(profile.vehicle_type);
        if (profile?.shift_preference) {
          setShiftPreference(profile.shift_preference);
        }
        if (profile?.email) setEmail(profile.email);
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
    <AppLayout>
      <div className="page-shell-wide py-6 lg:max-w-none lg:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
              {fullName ? `Hey, ${fullName}` : "My profile"}
            </h1>
            {email && (
              <p className="mt-1 text-sm text-[#888888]">{email}</p>
            )}
          </div>
          <button
            className="shrink-0 rounded-md border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm font-bold text-[#F5A623] active:opacity-80"
            onClick={() => router.push("/onboarding")}
            type="button"
          >
            New search
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {(vehicleType || shiftPreference) && (
            <section className="grid grid-cols-2 gap-4 lg:col-span-2">
              {vehicleType && (
                <div className="bolt-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
                    Vehicle
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {VEHICLE_LABELS[vehicleType]}
                  </p>
                </div>
              )}
              {shiftPreference && (
                <div className="bolt-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
                    Shift
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#F5A623]">
                    {SHIFT_LABELS[shiftPreference]}
                  </p>
                </div>
              )}
            </section>
          )}

          <section className="bolt-card p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Platform
            </p>
            <div className="flex items-center gap-4">
              <PlatformIcon platform={platform} size={48} />
              <span className="text-2xl font-bold tracking-[-0.05em]">
                {PLATFORM_LABELS[platform]}
              </span>
            </div>
          </section>

          <section className="bolt-card p-5">
            <label
              className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-[#888888]"
              htmlFor="home-area"
            >
              Home area
            </label>
            <input
              className="bolt-input"
              id="home-area"
              onBlur={handleHomeAreaBlur}
              onChange={(event) => setHomeArea(event.target.value)}
              placeholder="e.g. Shoreditch"
              value={homeArea}
            />
          </section>

          <section className="bolt-card p-5 lg:col-span-2">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Top zones from last search
            </p>
            <div className="no-scrollbar flex flex-wrap gap-2">
              {preferredZones.length ? (
                preferredZones.map((zone) => (
                  <span
                    className="rounded-full border border-[#F5A623]/40 bg-[#F5A623]/10 px-4 py-2 text-sm font-bold text-[#F5A623]"
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

          <section className="bolt-card border-[#F5A623]/30 p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold tracking-[-0.05em] text-[#F5A623]">
                ZoneIn Pro
              </h2>
              <span className="rounded-full border border-[#00FF94]/40 bg-[#00FF94]/10 px-3 py-1 text-xs font-bold text-[#00FF94]">
                Active
              </span>
            </div>
            <p className="text-sm font-bold text-[#888888]">
              £2.99/month · cancel anytime
            </p>
          </section>
        </div>

        <button
          className="mt-6 w-full py-3 text-center text-sm font-bold text-[#888888] active:text-white disabled:opacity-60"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </AppLayout>
  );
}
