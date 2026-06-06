"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingWizard from "@/components/OnboardingWizard";
import { getProfile } from "@/lib/database";
import { getCurrentAreaName, getGeolocationErrorMessage } from "@/lib/geolocation";
import {
  cacheSearchLocally,
  isOnboardingCompleted,
  loadFullName,
  loadLastPlatform,
  loadLocation,
  loadShiftPreference,
  loadVehicleType,
  saveDriverExtras,
  saveDriverId,
  saveLastPlatform,
  saveLocation,
} from "@/lib/storage";
import type { OnboardingData, Zone } from "@/types";

type ZonesApiResponse = {
  zones?: Zone[];
  source?: "gemini" | "mock";
  reason?: string;
  error?: string;
  driverId?: string;
};

type ProfileApiResponse = {
  success?: boolean;
  partial?: boolean;
  warning?: string;
  error?: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<OnboardingData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile) {
          setInitialData({
            fullName: profile.full_name ?? loadFullName(),
            platform: profile.platform ?? loadLastPlatform(),
            location: profile.home_area ?? loadLocation(),
            vehicleType: profile.vehicle_type ?? loadVehicleType(),
            shiftPreference:
              profile.shift_preference ?? loadShiftPreference(),
          });

          if (profile.onboarding_completed || isOnboardingCompleted()) {
            router.replace("/zones");
            return;
          }
        }
      } catch {
        setInitialData({
          fullName: loadFullName(),
          platform: loadLastPlatform(),
          location: loadLocation(),
          vehicleType: loadVehicleType(),
          shiftPreference: loadShiftPreference(),
        });
      }

      setReady(true);
    }

    loadProfile();
  }, [router]);

  const handleUseCurrentLocation = async () => {
    setError("");
    setIsLocating(true);

    try {
      const area = await getCurrentAreaName();
      saveLocation(area);
      return area;
    } catch (err) {
      setError(getGeolocationErrorMessage(err));
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  const handleComplete = async (data: OnboardingData) => {
    if (!data.platform || !data.vehicleType || !data.shiftPreference) {
      setError("Please complete all steps");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const profileResponse = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          platform: data.platform,
          home_area: data.location,
          vehicle_type: data.vehicleType,
          shift_preference: data.shiftPreference,
        }),
      });

      const profileResult =
        (await profileResponse.json()) as ProfileApiResponse;

      if (!profileResponse.ok) {
        throw new Error(
          profileResult.error ?? "Failed to save your profile"
        );
      }

      saveDriverExtras({
        fullName: data.fullName,
        vehicleType: data.vehicleType,
        shiftPreference: data.shiftPreference,
      });

      const zonesResponse = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: data.platform,
          location: data.location,
        }),
      });

      const zonesData = (await zonesResponse.json()) as ZonesApiResponse | Zone[];
      const zones = Array.isArray(zonesData) ? zonesData : zonesData.zones;
      const source = Array.isArray(zonesData) ? "unknown" : zonesData.source;
      const reason = Array.isArray(zonesData) ? undefined : zonesData.reason;

      if (!zonesResponse.ok) {
        const errorMessage =
          !Array.isArray(zonesData) && zonesData.error
            ? zonesData.error
            : "Failed to fetch zones";
        throw new Error(errorMessage);
      }

      if (!zones?.length) {
        throw new Error("No zones returned");
      }

      cacheSearchLocally({
        zones,
        platform: data.platform,
        location: data.location,
        source: source ?? "unknown",
        sourceReason: reason,
      });

      saveDriverId(data.platform, data.location);
      saveLastPlatform(data.platform);
      saveDriverExtras({ onboardingCompleted: true });

      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding_completed: true }),
      }).catch(() => {
        // Local flag already set — onboarding can continue.
      });

      router.push("/zones");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white text-sm font-bold uppercase tracking-[0.14em] text-[#666666]">
        Loading...
      </main>
    );
  }

  return (
    <OnboardingWizard
      error={error}
      initialData={initialData}
      isLoading={isLoading}
      isLocating={isLocating}
      onComplete={handleComplete}
      onUseCurrentLocation={handleUseCurrentLocation}
    />
  );
}
