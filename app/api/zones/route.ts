import { NextRequest, NextResponse } from "next/server";
import { getZoneRecommendations } from "@/lib/gemini";
import { MOCK_ZONES } from "@/lib/mockZones";
import { createClient } from "@/lib/supabase/server";
import type { Platform, Zone } from "@/types";

function shouldUseMockFallback(message: string): boolean {
  return (
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("Too Many Requests") ||
    message.includes("expired") ||
    message.includes("invalid") ||
    message.includes("not configured") ||
    message.includes("valid zone objects") ||
    message.includes("parse Gemini response") ||
    message.includes("JSON array")
  );
}

function mockResponse(reason: string) {
  console.warn(`[ZoneIn API] Using mock data — ${reason}`);
  return NextResponse.json({ zones: MOCK_ZONES, source: "mock", reason });
}

function getErrorStatus(message: string): number {
  if (message.includes("Invalid platform") || message.includes("required")) {
    return 400;
  }

  if (message.includes("rate limit")) {
    return 429;
  }

  if (message.includes("Invalid Gemini API key")) {
    return 401;
  }

  return 500;
}

async function saveSearchToDatabase({
  userId,
  platform,
  location,
  zones,
  source,
  reason,
}: {
  userId: string;
  platform: string;
  location: string;
  zones: Zone[];
  source: string;
  reason?: string;
}) {
  const supabase = createClient();

  await supabase.from("zone_searches").insert({
    user_id: userId,
    platform,
    location,
    source,
    source_reason: reason ?? null,
    zones,
  });

  await supabase
    .from("profiles")
    .update({
      platform,
      home_area: location,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const platform = body.platform as string | undefined;
  const location = body.location as string | undefined;

  console.log("[ZoneIn API] POST /api/zones", {
    platform,
    location,
    user: user.id,
  });

  if (!platform || !location) {
    return NextResponse.json(
      { error: "platform and location are required" },
      { status: 400 }
    );
  }

  try {
    const zones = await getZoneRecommendations(platform, location);
    console.log("[ZoneIn API] Gemini success —", zones.length, "zones");

    await saveSearchToDatabase({
      userId: user.id,
      platform,
      location,
      zones,
      source: "gemini",
    });

    return NextResponse.json({ zones, source: "gemini" });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch zone recommendations";

    console.error("[ZoneIn API] Gemini error:", message);

    if (shouldUseMockFallback(message)) {
      try {
        await saveSearchToDatabase({
          userId: user.id,
          platform,
          location,
          zones: MOCK_ZONES,
          source: "mock",
          reason: message,
        });
      } catch {
        // Non-blocking if persistence fails during mock fallback.
      }

      return mockResponse(message);
    }

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(message) }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const platform = request.nextUrl.searchParams.get("platform");
  const location = request.nextUrl.searchParams.get("location");

  if (!platform || !location) {
    return NextResponse.json(
      { error: "platform and location query parameters are required" },
      { status: 400 }
    );
  }

  console.log("[ZoneIn API] GET /api/zones", { platform, location });

  try {
    const zones = await getZoneRecommendations(
      platform as Platform,
      location
    );
    console.log("[ZoneIn API] Gemini success —", zones.length, "zones");

    await saveSearchToDatabase({
      userId: user.id,
      platform,
      location,
      zones,
      source: "gemini",
    });

    return NextResponse.json({ zones, source: "gemini" });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch zone recommendations";

    console.error("[ZoneIn API] Gemini error:", message);

    if (shouldUseMockFallback(message)) {
      return mockResponse(message);
    }

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(message) }
    );
  }
}
