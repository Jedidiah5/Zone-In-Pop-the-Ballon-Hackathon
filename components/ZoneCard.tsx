"use client";

import type { Zone } from "@/types";
import MaterialIcon from "./MaterialIcon";

type ZoneCardProps = {
  zone: Zone;
};

function getPotentialConfig(potential: Zone["potential"]) {
  switch (potential) {
    case "high":
      return {
        label: "HIGH POTENTIAL",
        dotClass: "bg-secondary-container animate-pulse",
        textClass: "text-primary",
      };
    case "medium":
      return {
        label: "MEDIUM",
        dotClass: "bg-outline",
        textClass: "text-outline",
      };
    case "low":
      return {
        label: "LOW",
        dotClass: "bg-outline-variant",
        textClass: "text-outline",
      };
  }
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  const potential = getPotentialConfig(zone.potential);

  return (
    <div className="border border-outline-variant bg-surface-container-lowest p-4 transition-all active:scale-[0.98] lg:p-5 lg:hover:border-primary/30 lg:hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <MaterialIcon className="text-[20px] text-primary" icon="explore" />
            <h3 className="font-headline-md-mobile text-headline-md-mobile font-bold text-primary lg:font-headline-md lg:text-headline-md">
              {zone.name}
            </h3>
          </div>
          <p className="font-label-caps text-label-caps text-outline">
            {zone.distance}
          </p>
        </div>
        <div className="flex items-center gap-2 border border-outline-variant bg-surface-container px-2 py-1">
          <span className={`h-2 w-2 rounded-full ${potential.dotClass}`} />
          <span
            className={`font-label-caps text-label-caps ${potential.textClass}`}
          >
            {potential.label}
          </span>
        </div>
      </div>
      <div className="mb-3 h-px w-full bg-outline-variant" />
      <div className="flex items-start gap-2">
        <MaterialIcon className="text-[18px] text-outline" icon="auto_awesome" />
        <p className="font-body-md text-sm leading-snug text-on-surface-variant lg:text-base">
          {zone.reasoning}
        </p>
      </div>
    </div>
  );
}
