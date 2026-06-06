"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useShiftTimer } from "@/hooks/useShiftTimer";
import {
  formatShiftMinutes,
  isShiftActive,
  startShift,
} from "@/lib/shift";
import {
  loadActiveZone,
  loadLocation,
  loadShiftEarnings,
} from "@/lib/storage";

export default function EarningsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [shiftEarnings, setShiftEarnings] = useState(() => loadShiftEarnings());
  const { totalMinutes, session } = useShiftTimer();

  useEffect(() => {
    setIsMounted(true);
    setShiftEarnings(loadShiftEarnings());
  }, [totalMinutes, session.active]);

  const { totalEarnings, bestZone, byZone } = shiftEarnings;
  const earningsData = byZone;
  const hasEarnings = totalEarnings > 0 || byZone.length > 0;
  const shiftIsActive = session.active;
  const timeOnlineLabel = formatShiftMinutes(totalMinutes);

  const handleShiftAction = () => {
    if (shiftIsActive) {
      router.push("/shift");
      return;
    }

    startShift({
      homeArea: loadLocation(),
      activeZone: loadActiveZone(),
    });
    router.push("/shift");
  };

  return (
    <AppLayout>
      <div className="page-shell-wide py-6 lg:max-w-none lg:py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
          Today&apos;s shift
        </h1>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
              Time online
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em]">
              {totalMinutes === 0 ? "0m" : timeOnlineLabel}
            </p>
          </div>
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
              Est. earnings
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-black">
              £{totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bolt-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">
              Best zone
            </p>
            <p className="text-3xl font-bold tracking-[-0.06em] text-black">
              {bestZone ?? "—"}
            </p>
          </div>
        </section>

        <section className="bolt-card mb-6 p-5 lg:p-6">
          <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] lg:text-xl">
            Earnings by zone
          </h2>
          <div className="h-52 min-h-52 lg:h-64">
            {isMounted && hasEarnings ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid stroke="#E5E5E5" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="zone"
                    tick={{ fill: "#666666", fontSize: 11, fontWeight: 700 }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: "#666666", fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(value) => `£${value}`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E5E5",
                      borderRadius: 6,
                      color: "#000000",
                      fontWeight: 700,
                    }}
                    cursor={{ fill: "#000000", opacity: 0.06 }}
                    formatter={(value) => [`£${value}`, "Earned"]}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#000000"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F7] px-6 text-center">
                <p className="text-sm font-bold text-black">No earnings yet</p>
                <p className="mt-1 text-xs text-[#666666]">
                  {shiftIsActive || isShiftActive()
                    ? "Finish your shift to see estimated earnings here."
                    : "Start a shift to track your time and earnings here."}
                </p>
              </div>
            )}
          </div>
        </section>

        <button
          className="bolt-btn-primary max-w-md"
          onClick={handleShiftAction}
          type="button"
        >
          {shiftIsActive ? "View live shift →" : "Start new shift"}
        </button>
      </div>
    </AppLayout>
  );
}
