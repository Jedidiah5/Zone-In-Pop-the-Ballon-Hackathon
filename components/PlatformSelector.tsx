"use client";

import type { Platform } from "@/types";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "uber", label: "Uber" },
  { id: "bolt", label: "Bolt" },
  { id: "deliveroo", label: "Deliveroo" },
  { id: "stuart", label: "Stuart" },
];

type PlatformSelectorProps = {
  selected: Platform | null;
  onSelect: (platform: Platform) => void;
};

export default function PlatformSelector({
  selected,
  onSelect,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-stack-gap">
      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">
        Select Platform
      </label>
      <div className="flex flex-wrap gap-2 lg:gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selected === platform.id;

          return (
            <button
              key={platform.id}
              className={`border px-4 py-2 font-label-caps text-label-caps transition-colors hover:bg-surface-container-low lg:px-5 lg:py-2.5 ${
                isSelected
                  ? "border-2 border-primary font-bold text-primary"
                  : "border border-outline-variant text-on-surface-variant"
              }`}
              onClick={() => onSelect(platform.id)}
              type="button"
            >
              {platform.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
