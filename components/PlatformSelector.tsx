"use client";

import type { Platform } from "@/types";
import PlatformIcon from "./PlatformIcon";

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
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Select platform">
      {PLATFORMS.map((platform) => {
        const isSelected = selected === platform.id;

        return (
          <button
            key={platform.id}
            aria-pressed={isSelected}
            className={`relative z-10 flex min-h-[76px] touch-manipulation cursor-pointer select-none flex-col justify-between rounded-xl border p-3 text-left transition-colors active:opacity-80 md:min-h-[72px] ${
              isSelected
                ? "border-[#F5A623] bg-[#F5A623]/10 ring-1 ring-[#F5A623]"
                : "border-[#222222] bg-[#141414]"
            }`}
            onClick={() => onSelect(platform.id)}
            type="button"
          >
            <span className="pointer-events-none">
              <PlatformIcon platform={platform.id} size={36} />
            </span>
            <span className="pointer-events-none text-lg font-bold text-white">
              {platform.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
