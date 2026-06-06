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
import AppLayout from "@/components/AppLayout";
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
      <main className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] text-sm font-bold text-[#888888]">
        Loading earnings...
      </main>
    );
  }

  return (
    <AppLayout>
      <div className="page-shell-wide py-6 lg:max-w-none lg:py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
          Today&apos;s shift
        </h1>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Time online
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em]">2h 34m</p>
          </div>
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Est. earnings
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-[#F5A623]">
              £{totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#888888]">
              Best zone
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-[#00FF94]">
              {bestZone}
            </p>
          </div>
        </section>

        <section className="bolt-card mb-6 p-5 lg:p-6">
          <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] lg:text-xl">
            Earnings by zone
          </h2>
          <div className="h-52 min-h-52 lg:h-64">
            {isMounted ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid stroke="#2A2A2A" vertical={false} />
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
                      background: "#1A1A1A",
                      border: "1px solid #2A2A2A",
                      borderRadius: 14,
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                    cursor={{ fill: "#F5A623", opacity: 0.08 }}
                    formatter={(value) => [`£${value}`, "Earned"]}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#F5A623"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-[14px] border border-[#2A2A2A] bg-[#0A0A0A]" />
            )}
          </div>
        </section>

        <button
          className="bolt-btn-primary max-w-md"
          onClick={() => router.push("/shift")}
          type="button"
        >
          Start new shift
        </button>
      </div>
    </AppLayout>
  );
}
