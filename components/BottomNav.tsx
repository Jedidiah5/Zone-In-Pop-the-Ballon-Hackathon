"use client";

import { Clock, Map, PoundSterling, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

const ICONS = {
  clock: Clock,
  map: Map,
  pound: PoundSterling,
  user: User,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2 lg:hidden">
      <div className="bolt-float-chip mx-auto flex h-[4.25rem] max-w-lg items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/zones" && pathname.startsWith(item.href)) ||
            (item.href === "/zones" && pathname.startsWith("/zones"));
          const Icon = ICONS[item.icon];

          return (
            <Link
              key={item.href}
              className="flex min-h-[52px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 active:opacity-80"
              href={item.href}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-[#F5A623]/15" : ""
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={isActive ? "text-[#F5A623]" : "text-[#888888]"}
                  size={22}
                  strokeWidth={2.5}
                />
              </span>
              <span
                className={`text-[10px] font-bold ${
                  isActive ? "text-[#F5A623]" : "text-[#888888]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
