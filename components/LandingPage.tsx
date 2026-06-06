"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp, Zap } from "lucide-react";
import { APP_IMAGES } from "@/lib/images";

const FEATURES = [
  {
    icon: MapPin,
    title: "Live zone map",
    body: "See where demand is spiking across London right now.",
    image: APP_IMAGES.heroMap,
    local: true,
  },
  {
    icon: TrendingUp,
    title: "Surge intel",
    body: "AI surge multipliers and job counts, updated every 2 minutes.",
    image: APP_IMAGES.cityStreet,
    local: false,
  },
  {
    icon: Zap,
    title: "Head here fast",
    body: "One tap to open Google Maps to your best zone.",
    image: APP_IMAGES.driverPhone,
    local: false,
  },
];

export default function LandingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <section className="relative overflow-hidden md:mx-auto md:max-w-6xl md:px-6 md:pt-6">
        <div className="relative min-h-[68dvh] md:min-h-0 md:h-[420px] md:overflow-hidden md:rounded-2xl">
          <Image
            alt="London driver at night with zone map"
            className="object-cover"
            fill
            priority
            src={APP_IMAGES.heroDriver}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/20 via-[#0A0A0A]/50 to-[#0A0A0A]/90 md:bg-gradient-to-r md:from-[#0A0A0A]/90 md:via-[#0A0A0A]/50 md:to-transparent" />

          <div className="relative z-10 flex min-h-[68dvh] flex-col px-5 pb-6 pt-safe md:min-h-0 md:h-full md:justify-center md:px-8 md:pb-8">
            <div className="text-xl font-bold tracking-[-0.04em] md:absolute md:left-8 md:top-6 md:text-2xl">
              ZoneIn<span className="text-[#F5A623]">.</span>
            </div>

            <div className="mt-auto max-w-lg md:mt-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00FF94]">
                Built for London gig drivers
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-[-0.06em] text-white sm:text-4xl md:text-[40px]">
                Know where to drive. Before you go.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#CCCCCC] md:mt-4">
                Real-time zone intelligence for Uber, Bolt, Deliveroo and Stuart
                drivers across London.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-6">
                <Link
                  className="flex h-12 touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#F5A623] px-5 text-sm font-bold uppercase tracking-[0.1em] text-[#0A0A0A] active:opacity-90"
                  href="/signup"
                >
                  Get started free
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  className="flex h-12 touch-manipulation items-center justify-center rounded-lg border border-[#333333] bg-[#141414]/80 px-5 text-sm font-bold uppercase tracking-[0.1em] text-white backdrop-blur active:opacity-90"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#222222] px-5 py-6 md:py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-[#F5A623] md:text-3xl">2min</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Live updates
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00FF94] md:text-3xl">33+</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              London zones
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white md:text-3xl">4</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
              Platforms
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell-wide pb-10 pt-2 md:pb-12">
        <h2 className="mb-5 text-center text-xl font-bold tracking-[-0.04em] md:mb-6 md:text-2xl">
          Everything a driver needs
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="overflow-hidden rounded-xl border border-[#222222] bg-[#111111]"
                key={feature.title}
              >
                <div className="relative h-32 w-full md:h-28">
                  <Image
                    alt={feature.title}
                    className="object-cover"
                    fill
                    src={feature.image}
                    unoptimized={!feature.local}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5A623]/15">
                      <Icon
                        aria-hidden="true"
                        className="text-[#F5A623]"
                        size={16}
                        strokeWidth={2.5}
                      />
                    </span>
                    <h3 className="text-base font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-xs leading-5 text-[#888888] md:text-sm">
                    {feature.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#222222] px-5 py-8 md:py-10">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-bold tracking-[-0.04em] md:text-2xl">
            Stop guessing. Start earning.
          </h2>
          <p className="mt-2 text-sm leading-5 text-[#888888]">
            Set up your profile in under a minute and get zone recommendations
            instantly.
          </p>
          <Link
            className="mt-4 flex h-12 touch-manipulation items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.1em] text-[#0A0A0A] active:opacity-90"
            href="/signup"
          >
            Create free account
          </Link>
        </div>
      </section>
    </main>
  );
}
