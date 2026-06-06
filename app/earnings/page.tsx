"use client";

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

const EARNINGS_DATA = [
  { zone: "Soho", earnings: 18.4 },
  { zone: "Hackney", earnings: 9.8 },
  { zone: "Angel", earnings: 7.6 },
  { zone: "Camden", earnings: 6.2 },
  { zone: "Borough", earnings: 5.2 },
];

export default function EarningsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-[32px] font-bold leading-tight tracking-[-0.05em] text-white">
          Today&apos;s Shift
        </h1>

        <section className="mb-8 space-y-4">
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Time Online
            </p>
            <p className="text-5xl font-bold tracking-[-0.06em] text-white">
              2h 34m
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Est. Earnings
            </p>
            <p className="text-5xl font-bold tracking-[-0.06em] text-[#F5A623]">
              £47.20
            </p>
          </div>
          <div className="rounded-xl border border-[#222222] bg-[#141414] p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#888888]">
              Best Zone
            </p>
            <p className="text-5xl font-bold tracking-[-0.06em] text-[#00FF94]">
              Soho
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-[#222222] bg-[#141414] p-5">
          <h2 className="mb-5 text-xl font-bold tracking-[-0.04em] text-white">
            Earnings by Zone
          </h2>
          <div className="h-64">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={EARNINGS_DATA}>
                <CartesianGrid stroke="#222222" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="zone"
                  tick={{ fill: "#888888", fontSize: 12, fontWeight: 700 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "#888888", fontSize: 12, fontWeight: 700 }}
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
                <Bar dataKey="earnings" fill="#F5A623" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <button
          className="flex h-14 w-full items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.12em] text-[#0A0A0A] active:scale-[0.98]"
          type="button"
        >
          Start New Shift
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
