"use client";

import Link from "next/link";
import type { Zone } from "@/types";

type ZoneCardProps = {
  zone: Zone;
  id?: string;
};

function getZoneSlug(name: string) {
  return encodeURIComponent(
    name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
  );
}

function formatDistance(distance: string) {
  return distance.replace(/miles/gi, "MI");
}

function getPotentialBadge(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        label: "HIGH",
        className: "bg-[#00FF94] text-[#000000] border border-[#00FF94]",
      };
    case "medium":
      return {
        label: "MEDIUM",
        className: "bg-transparent text-[#F5A623] border border-[#F5A623]",
      };
    case "low":
      return {
        label: "LOW",
        className: "bg-transparent text-[#FF3B30] border border-[#FF3B30]",
      };
  }
}

export default function ZoneCard({ zone, id }: ZoneCardProps) {
  const badge = getPotentialBadge(zone.potential);

  return (
    <article
      className="flex w-[260px] flex-col gap-[10px] rounded-lg border border-[#2A2A2A] bg-[#111111] px-4 pb-3 pt-4"
      id={id ?? `zone-card-${getZoneSlug(zone.name)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[22px] font-bold leading-tight text-white">
          {zone.name}
        </h3>
        <span
          className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#555555]">
        {formatDistance(zone.distance)}
      </p>

      <div className="h-px w-full bg-[#1E1E1E]" />

      <p className="text-[13px] leading-[1.5] text-[#888888]">
        {zone.reasoning}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555]">
            SURGE
          </p>
          <p className="text-2xl font-bold text-[#F5A623]">
            {zone.surgeMultiplier}x
          </p>
        </div>
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#555555]">
            JOBS
          </p>
          <p className="text-2xl font-bold text-[#00FF94]">{zone.activeJobs}</p>
        </div>
      </div>

      <Link
        className="flex h-11 w-full touch-manipulation items-center justify-center rounded-md bg-[#F5A623] text-sm font-bold uppercase tracking-[1px] text-[#000000] active:opacity-90"
        href={`/zones/${getZoneSlug(zone.name)}`}
      >
        HEAD HERE →
      </Link>
    </article>
  );
}
