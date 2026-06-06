"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import MaterialIcon from "./MaterialIcon";
import ZoneInLogo from "./ZoneInLogo";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-primary-container bg-primary lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <ZoneInLogo className="h-8 w-8 rounded-full" size={32} />
        <span className="font-headline-md-mobile text-headline-md-mobile font-bold tracking-tighter text-on-primary">
          ZoneIn
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-label-caps text-label-caps transition-colors ${
                isActive
                  ? "bg-on-primary text-primary"
                  : "text-on-primary/60 hover:bg-white/10 hover:text-on-primary"
              }`}
              href={item.href}
            >
              <MaterialIcon icon={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="font-label-caps text-[10px] uppercase text-on-primary/60">
              Live Market
            </span>
          </div>
          <p className="font-status-sm text-status-sm text-on-primary">
            High demand in SE1
          </p>
          <p className="mt-1 font-label-caps text-[10px] uppercase text-on-primary/60">
            Updated 2m ago
          </p>
        </div>
      </div>
    </aside>
  );
}
