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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-[#222222] bg-[#0A0A0A] px-2 pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/zones" && pathname.startsWith(item.href)) ||
          (item.href === "/zones" && pathname.startsWith("/zones"));
        const Icon = ICONS[item.icon];

        return (
          <Link
            key={item.href}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-all active:scale-95"
            href={item.href}
          >
            <Icon
              aria-hidden="true"
              className={isActive ? "text-[#F5A623]" : "text-[#888888]"}
              size={22}
              strokeWidth={2.5}
            />
            <span className={isActive ? "text-[#F5A623]" : "text-[#888888]"}>
              {item.label}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-[#F5A623]" : "bg-transparent"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
