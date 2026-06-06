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
        textClass: "text-on-primary",
      };
    case "medium":
      return {
        label: "MEDIUM",
        dotClass: "bg-on-primary/40",
        textClass: "text-on-primary/60",
      };
    case "low":
      return {
        label: "LOW",
        dotClass: "bg-on-primary/30",
        textClass: "text-on-primary/50",
      };
  }
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  const potential = getPotentialConfig(zone.potential);

  return (
    <div className="border border-white/10 bg-white/5 p-4 transition-all active:scale-[0.98] lg:p-5 lg:hover:border-white/20 lg:hover:bg-white/[0.08]">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <MaterialIcon className="text-[20px] text-on-primary" icon="explore" />
            <h3 className="font-headline-md-mobile text-headline-md-mobile font-bold text-on-primary lg:font-headline-md lg:text-headline-md">
              {zone.name}
            </h3>
          </div>
          <p className="font-label-caps text-label-caps text-on-primary/50">
            {zone.distance}
          </p>
        </div>
        <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-2 py-1">
          <span className={`h-2 w-2 rounded-full ${potential.dotClass}`} />
          <span
            className={`font-label-caps text-label-caps ${potential.textClass}`}
          >
            {potential.label}
          </span>
        </div>
      </div>

      <div className="mb-3 h-px w-full bg-white/10" />

      <div className="mb-4 flex items-start gap-2">
        <MaterialIcon className="text-[18px] text-on-primary/40" icon="auto_awesome" />
        <p className="font-body-md text-sm leading-snug text-on-primary/60">
          {zone.reasoning}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border border-white/10 bg-white/5 px-3 py-2">
          <p className="font-label-caps text-[10px] uppercase text-on-primary/50">
            Surge
          </p>
          <p className="font-status-sm text-status-sm font-bold text-on-primary">
            {zone.surgeMultiplier}x
          </p>
        </div>
        <div className="border border-white/10 bg-white/5 px-3 py-2">
          <p className="font-label-caps text-[10px] uppercase text-on-primary/50">
            Active Jobs
          </p>
          <p className="font-status-sm text-status-sm font-bold text-on-primary">
            {zone.activeJobs}
          </p>
        </div>
      </div>
    </div>
  );
}
