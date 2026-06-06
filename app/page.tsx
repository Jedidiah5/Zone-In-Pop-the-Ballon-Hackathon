"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardingScreen from "@/components/OnboardingScreen";
import { getCurrentAreaName, getGeolocationErrorMessage } from "@/lib/geolocation";
import { cacheSearchLocally, saveLocation } from "@/lib/storage";
import type { Platform, Zone } from "@/types";

type ZonesApiResponse = {
  zones?: Zone[];
  source?: "gemini" | "mock";
  reason?: string;
  error?: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  const handleUseCurrentLocation = async () => {
    setError("");
    setIsLocating(true);

    try {
      const area = await getCurrentAreaName();
      setLocation(area);
      saveLocation(area);
    } catch (err) {
      setError(getGeolocationErrorMessage(err));
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlatform && !location.trim()) {
      setError("Select your platform and enter your area");
      return;
    }
    if (!selectedPlatform) {
      setError("Tap your platform — Uber, Bolt, Deliveroo or Stuart");
      return;
    }
    if (!location.trim()) {
      setError("Enter your area or tap Use My Current Location");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          location: location.trim(),
        }),
      });

      const data = (await response.json()) as ZonesApiResponse | Zone[];
      const zones = Array.isArray(data) ? data : data.zones;
      const source = Array.isArray(data) ? "unknown" : data.source;
      const reason = Array.isArray(data) ? undefined : data.reason;

      if (!response.ok) {
        const errorMessage =
          !Array.isArray(data) && data.error
            ? data.error
            : "Failed to fetch zones";
        throw new Error(errorMessage);
      }

      if (!zones?.length) {
        throw new Error("No zones returned from API");
      }

      cacheSearchLocally({
        zones,
        platform: selectedPlatform,
        location: location.trim(),
        source: source ?? "unknown",
        sourceReason: reason,
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

  return (
    <OnboardingScreen
      error={error}
      isLoading={isLoading}
      isLocating={isLocating}
      location={location}
      onLocationChange={setLocation}
      onPlatformSelect={setSelectedPlatform}
      onSubmit={handleSubmit}
      onUseCurrentLocation={handleUseCurrentLocation}
      selectedPlatform={selectedPlatform}
    />
  );
}
