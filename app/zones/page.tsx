"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import BottomSheet from "@/components/BottomSheet";
import PaywallModal from "@/components/PaywallModal";
import ZoneCard from "@/components/ZoneCard";
import { useStoredZones } from "@/hooks/useStoredZones";
import {
  isGuestUser,
  isPaidSubscriber,
  loadLocation,
  setPaidSubscriber,
} from "@/lib/storage";

const DynamicZonesMap = dynamic(() => import("@/components/ZonesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm font-bold text-[#666666]">
      Loading London map...
    </div>
  ),
});

function ZonesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { zones, isReady, hasSearch } = useStoredZones();
  const [currentTime, setCurrentTime] = useState("");
  const [driverArea, setDriverArea] = useState("");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showGuestBanner, setShowGuestBanner] = useState(false);
  const [paywallReady, setPaywallReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!hasSearch) {
      router.replace("/onboarding");
    }
  }, [hasSearch, isReady, router]);

  useEffect(() => {
    setDriverArea(loadLocation());
  }, []);

  useEffect(() => {
    const paidParam = searchParams.get("paid");

    if (paidParam === "true") {
      setPaidSubscriber();
      setShowPaywall(false);
      setShowGuestBanner(false);
      router.replace("/zones");
      setPaywallReady(true);
      return;
    }

    if (isPaidSubscriber()) {
      setShowPaywall(false);
      setShowGuestBanner(false);
    } else if (isGuestUser()) {
      setShowPaywall(false);
      setShowGuestBanner(true);
    } else {
      setShowPaywall(true);
      setShowGuestBanner(false);
    }

    setPaywallReady(true);
  }, [searchParams, router]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const avgSurge = useMemo(() => {
    return zones.length
      ? zones.reduce((sum, zone) => sum + zone.surgeMultiplier, 0) / zones.length
      : 0;
  }, [zones]);

  const activeJobs = useMemo(() => {
    return zones.reduce((sum, zone) => sum + zone.activeJobs, 0);
  }, [zones]);

  const guestBanner = showGuestBanner ? (
    <div className="fixed left-0 right-0 top-0 z-[90] flex items-center justify-between gap-3 border-b border-[#E5E5E5] bg-[#F7F7F7] px-4 pb-2 pt-safe">
      <p className="text-xs font-bold text-black lg:text-sm">
        You&apos;re on the free preview — upgrade for full shift intelligence
      </p>
      <button
        className="shrink-0 text-xs font-bold text-black underline-offset-2 active:opacity-80"
        onClick={() => setShowPaywall(true)}
        type="button"
      >
        Upgrade →
      </button>
    </div>
  ) : null;

  const sheetHeader = (
    <div className="w-full text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.04em] text-black">
            Top zones now
          </h1>
          {driverArea && (
            <p className="mt-0.5 text-xs font-medium text-[#666666]">
              Near {driverArea}
            </p>
          )}
        </div>
        <Link
          className="shrink-0 rounded-md border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-bold text-black active:opacity-80"
          href="/onboarding"
        >
          New search
        </Link>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        <span className="shrink-0 rounded-md border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-bold text-black">
          Avg surge {avgSurge.toFixed(1)}x
        </span>
        <span className="shrink-0 rounded-md border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-bold text-black">
          {Math.round(activeJobs / 10) * 10}+ active jobs
        </span>
      </div>
    </div>
  );

  if (!isReady || !hasSearch || !paywallReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white text-sm font-bold text-[#666666]">
        Loading zones...
      </main>
    );
  }

  return (
    <AppLayout fullBleed hideNav={false}>
      {guestBanner}

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onGuestContinue={() => setShowGuestBanner(true)}
        />
      )}

      {/* Mobile: map-first + bottom sheet */}
      <div
        className={`relative h-dvh overflow-hidden lg:hidden ${showGuestBanner ? "pt-10" : ""}`}
      >
        <div className="absolute inset-0">
          <DynamicZonesMap
            interactive
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
            zones={zones}
          />
        </div>

        <div
          className={`absolute left-4 z-20 pt-3 ${showGuestBanner ? "top-10" : "top-safe"}`}
        >
          <div className="bolt-float-chip flex items-center gap-2 px-3 py-2 text-xs font-bold text-black">
            <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
            LIVE
          </div>
        </div>
        <div
          className={`absolute right-4 z-20 pt-3 ${showGuestBanner ? "top-10" : "top-safe"}`}
        >
          <div className="bolt-float-chip px-3 py-2 text-sm font-bold text-black">
            {currentTime}
          </div>
        </div>

        <BottomSheet header={sheetHeader}>
          <div className="space-y-3">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.name}
                onSelect={() => setSelectedZone(zone.name)}
                selected={selectedZone === zone.name}
                variant="row"
                zone={zone}
              />
            ))}
          </div>
        </BottomSheet>
      </div>

      {/* Desktop: professional split dashboard */}
      <div
        className={`hidden min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_420px] ${showGuestBanner ? "pt-10" : ""}`}
      >
        <div className="relative min-h-dvh">
          <DynamicZonesMap
            interactive
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
            zones={zones}
          />
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <div className="bolt-float-chip flex items-center gap-2 px-4 py-2 text-xs font-bold text-black">
              <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
              LIVE
            </div>
            <div className="bolt-float-chip px-4 py-2 text-sm font-bold text-black">
              {currentTime}
            </div>
          </div>
        </div>

        <aside className="flex min-h-dvh flex-col border-l border-[#E5E5E5] bg-[#F7F7F7]">
          <div className="border-b border-[#E5E5E5] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-black">
                  Top zones now
                </h1>
                {driverArea && (
                  <p className="mt-1 text-sm text-[#666666]">Near {driverArea}</p>
                )}
              </div>
              <Link
                className="shrink-0 rounded-md border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                href="/onboarding"
              >
                New search
              </Link>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-black">
                Avg surge {avgSurge.toFixed(1)}x
              </span>
              <span className="rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-black">
                {Math.round(activeJobs / 10) * 10}+ jobs
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6 no-scrollbar">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.name}
                onSelect={() => setSelectedZone(zone.name)}
                selected={selectedZone === zone.name}
                variant="card"
                zone={zone}
              />
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

export default function ZonesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-white text-sm font-bold text-[#666666]">
          Loading zones...
        </main>
      }
    >
      <ZonesPageContent />
    </Suspense>
  );
}
