"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { MOCK_ZONES } from "@/lib/mockZones";
import type { Zone } from "@/types";

const GEO_URL =
  "https://raw.githubusercontent.com/radoi90/housequest-data/master/london_boroughs.geojson";

type TooltipState = {
  name: string;
  x: number;
  y: number;
} | null;

function getZoneSlug(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-"));
}

function getPotentialStyles(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        badge: "border-[#00FF94] bg-[#00FF94]/10 text-[#00FF94]",
        mapFill: "#00FF94",
        mapOpacity: 0.8,
        label: "HIGH",
      };
    case "medium":
      return {
        badge: "border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623]",
        mapFill: "#F5A623",
        mapOpacity: 0.6,
        label: "MEDIUM",
      };
    case "low":
      return {
        badge: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",
        mapFill: "#222222",
        mapOpacity: 1,
        label: "LOW",
      };
  }
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES);
  const [geoData, setGeoData] = useState<object | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("zonein_results");

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Zone[];
        if (parsed.length) {
          setZones(parsed);
        }
      } catch {
        setZones(MOCK_ZONES);
      }
    }
  }, []);

  useEffect(() => {
    async function loadMap() {
      const response = await fetch(GEO_URL);
      const data = (await response.json()) as object;
      setGeoData(data);
    }

    loadMap().catch(() => setGeoData(null));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const zonesByName = useMemo(() => {
    return new Map(zones.map((zone) => [zone.name.toLowerCase(), zone]));
  }, [zones]);

  const avgSurge = useMemo(() => {
    return zones.length
      ? zones.reduce((sum, zone) => sum + zone.surgeMultiplier, 0) / zones.length
      : 0;
  }, [zones]);

  const activeJobs = useMemo(() => {
    return zones.reduce((sum, zone) => sum + zone.activeJobs, 0);
  }, [zones]);

  const scrollToZone = (name: string) => {
    document
      .getElementById(`zone-card-${getZoneSlug(name)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-24 text-white">
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden border-b border-[#222222] bg-[#0A0A0A]">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#FF3B30]/40 bg-[#141414]/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#FF3B30]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF3B30]" />
          LIVE
        </div>
        <div className="absolute right-4 top-4 z-10 rounded-full border border-[#222222] bg-[#141414]/95 px-3 py-2 text-sm font-bold text-white">
          {currentTime}
        </div>

        {geoData ? (
          <ComposableMap
            className="h-full w-full"
            height={520}
            projection="geoMercator"
            projectionConfig={{ center: [-0.12, 51.5], scale: 42000 }}
            width={720}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const boroughName = String(geo.properties.name ?? "");
                  const zone = zonesByName.get(boroughName.toLowerCase());
                  const styles = zone ? getPotentialStyles(zone.potential) : null;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => scrollToZone(boroughName)}
                      onMouseLeave={() => setTooltip(null)}
                      onMouseMove={(event) =>
                        setTooltip({
                          name: boroughName,
                          x: event.clientX,
                          y: event.clientY,
                        })
                      }
                      style={{
                        default: {
                          fill: styles?.mapFill ?? "#222222",
                          fillOpacity: styles?.mapOpacity ?? 1,
                          outline: "none",
                          stroke: "#0A0A0A",
                          strokeWidth: 0.7,
                        },
                        hover: {
                          fill: styles?.mapFill ?? "#333333",
                          fillOpacity: 1,
                          outline: "none",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.8,
                        },
                        pressed: {
                          fill: "#F5A623",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
            Loading London demand map
          </div>
        )}

        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-[#222222] bg-[#141414] px-3 py-2 text-xs font-bold text-white"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            {tooltip.name}
          </div>
        )}
      </section>

      <section className="px-5 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-white">
              Top Zones Now
            </h1>
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00FF94]" />
          </div>

          <div className="mb-6 flex gap-3">
            <div className="rounded-full border border-[#222222] bg-[#141414] px-4 py-2 text-sm font-bold text-[#F5A623]">
              Avg Surge: {avgSurge.toFixed(1)}x
            </div>
            <div className="rounded-full border border-[#222222] bg-[#141414] px-4 py-2 text-sm font-bold text-[#F5A623]">
              Active Jobs: {Math.round(activeJobs / 10) * 10}+
            </div>
          </div>

          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {zones.map((zone) => {
              const styles = getPotentialStyles(zone.potential);

              return (
                <article
                  className="min-w-[280px] snap-center rounded-xl border border-[#222222] bg-[#141414] p-4"
                  id={`zone-card-${getZoneSlug(zone.name)}`}
                  key={zone.name}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-[-0.04em] text-white">
                      {zone.name}
                    </h2>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles.badge}`}
                    >
                      {styles.label}
                    </span>
                  </div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
                    {zone.distance}
                  </p>
                  <div className="mb-4 h-px bg-[#222222]" />
                  <p className="mb-4 text-sm italic leading-5 text-[#888888]">
                    {zone.reasoning}
                  </p>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#222222] bg-[#0A0A0A] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                        Surge
                      </p>
                      <p className="text-2xl font-bold text-[#F5A623]">
                        {zone.surgeMultiplier}x
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#222222] bg-[#0A0A0A] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888888]">
                        Jobs
                      </p>
                      <p className="text-2xl font-bold text-[#F5A623]">
                        {zone.activeJobs}
                      </p>
                    </div>
                  </div>
                  <Link
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.1em] text-[#0A0A0A] active:scale-[0.98]"
                    href={`/zones/${getZoneSlug(zone.name)}`}
                  >
                    HEAD HERE →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
