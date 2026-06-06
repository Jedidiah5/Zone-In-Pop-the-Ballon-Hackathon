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

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col border-r border-[#2A2A2A] bg-[#111111] lg:flex">
      <div className="flex h-[72px] items-center gap-2 border-b border-[#2A2A2A] px-6">
        <span className="text-2xl font-bold tracking-[-0.04em] text-white">
          ZoneIn<span className="text-[#F5A623]">.</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/zones" && pathname.startsWith(item.href)) ||
            (item.href === "/zones" && pathname.startsWith("/zones"));
          const Icon = ICONS[item.icon];

          return (
            <Link
              key={item.href}
              className={`flex items-center gap-3 rounded-[14px] px-4 py-3.5 text-sm font-bold transition-colors ${
                isActive
                  ? "bg-[#F5A623] text-[#0A0A0A]"
                  : "text-[#888888] hover:bg-[#1A1A1A] hover:text-white"
              }`}
              href={item.href}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#2A2A2A] p-4">
        <div className="bolt-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF94]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Live market
            </span>
          </div>
          <p className="text-sm font-bold text-white">High demand in SE1</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#555555]">
            Updated 2m ago
          </p>
        </div>
      </div>
    </aside>
  );
}
