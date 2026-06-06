"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getZoneCoordinates } from "@/lib/zoneCoordinates";
import type { Zone } from "@/types";

type ZonesMapProps = {
  zones: Zone[];
  className?: string;
  interactive?: boolean;
  selectedZone?: string | null;
  onZoneSelect?: (zoneName: string) => void;
};

export default function ZonesMap({
  zones,
  className = "h-full w-full",
  interactive = false,
  selectedZone = null,
  onZoneSelect,
}: ZonesMapProps) {
  return (
    <div className={className}>
      <Map
        attributionControl={false}
        doubleClickZoom={interactive}
        dragPan={interactive}
        dragRotate={false}
        initialViewState={{
          latitude: 51.5074,
          longitude: -0.1276,
          zoom: 10.5,
        }}
        keyboard={false}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        scrollZoom={interactive}
        style={{ width: "100%", height: "100%" }}
        touchZoomRotate={interactive}
      >
        {zones.map((zone) => {
          const coords = getZoneCoordinates(zone.name);
          if (!coords) {
            return null;
          }

          const [longitude, latitude] = coords;
          const isSelected = selectedZone === zone.name;

          if (zone.potential === "high") {
            return (
              <Marker
                anchor="top"
                key={zone.name}
                latitude={latitude}
                longitude={longitude}
              >
                <button
                  className="flex touch-manipulation flex-col items-center"
                  onClick={() => onZoneSelect?.(zone.name)}
                  type="button"
                >
                  <div
                    className={`pulse-marker ${isSelected ? "selected-marker" : ""}`}
                  />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-[#0A0A0A]/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {zone.name}
                  </span>
                </button>
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
                <button
                  className="flex touch-manipulation flex-col items-center"
                  onClick={() => onZoneSelect?.(zone.name)}
                  type="button"
                >
                  <div
                    className={`medium-marker ${isSelected ? "selected-marker" : ""}`}
                  />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-[#0A0A0A]/80 px-2 py-0.5 text-[10px] font-bold text-[#F5A623] backdrop-blur-sm">
                    {zone.name}
                  </span>
                </button>
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
              <button
                className="touch-manipulation"
                onClick={() => onZoneSelect?.(zone.name)}
                type="button"
              >
                <div
                  className={`rounded-full bg-[#444444] ${isSelected ? "selected-marker" : ""}`}
                  style={{ height: 10, width: 10 }}
                />
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
