"use client";

import { useEffect, useState } from "react";
import { loadZonesWithSync } from "@/lib/database";
import { MOCK_ZONES } from "@/lib/mockZones";
import { hasSession } from "@/lib/storage";
import type { Zone } from "@/types";

export function useStoredZones() {
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [hasSearch, setHasSearch] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const loadedZones = await loadZonesWithSync();
        if (isMounted) {
          setZones(loadedZones);
          setHasSearch(hasSession());
        }
      } catch {
        if (isMounted) {
          setZones(MOCK_ZONES);
          setHasSearch(hasSession());
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    zones: zones ?? MOCK_ZONES,
    isReady: zones !== null,
    hasSearch,
  };
}
