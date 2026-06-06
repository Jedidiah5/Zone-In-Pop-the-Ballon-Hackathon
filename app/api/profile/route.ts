import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Platform, ShiftPreference, VehicleType } from "@/types";

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

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    data = legacy.data
      ? {
          ...legacy.data,
          full_name: null,
          vehicle_type: null,
          shift_preference: null,
          onboarding_completed: false,
        }
      : null;
    error = legacy.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    profile: data,
    email: user.email,
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
    });

    if (insertError && !insertError.message.includes("duplicate")) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  const fullUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.full_name !== undefined) fullUpdates.full_name = body.full_name;
  if (body.platform) fullUpdates.platform = body.platform as Platform;
  if (body.home_area !== undefined) fullUpdates.home_area = body.home_area;
  if (body.active_zone !== undefined) fullUpdates.active_zone = body.active_zone;
  if (body.vehicle_type) {
    fullUpdates.vehicle_type = body.vehicle_type as VehicleType;
  }
  if (body.shift_preference) {
    fullUpdates.shift_preference = body.shift_preference as ShiftPreference;
  }
  if (body.onboarding_completed !== undefined) {
    fullUpdates.onboarding_completed = Boolean(body.onboarding_completed);
  }

  let { error } = await supabase
    .from("profiles")
    .update(fullUpdates)
    .eq("id", user.id);

  if (error && isMissingColumnError(error.message)) {
    const legacyUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.platform) legacyUpdates.platform = body.platform as Platform;
    if (body.home_area !== undefined) legacyUpdates.home_area = body.home_area;
    if (body.active_zone !== undefined) {
      legacyUpdates.active_zone = body.active_zone;
    }

    const legacyResult = await supabase
      .from("profiles")
      .update(legacyUpdates)
      .eq("id", user.id);

    if (legacyResult.error) {
      return NextResponse.json(
        { error: legacyResult.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      partial: true,
      warning:
        "Profile saved partially. Run supabase/migration_onboarding_fields.sql in Supabase to enable all fields.",
    });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
