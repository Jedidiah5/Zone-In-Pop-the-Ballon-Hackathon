import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/types";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, platform, home_area, active_zone")
    .eq("id", user.id)
    .single();

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
  const updates: {
    platform?: Platform;
    home_area?: string;
    active_zone?: string;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (body.platform) {
    updates.platform = body.platform;
  }
  if (body.home_area !== undefined) {
    updates.home_area = body.home_area;
  }
  if (body.active_zone !== undefined) {
    updates.active_zone = body.active_zone;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
