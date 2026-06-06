import { MOCK_ZONES } from "@/lib/mockZones";
import type { Platform, Zone } from "@/types";

const KEYS = {
  results: "zonein_results",
  platform: "zonein_platform",
  location: "zonein_location",
  source: "zonein_source",
  sourceReason: "zonein_source_reason",
  activeZone: "zonein_active_zone",
} as const;

export function loadZones(): Zone[] {
  if (typeof window === "undefined") {
    return MOCK_ZONES;
  }

  const stored = localStorage.getItem(KEYS.results);
  if (!stored) {
    return MOCK_ZONES;
  }

  try {
    const parsed = JSON.parse(stored) as Zone[];
    return parsed.length ? parsed : MOCK_ZONES;
  } catch {
    return MOCK_ZONES;
  }
}

export function saveZones(zones: Zone[]) {
  localStorage.setItem(KEYS.results, JSON.stringify(zones));
}

export function loadPlatform(): Platform | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(KEYS.platform) as Platform | null;
  return stored ?? null;
}

export function loadLocation(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(KEYS.location) ?? "";
}

export function saveLocation(location: string) {
  localStorage.setItem(KEYS.location, location.trim());
}

export function saveActiveZone(zoneName: string) {
  localStorage.setItem(KEYS.activeZone, zoneName);
}

export function loadActiveZone(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(KEYS.activeZone);
}

export function loadPreferredZones(): string[] {
  const zones = loadZones();
  return zones.slice(0, 5).map((zone) => zone.name);
}

export function clearSession() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function hasSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(KEYS.results));
}
