import {
  loadActiveZone,
  loadShiftEarnings,
  saveShiftEarnings,
  type ShiftEarningsState,
} from "@/lib/storage";

const SHIFT_SESSION_KEY = "zonein_shift_session";

export type ShiftLogEntry = {
  id: string;
  timestamp: number;
  message: string;
};

export type ShiftSessionState = {
  active: boolean;
  startedAt: number | null;
  log: ShiftLogEntry[];
};

const EMPTY_SHIFT_SESSION: ShiftSessionState = {
  active: false,
  startedAt: null,
  log: [],
};

function createLogEntry(message: string): ShiftLogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    message,
  };
}

export function loadShiftSession(): ShiftSessionState {
  if (typeof window === "undefined") {
    return EMPTY_SHIFT_SESSION;
  }

  const stored = localStorage.getItem(SHIFT_SESSION_KEY);
  if (!stored) {
    return EMPTY_SHIFT_SESSION;
  }

  try {
    const parsed = JSON.parse(stored) as ShiftSessionState;
    return {
      active: Boolean(parsed.active),
      startedAt: parsed.startedAt ?? null,
      log: Array.isArray(parsed.log) ? parsed.log : [],
    };
  } catch {
    return EMPTY_SHIFT_SESSION;
  }
}

export function saveShiftSession(session: ShiftSessionState) {
  localStorage.setItem(SHIFT_SESSION_KEY, JSON.stringify(session));
}

export function isShiftActive(): boolean {
  return loadShiftSession().active;
}

export function getShiftElapsedSeconds(session = loadShiftSession()): number {
  if (!session.active || !session.startedAt) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000));
}

export function getTotalShiftMinutes(
  session = loadShiftSession(),
  earnings = loadShiftEarnings()
): number {
  const completedMinutes = earnings.minutesOnline;
  const activeMinutes = Math.floor(getShiftElapsedSeconds(session) / 60);
  return completedMinutes + activeMinutes;
}

export function formatShiftDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0 && seconds > 0) {
    return `${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}

export function formatShiftMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return "0m";
  }

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

function appendLogEntry(
  session: ShiftSessionState,
  message: string
): ShiftSessionState {
  return {
    ...session,
    log: [createLogEntry(message), ...session.log],
  };
}

export function startShift(options: {
  homeArea: string;
  activeZone: string | null;
}): ShiftSessionState {
  const existing = loadShiftSession();
  if (existing.active) {
    return existing;
  }

  const now = Date.now();
  let session: ShiftSessionState = {
    active: true,
    startedAt: now,
    log: [],
  };

  session = appendLogEntry(session, "Shift started");

  if (options.homeArea.trim()) {
    session = appendLogEntry(
      session,
      `Online near ${options.homeArea.trim()}`
    );
  }

  if (options.activeZone) {
    session = appendLogEntry(
      session,
      `Heading to ${options.activeZone}`
    );
  } else {
    session = appendLogEntry(
      session,
      "Pick a zone from Zones to start earning"
    );
  }

  saveShiftSession(session);
  return session;
}

export function endShift(): ShiftSessionState {
  const session = loadShiftSession();
  if (!session.active || !session.startedAt) {
    return session;
  }

  const sessionMinutes = Math.floor(getShiftElapsedSeconds(session) / 60);
  const earnings = loadShiftEarnings();

  let nextEarnings: ShiftEarningsState = {
    ...earnings,
    minutesOnline: earnings.minutesOnline + sessionMinutes,
  };

  if (sessionMinutes > 0) {
    const estimatedEarnings = Number((sessionMinutes * 0.45).toFixed(2));
    const activeZone = loadActiveZone();
    const byZone = [...nextEarnings.byZone];

    if (activeZone && estimatedEarnings > 0) {
      const zoneIndex = byZone.findIndex((entry) => entry.zone === activeZone);
      if (zoneIndex >= 0) {
        byZone[zoneIndex] = {
          ...byZone[zoneIndex],
          earnings: Number(
            (byZone[zoneIndex].earnings + estimatedEarnings).toFixed(2)
          ),
        };
      } else {
        byZone.push({ zone: activeZone, earnings: estimatedEarnings });
      }
    }

    const bestZone =
      byZone.length > 0
        ? byZone.reduce((best, current) =>
            current.earnings > best.earnings ? current : best
          ).zone
        : nextEarnings.bestZone;

    nextEarnings = {
      ...nextEarnings,
      totalEarnings: Number(
        (nextEarnings.totalEarnings + estimatedEarnings).toFixed(2)
      ),
      byZone,
      bestZone,
    };
  }

  saveShiftEarnings(nextEarnings);

  const endedSession: ShiftSessionState = {
    active: false,
    startedAt: null,
    log: [
      createLogEntry(
        sessionMinutes > 0
          ? `Shift ended · ${sessionMinutes}m online`
          : "Shift ended"
      ),
      ...session.log,
    ],
  };

  saveShiftSession(endedSession);
  return endedSession;
}

export function logShiftZoneChange(zoneName: string) {
  const session = loadShiftSession();
  if (!session.active) {
    return;
  }

  const latestZoneMessage = session.log.find((entry) =>
    entry.message.startsWith("Driving in ")
  )?.message;

  if (latestZoneMessage === `Driving in ${zoneName}`) {
    return;
  }

  saveShiftSession(
    appendLogEntry(session, `Driving in ${zoneName}`)
  );
}

export function formatLogTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
