import { MOCK_ZONES } from "@/lib/mockZones";
import type { Platform, ShiftPreference, VehicleType, Zone } from "@/types";

const KEYS = {
  results: "zonein_results",
  platform: "zonein_platform",
  location: "zonein_location",
  source: "zonein_source",
  sourceReason: "zonein_source_reason",
  activeZone: "zonein_active_zone",
  fullName: "zonein_full_name",
  vehicleType: "zonein_vehicle_type",
  shiftPreference: "zonein_shift_preference",
  onboardingCompleted: "zonein_onboarding_completed",
} as const;

type SearchCache = {
  zones: Zone[];
  platform: Platform;
  location: string;
  source: string;
  sourceReason?: string;
};

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

export function cacheSearchLocally({
  zones,
  platform,
  location,
  source,
  sourceReason,
}: SearchCache) {
  localStorage.setItem(KEYS.results, JSON.stringify(zones));
  localStorage.setItem(KEYS.platform, platform);
  localStorage.setItem(KEYS.location, location);
  localStorage.setItem(KEYS.source, source);
  if (sourceReason) {
    localStorage.setItem(KEYS.sourceReason, sourceReason);
  } else {
    localStorage.removeItem(KEYS.sourceReason);
  }
}

export function saveDriverExtras(extras: {
  fullName?: string;
  vehicleType?: VehicleType;
  shiftPreference?: ShiftPreference;
  onboardingCompleted?: boolean;
}) {
  if (extras.fullName !== undefined) {
    localStorage.setItem(KEYS.fullName, extras.fullName);
  }
  if (extras.vehicleType !== undefined) {
    localStorage.setItem(KEYS.vehicleType, extras.vehicleType);
  }
  if (extras.shiftPreference !== undefined) {
    localStorage.setItem(KEYS.shiftPreference, extras.shiftPreference);
  }
  if (extras.onboardingCompleted !== undefined) {
    localStorage.setItem(
      KEYS.onboardingCompleted,
      extras.onboardingCompleted ? "true" : "false"
    );
  }
}

export function loadFullName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.fullName) ?? "";
}

export function loadVehicleType(): VehicleType | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(KEYS.vehicleType) as VehicleType | null;
  return value ?? null;
}

export function loadShiftPreference(): ShiftPreference | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(
    KEYS.shiftPreference
  ) as ShiftPreference | null;
  return value ?? null;
}

export function isOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.onboardingCompleted) === "true";
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

export function clearLocalSession() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function clearSession() {
  clearLocalSession();
}

export function hasSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(KEYS.results));
}
