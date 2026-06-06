"use client";

import BottomNav from "@/components/BottomNav";
import SidebarNav from "@/components/SidebarNav";

type AppLayoutProps = {
  children: React.ReactNode;
  fullBleed?: boolean;
  hideNav?: boolean;
};

export default function AppLayout({
  children,
  fullBleed = false,
  hideNav = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <SidebarNav />
      <div
        className={`lg:ml-[280px] ${fullBleed ? "min-h-dvh" : "pb-24 pt-safe lg:pb-8 lg:pt-0"}`}
      >
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
