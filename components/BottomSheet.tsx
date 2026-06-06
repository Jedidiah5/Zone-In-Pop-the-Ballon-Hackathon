"use client";

import { ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

type BottomSheetProps = {
  children: ReactNode;
  header?: ReactNode;
  peekHeight?: string;
  className?: string;
};

const NAV_CLEARANCE = "calc(4.25rem + 0.5rem + env(safe-area-inset-bottom, 0px))";

export default function BottomSheet({
  children,
  header,
  peekHeight = "52dvh",
  className = "",
}: BottomSheetProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bolt-sheet fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-white transition-[height] duration-300 ease-out lg:hidden ${className}`}
      style={{
        height: expanded
          ? `calc(100dvh - env(safe-area-inset-top, 0px))`
          : peekHeight,
        paddingBottom: NAV_CLEARANCE,
      }}
    >
      <button
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse panel" : "Expand panel"}
        className="flex w-full shrink-0 touch-manipulation flex-col items-center gap-3 bg-white px-5 pb-2 pt-3"
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        <span className="bolt-sheet-handle" />
        {header}
        <ChevronUp
          aria-hidden="true"
          className={`text-[#666666] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 pb-4 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
