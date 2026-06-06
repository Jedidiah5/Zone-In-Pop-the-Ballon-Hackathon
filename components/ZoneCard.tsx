"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Zone } from "@/types";

type ZoneCardProps = {
  zone: Zone;
  id?: string;
  variant?: "card" | "row";
  onSelect?: () => void;
  selected?: boolean;
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
        className: "bg-black text-white border border-black",
      };
    case "medium":
      return {
        label: "MEDIUM",
        className: "bg-[#F0F0F0] text-black border border-[#CCCCCC]",
      };
    case "low":
      return {
        label: "LOW",
        className: "bg-white text-[#666666] border border-[#E5E5E5]",
      };
  }
}

export default function ZoneCard({
  zone,
  id,
  variant = "card",
  onSelect,
  selected = false,
}: ZoneCardProps) {
  const badge = getPotentialBadge(zone.potential);
  const href = `/zones/${getZoneSlug(zone.name)}`;

  if (variant === "row") {
    return (
      <Link
        className={`bolt-card flex touch-manipulation items-center gap-3 p-4 transition-colors active:opacity-90 ${
          selected ? "border-black bg-black/8" : ""
        }`}
        href={href}
        id={id ?? `zone-card-${getZoneSlug(zone.name)}`}
        onClick={onSelect}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-black">
              {zone.name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-[#666666]">
            {formatDistance(zone.distance)} · {zone.surgeMultiplier}x surge ·{" "}
            {zone.activeJobs} jobs
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-lg font-bold text-black">
            {zone.surgeMultiplier}x
          </span>
          <ChevronRight aria-hidden="true" className="text-[#999999]" size={18} />
        </div>
      </Link>
    );
  }

  return (
    <article
      className="bolt-card flex w-full flex-col gap-3 p-5 lg:max-w-none"
      id={id ?? `zone-card-${getZoneSlug(zone.name)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold leading-tight text-black">
          {zone.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#999999]">
        {formatDistance(zone.distance)}
      </p>

      <p className="text-sm leading-relaxed text-[#666666]">{zone.reasoning}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-[#E5E5E5] bg-white p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            Surge
          </p>
          <p className="text-2xl font-bold text-black">
            {zone.surgeMultiplier}x
          </p>
        </div>
        <div className="rounded-md border border-[#E5E5E5] bg-white p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            Jobs
          </p>
          <p className="text-2xl font-bold text-black">{zone.activeJobs}</p>
        </div>
      </div>

      <Link
        className="bolt-btn-primary touch-manipulation"
        href={href}
      >
        Head here →
      </Link>
    </article>
  );
}
