"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getZoneCoordinates } from "@/lib/zoneCoordinates";
import type { Zone } from "@/types";

type ZonesMapProps = {
  zones: Zone[];
};

export default function ZonesMap({ zones }: ZonesMapProps) {
  return (
    <div className="h-[36dvh] min-h-[220px] w-full md:h-[260px] lg:h-[280px]">
    <Map
      initialViewState={{
        latitude: 51.5074,
        longitude: -0.1276,
        zoom: 10.5,
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      style={{ width: "100%", height: "100%" }}
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
              <div className="pointer-events-none flex flex-col items-center">
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
              <div className="pointer-events-none flex flex-col items-center">
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
              className="pointer-events-none rounded-full bg-[#444444]"
              style={{ height: 10, width: 10 }}
            />
          </Marker>
        );
      })}
    </Map>
    </div>
  );
}
