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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col border-r border-[#E5E5E5] bg-[#F7F7F7] lg:flex">
      <div className="flex h-[72px] items-center gap-2 border-b border-[#E5E5E5] px-6">
        <span className="text-2xl font-bold tracking-[-0.04em] text-black">
          ZoneIn<span className="text-black font-bold">.</span>
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
              className={`flex items-center gap-3 rounded-md px-4 py-3.5 text-sm font-bold transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-[#666666] hover:bg-[#F7F7F7] hover:text-black"
              }`}
              href={item.href}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E5E5] p-4">
        <div className="bolt-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666666]">
              Live market
            </span>
          </div>
          <p className="text-sm font-bold text-black">High demand in SE1</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            Updated 2m ago
          </p>
        </div>
      </div>
    </aside>
  );
}
