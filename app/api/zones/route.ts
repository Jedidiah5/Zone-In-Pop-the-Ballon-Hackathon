import { NextRequest, NextResponse } from "next/server";
import { getZoneRecommendations } from "@/lib/gemini";
import type { Platform } from "@/types";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const platform = body.platform as string | undefined;
    const location = body.location as string | undefined;

    if (!platform || !location) {
      return NextResponse.json(
        { error: "platform and location are required" },
        { status: 400 }
      );
    }

    const zones = await getZoneRecommendations(platform, location);
    return NextResponse.json(zones);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch zone recommendations";

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(message) }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const platform = request.nextUrl.searchParams.get("platform");
    const location = request.nextUrl.searchParams.get("location");

    if (!platform || !location) {
      return NextResponse.json(
        { error: "platform and location query parameters are required" },
        { status: 400 }
      );
    }

    const zones = await getZoneRecommendations(
      platform as Platform,
      location
    );
    return NextResponse.json(zones);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch zone recommendations";

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(message) }
    );
  }
}
