import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Platform, Zone } from "@/types";

const PLATFORMS: Platform[] = ["uber", "bolt", "deliveroo", "stuart"];

// gemini-1.5-flash is retired; gemini-2.0-flash is the current equivalent
const GEMINI_MODEL = "gemini-2.0-flash";

const SYSTEM_PROMPT =
  "You are ZoneIn, an AI assistant for gig economy drivers in London. You analyse demand patterns, time of day, day of week, weather context, and local events to recommend the best zones for drivers to maximise their earnings right now. Always respond in valid JSON only, no markdown, no explanation.";

function isPlatform(value: string): value is Platform {
  return PLATFORMS.includes(value as Platform);
}

function buildUserPrompt(platform: Platform, location: string): string {
  const currentTime = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `A ${platform} driver is currently near ${location} in London. The current time is ${currentTime}. Recommend the top 3 zones they should drive to right now to maximise earnings. For each zone return: name, distance (e.g. 1.2 miles away), potential (high/medium/low), reasoning (one sentence max), surgeMultiplier (e.g. 1.8), activeJobs (estimated number). Return as a JSON array of 3 zone objects.`;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  return trimmed;
}

function isPotential(value: unknown): value is Zone["potential"] {
  return value === "high" || value === "medium" || value === "low";
}

function parseZone(value: unknown): Zone | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const zone = value as Record<string, unknown>;

  if (
    typeof zone.name !== "string" ||
    typeof zone.distance !== "string" ||
    !isPotential(zone.potential) ||
    typeof zone.reasoning !== "string" ||
    typeof zone.surgeMultiplier !== "number" ||
    typeof zone.activeJobs !== "number"
  ) {
    return null;
  }

  return {
    name: zone.name,
    distance: zone.distance,
    potential: zone.potential,
    reasoning: zone.reasoning,
    surgeMultiplier: zone.surgeMultiplier,
    activeJobs: zone.activeJobs,
  };
}

function parseZonesResponse(text: string): Zone[] {
  const jsonText = extractJson(text);
  const parsed: unknown = JSON.parse(jsonText);

  const rawZones = Array.isArray(parsed) ? parsed : null;
  if (!rawZones) {
    throw new Error("Gemini response was not a JSON array");
  }

  const zones = rawZones
    .map(parseZone)
    .filter((zone): zone is Zone => zone !== null);

  if (zones.length === 0) {
    throw new Error("Gemini response did not contain valid zone objects");
  }

  return zones;
}

export async function getZoneRecommendations(
  platform: string,
  location: string
): Promise<Zone[]> {
  if (!isPlatform(platform)) {
    throw new Error(
      `Invalid platform. Must be one of: ${PLATFORMS.join(", ")}`
    );
  }

  const trimmedLocation = location.trim();
  if (!trimmedLocation) {
    throw new Error("Location is required");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      buildUserPrompt(platform, trimmedLocation)
    );
    const text = result.response.text();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return parseZonesResponse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse Gemini response as JSON");
    }

    if (error instanceof Error) {
      const message = error.message;

      if (message.includes("429") || message.includes("Too Many Requests")) {
        throw new Error(
          "Gemini API rate limit exceeded. Wait a minute and try again, or check your quota at https://aistudio.google.com/"
        );
      }

      if (message.includes("404") || message.includes("not found")) {
        throw new Error(
          `Gemini model "${GEMINI_MODEL}" is unavailable. Check your API key and model access.`
        );
      }

      if (
        message.includes("API key not valid") ||
        message.includes("401") ||
        message.includes("403")
      ) {
        throw new Error(
          "Invalid Gemini API key. Create one at https://aistudio.google.com/apikey (starts with AIza) and add it to .env.local"
        );
      }

      throw error;
    }

    throw new Error("Failed to fetch zone recommendations from Gemini");
  }
}
