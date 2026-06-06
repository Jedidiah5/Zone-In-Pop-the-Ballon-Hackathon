import { Client } from "@mubit-ai/sdk";
import type { Zone } from "@/types";

let client: Client | null = null;

function getClient(): Client | null {
  const apiKey = process.env.MUBIT_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  if (!client) {
    client = new Client({
      apiKey,
      run_id: "zonein",
    });
  }

  return client;
}

function formatRecallResult(result: unknown): string | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  const record = result as Record<string, unknown>;

  if (typeof record.final_answer === "string" && record.final_answer.trim()) {
    return record.final_answer.trim();
  }

  if (typeof record.answer === "string" && record.answer.trim()) {
    return record.answer.trim();
  }

  return null;
}

export async function rememberDriverSession(
  driverId: string,
  platform: string,
  location: string,
  zones: Zone[]
) {
  const mubit = getClient();
  if (!mubit) {
    console.warn("[ZoneIn Mubit] MUBIT_API_KEY not configured — skipping remember");
    return;
  }

  const lesson = `Driver uses ${platform}. Started near ${location}. Top zones recommended: ${zones.map((z) => z.name).join(", ")}. Best zone was ${zones[0]?.name} with ${zones[0]?.surgeMultiplier}x surge.`;

  try {
    await mubit.remember({
      session_id: driverId,
      agent_id: driverId,
      content: lesson,
      intent: "lesson",
      lesson_scope: "global",
    });
    console.log("[ZoneIn Mubit] Session remembered for", driverId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn("[ZoneIn Mubit] remember failed:", message);
  }
}

export async function recallDriverHistory(
  driverId: string
): Promise<string | null> {
  const mubit = getClient();
  if (!mubit) {
    return null;
  }

  try {
    const memory = await mubit.recall({
      session_id: driverId,
      agent_id: driverId,
      query:
        "What platform does this driver use, where do they usually start, and which zones performed best for them?",
    });

    return formatRecallResult(memory);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn("[ZoneIn Mubit] recall failed:", message);
    return null;
  }
}
