"use client";

import { useEffect, useState } from "react";
import { MOCK_ZONES } from "@/lib/mockZones";
import { loadZones } from "@/lib/storage";
import type { Zone } from "@/types";

export function useStoredZones() {
  const [zones, setZones] = useState<Zone[] | null>(null);

  useEffect(() => {
    setZones(loadZones());
  }, []);

  return {
    zones: zones ?? MOCK_ZONES,
    isReady: zones !== null,
  };
}
