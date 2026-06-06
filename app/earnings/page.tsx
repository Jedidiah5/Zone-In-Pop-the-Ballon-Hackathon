"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BottomNav from "@/components/BottomNav";
import { useStoredZones } from "@/hooks/useStoredZones";

export default function EarningsPage() {
  const router = useRouter();
  const { zones, isReady } = useStoredZones();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const earningsData = useMemo(() => {
    return zones.slice(0, 5).map((zone) => ({
      zone: zone.name.split(" ")[0],
      earnings: Number((zone.surgeMultiplier * zone.activeJobs * 0.02).toFixed(1)),
    }));
  }, [zones]);

  const totalEarnings = useMemo(() => {
    return earningsData.reduce((sum, item) => sum + item.earnings, 0);
  }, [earningsData]);

  const bestZone = zones[0]?.name ?? "—";

  if (!isReady) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold uppercase tracking-[0.14em] text-[#888888]">
        Loading earnings...
      </main>
    );
  }

  return (
    <main className="bg-[#0A0A0A] pb-28 pt-safe text-white">
      <div className="page-shell-wide">
        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-[-0.05em] text-white">
          Today&apos;s Shift
        </h1>

        <section className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Time Online
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-white">
              2h 34m
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Est. Earnings
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-[#F5A623]">
              £{totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Best Zone
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-[#00FF94]">
              {bestZone}
            </p>
          </div>
        </section>

        <section className="mb-5 rounded-xl border border-[#222222] bg-[#141414] p-4">
          <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] text-white">
            Earnings by Zone
          </h2>
          <div className="h-52 min-h-52 md:h-56">
            {isMounted ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid stroke="#222222" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="zone"
                    tick={{ fill: "#888888", fontSize: 11, fontWeight: 700 }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: "#888888", fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(value) => `£${value}`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#141414",
                      border: "1px solid #222222",
                      borderRadius: 12,
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                    cursor={{ fill: "#F5A623", opacity: 0.08 }}
                    formatter={(value) => [`£${value}`, "Earned"]}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#F5A623"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-lg border border-[#222222] bg-[#0A0A0A]" />
            )}
          </div>
        </section>

        <button
          className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.12em] text-[#0A0A0A] active:opacity-80"
          onClick={() => router.push("/shift")}
          type="button"
        >
          Start new shift
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
