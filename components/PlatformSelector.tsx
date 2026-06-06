"use client";

import type { Platform } from "@/types";

const PLATFORMS: { id: Platform; label: string; dotClass: string }[] = [
  { id: "uber", label: "Uber", dotClass: "bg-black border border-[#333333]" },
  { id: "bolt", label: "Bolt", dotClass: "bg-[#00FF94]" },
  { id: "deliveroo", label: "Deliveroo", dotClass: "bg-[#00C2B8]" },
  { id: "stuart", label: "Stuart", dotClass: "bg-[#7B61FF]" },
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
    <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selected === platform.id;

          return (
            <button
              key={platform.id}
              className={`flex h-24 flex-col justify-between rounded-xl border p-4 text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-[#F5A623] bg-[#F5A623]/10"
                  : "border-[#222222] bg-[#141414] hover:border-[#333333]"
              }`}
              onClick={() => onSelect(platform.id)}
              type="button"
            >
              <span className={`h-3 w-3 rounded-full ${platform.dotClass}`} />
              <span className="text-lg font-bold text-white">{platform.label}</span>
            </button>
          );
        })}
    </div>
  );
}
