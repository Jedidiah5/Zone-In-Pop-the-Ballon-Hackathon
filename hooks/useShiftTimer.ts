"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getShiftElapsedSeconds,
  getTotalShiftMinutes,
  loadShiftSession,
  type ShiftSessionState,
} from "@/lib/shift";
import { loadShiftEarnings } from "@/lib/storage";

export function useShiftTimer() {
  const [session, setSession] = useState<ShiftSessionState>(() =>
    loadShiftSession()
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const refresh = useCallback(() => {
    const nextSession = loadShiftSession();
    setSession(nextSession);
    setElapsedSeconds(getShiftElapsedSeconds(nextSession));
    setTotalMinutes(getTotalShiftMinutes(nextSession, loadShiftEarnings()));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!session.active || !session.startedAt) {
      setElapsedSeconds(0);
      setTotalMinutes(loadShiftEarnings().minutesOnline);
      return;
    }

    const tick = () => {
      const nextSession = loadShiftSession();
      setElapsedSeconds(getShiftElapsedSeconds(nextSession));
      setTotalMinutes(
        getTotalShiftMinutes(nextSession, loadShiftEarnings())
      );
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [session.active, session.startedAt]);

  return {
    session,
    setSession,
    elapsedSeconds,
    totalMinutes,
    refresh,
  };
}
