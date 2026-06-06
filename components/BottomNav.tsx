"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import MaterialIcon from "./MaterialIcon";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-primary-container bg-primary px-container-padding pb-safe lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            className={`flex w-1/3 flex-col items-center justify-center pt-1 transition-all active:scale-95 ${
              isActive
                ? "border-t-2 border-secondary-container text-on-primary"
                : "text-on-primary/60 hover:text-on-primary"
            }`}
            href={item.href}
          >
            <MaterialIcon icon={item.icon} />
            <span className="mt-0.5 font-label-caps text-label-caps">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
