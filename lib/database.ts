import { createClient } from "@/lib/supabase/client";
import {
  cacheSearchLocally,
  clearLocalSession,
  loadZones,
} from "@/lib/storage";
import type { Platform, Zone } from "@/types";

export type UserProfile = {
  id: string;
  email: string | null;
  platform: Platform | null;
  home_area: string | null;
  active_zone: string | null;
};

export type ZoneSearchRecord = {
  id: string;
  platform: string;
  location: string;
  source: string | null;
  source_reason: string | null;
  zones: Zone[];
  created_at: string;
};

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

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, platform, home_area, active_zone")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
}

export async function updateProfile(updates: {
  platform?: Platform;
  home_area?: string;
  active_zone?: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw error;
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
