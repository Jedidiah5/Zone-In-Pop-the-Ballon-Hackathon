"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { MOCK_ZONES } from "@/lib/mockZones";
import type { Zone } from "@/types";

const ZONE_COORDINATES: Record<string, [number, number]> = {
  westminster: [-0.1343, 51.4975],
  camden: [-0.1426, 51.529],
  islington: [-0.1063, 51.5416],
  hackney: [-0.055, 51.545],
  shoreditch: [-0.0754, 51.5227],
  soho: [-0.1337, 51.5137],
  brixton: [-0.1132, 51.4613],
  "canary wharf": [-0.0235, 51.5054],
  "kings cross": [-0.124, 51.5308],
  greenwich: [0.0099, 51.4769],
};

function getZoneSlug(name: string) {
  return encodeURIComponent(
    name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
  );
}

function getPotentialStyles(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        badge: "border-[#00FF94] bg-[#00FF94]/10 text-[#00FF94]",
        label: "HIGH",
      };
    case "medium":
      return {
        badge: "border-[#F5A623] bg-[#F5A623]/10 text-[#F5A623]",
        label: "MEDIUM",
      };
    case "low":
      return {
        badge: "border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30]",
        label: "LOW",
      };
  }
}

function getZoneCoordinates(zoneName: string): [number, number] | null {
  const normalized = zoneName.toLowerCase();

  for (const [key, coords] of Object.entries(ZONE_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  return null;
}

function LondonZonesMap({ zones }: { zones: Zone[] }) {
  return (
    <Map
      initialViewState={{
        latitude: 51.5074,
        longitude: -0.1276,
        zoom: 10.5,
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      style={{ width: "100%", height: "50vh" }}
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      keyboard={false}
      doubleClickZoom={false}
      touchZoomRotate={false}
      attributionControl={false}
    >
      {zones.map((zone) => {
        const coords = getZoneCoordinates(zone.name);
        if (!coords) {
          return null;
        }

        const [longitude, latitude] = coords;

        if (zone.potential === "high") {
          return (
            <Marker
              anchor="top"
              key={zone.name}
              latitude={latitude}
              longitude={longitude}
            >
              <div className="flex flex-col items-center">
                <div className="pulse-marker" />
                <span className="mt-1 whitespace-nowrap text-[10px] font-bold text-white">
                  {zone.name}
                </span>
              </div>
            </Marker>
          );
        }

        if (zone.potential === "medium") {
          return (
            <Marker
              anchor="top"
              key={zone.name}
              latitude={latitude}
              longitude={longitude}
            >
              <div className="flex flex-col items-center">
                <div className="medium-marker" />
                <span className="mt-1 whitespace-nowrap text-[10px] font-bold text-[#F5A623]">
                  {zone.name}
                </span>
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            anchor="center"
            key={zone.name}
            latitude={latitude}
            longitude={longitude}
          >
            <div
              className="rounded-full bg-[#444444]"
              style={{ height: 10, width: 10 }}
            />
          </Marker>
        );
      })}
    </Map>
  );
}

const DynamicZonesMap = dynamic(() => Promise.resolve({ default: LondonZonesMap }), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
      Loading London demand map
    </div>
  ),
});

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES);
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

  const avgSurge = useMemo(() => {
    return zones.length
      ? zones.reduce((sum, zone) => sum + zone.surgeMultiplier, 0) / zones.length
      : 0;
  }, [zones]);

  const activeJobs = useMemo(() => {
    return zones.reduce((sum, zone) => sum + zone.activeJobs, 0);
  }, [zones]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-24 text-white">
      <section className="relative overflow-hidden border-b border-[#222222] bg-[#0A0A0A]">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#FF3B30]/40 bg-[#141414]/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#FF3B30]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF3B30]" />
          LIVE
        </div>
        <div className="absolute right-4 top-4 z-10 rounded-full border border-[#222222] bg-[#141414]/95 px-3 py-2 text-sm font-bold text-white">
          {currentTime}
        </div>

        <DynamicZonesMap zones={zones} />
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
