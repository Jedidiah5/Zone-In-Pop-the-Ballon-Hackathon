import { createClient } from "@/lib/supabase/client";
import {
  cacheSearchLocally,
  clearLocalSession,
  isOnboardingCompleted,
  loadFullName,
  loadLocation,
  loadShiftPreference,
  loadVehicleType,
  loadZones,
} from "@/lib/storage";
import type { Platform, ShiftPreference, UserProfile, VehicleType, Zone } from "@/types";

export type ZoneSearchRecord = {
  id: string;
  platform: string;
  location: string;
  source: string | null;
  source_reason: string | null;
  zones: Zone[];
  created_at: string;
};

const FULL_SELECT =
  "id, email, full_name, platform, home_area, active_zone, vehicle_type, shift_preference, onboarding_completed";

const LEGACY_SELECT = "id, email, platform, home_area, active_zone";

function isMissingColumnError(message: string) {
  return (
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

function mergeProfileWithLocal(
  data: Record<string, unknown> | null
): UserProfile | null {
  if (!data) return null;

  return {
    id: String(data.id),
    email: (data.email as string | null) ?? null,
    full_name:
      (data.full_name as string | null) ?? (loadFullName() || null),
    platform: (data.platform as Platform | null) ?? null,
    home_area:
      (data.home_area as string | null) ?? (loadLocation() || null),
    active_zone: (data.active_zone as string | null) ?? null,
    vehicle_type:
      (data.vehicle_type as VehicleType | null) ?? loadVehicleType(),
    shift_preference:
      (data.shift_preference as ShiftPreference | null) ??
      loadShiftPreference(),
    onboarding_completed:
      Boolean(data.onboarding_completed) || isOnboardingCompleted(),
  };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let { data, error } = await supabase
    .from("profiles")
    .select(FULL_SELECT)
    .eq("id", user.id)
    .single();

  if (error && isMissingColumnError(error.message)) {
    const legacy = await supabase
      .from("profiles")
      .select(LEGACY_SELECT)
      .eq("id", user.id)
      .single();

    if (legacy.error) {
      throw legacy.error;
    }

    return mergeProfileWithLocal(legacy.data as Record<string, unknown>);
  }

  if (error) {
    throw error;
  }

  return mergeProfileWithLocal(data as Record<string, unknown>);
}

export async function updateProfile(updates: {
  full_name?: string;
  platform?: Platform;
  home_area?: string;
  active_zone?: string;
  vehicle_type?: VehicleType;
  shift_preference?: ShiftPreference;
  onboarding_completed?: boolean;
}) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const body = (await response.json()) as { error?: string };
    throw new Error(body.error ?? "Failed to update profile");
  }
}

export async function getLatestZoneSearch(): Promise<ZoneSearchRecord | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("zone_searches")
    .select("id, platform, location, source, source_reason, zones, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    zones: data.zones as Zone[],
  };
}

export async function loadZonesWithSync(): Promise<Zone[]> {
  try {
    const latest = await getLatestZoneSearch();

    if (latest?.zones?.length) {
      cacheSearchLocally({
        zones: latest.zones,
        platform: latest.platform as Platform,
        location: latest.location,
        source: latest.source ?? "unknown",
        sourceReason: latest.source_reason ?? undefined,
      });
      return latest.zones;
    }
  } catch {
    // Fall back to local cache if Supabase is unavailable.
  }

  return loadZones();
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  clearLocalSession();
}
