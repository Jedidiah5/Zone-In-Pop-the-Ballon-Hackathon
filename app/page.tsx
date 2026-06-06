"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardingScreen from "@/components/OnboardingScreen";
import type { Platform } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedPlatform || !location.trim()) {
      setError("Please select a platform and enter your location");
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch zones");
      }

      localStorage.setItem("zonein_results", JSON.stringify(data));
      localStorage.setItem("zonein_platform", selectedPlatform);
      localStorage.setItem("zonein_location", location.trim());

      router.push("/zones");
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
      location={location}
      onLocationChange={setLocation}
      onPlatformSelect={setSelectedPlatform}
      onSubmit={handleSubmit}
      selectedPlatform={selectedPlatform}
    />
  );
}
