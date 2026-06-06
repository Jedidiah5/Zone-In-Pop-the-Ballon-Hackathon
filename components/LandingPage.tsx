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
      {/* Mobile: Bolt-style split hero */}
      <section className="relative min-h-dvh lg:hidden">
        <div className="bolt-hero-curve relative h-[58dvh] overflow-hidden bg-[#1A1A1A]">
          <Image
            alt="London driver at night"
            className="object-cover opacity-70"
            fill
            priority
            src={APP_IMAGES.heroDriver}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#1A1A1A]" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-safe">
            <p className="text-4xl font-bold tracking-[-0.06em]">
              ZoneIn<span className="text-[#F5A623]">.</span>
            </p>
            <p className="mt-2 text-center text-sm font-medium text-[#CCCCCC]">
              Know where to drive. Before you go.
            </p>
          </div>
        </div>

        <div className="relative -mt-8 rounded-t-[28px] bg-[#1A1A1A] px-6 pb-8 pt-8">
          <h1 className="text-2xl font-bold tracking-[-0.05em]">
            Built for London gig drivers
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#888888]">
            Real-time zone intelligence for Uber, Bolt, Deliveroo and Stuart.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link className="bolt-btn-primary gap-2" href="/signup">
              Get started free
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.5} />
            </Link>
            <Link
              className="bolt-btn-secondary"
              href="/login"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="bolt-card p-3">
              <p className="text-xl font-bold text-[#F5A623]">2min</p>
              <p className="mt-0.5 text-[10px] font-bold text-[#888888]">
                Updates
              </p>
            </div>
            <div className="bolt-card p-3">
              <p className="text-xl font-bold text-[#00FF94]">33+</p>
              <p className="mt-0.5 text-[10px] font-bold text-[#888888]">
                Zones
              </p>
            </div>
            <div className="bolt-card p-3">
              <p className="text-xl font-bold text-white">4</p>
              <p className="mt-0.5 text-[10px] font-bold text-[#888888]">
                Apps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop: professional marketing layout */}
      <section className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold tracking-[-0.04em]">
              ZoneIn<span className="text-[#F5A623]">.</span>
            </p>
            <div className="flex items-center gap-3">
              <Link
                className="rounded-[14px] px-5 py-2.5 text-sm font-bold text-[#888888] hover:text-white"
                href="/login"
              >
                Sign in
              </Link>
              <Link className="bolt-btn-primary !w-auto px-6" href="/signup">
                Get started
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-12 px-8 pb-16 pt-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#00FF94]">
              Built for London gig drivers
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-[-0.06em]">
              Know where to drive.
              <br />
              Before you go.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#888888]">
              Real-time zone intelligence for Uber, Bolt, Deliveroo and Stuart
              drivers across London.
            </p>
            <div className="mt-8 flex gap-3">
              <Link className="bolt-btn-primary !w-auto gap-2 px-8" href="/signup">
                Get started free
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="bolt-btn-secondary !w-auto px-8" href="/login">
                Sign in
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-[#F5A623]">2min</p>
                <p className="text-sm text-[#888888]">Live updates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00FF94]">33+</p>
                <p className="text-sm text-[#888888]">London zones</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-sm text-[#888888]">Platforms</p>
              </div>
            </div>
          </div>

          <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-[#2A2A2A]">
            <Image
              alt="London driver with zone map"
              className="object-cover"
              fill
              priority
              src={APP_IMAGES.heroDriver}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
          </div>
        </div>
      </section>

      <section className="border-t border-[#2A2A2A] px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-[-0.04em] lg:text-left lg:text-3xl">
            Everything a driver needs
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className="bolt-card overflow-hidden"
                  key={feature.title}
                >
                  <div className="relative h-40 w-full">
                    <Image
                      alt={feature.title}
                      className="object-cover"
                      fill
                      src={feature.image}
                      unoptimized={!feature.local}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F5A623]/15">
                        <Icon
                          aria-hidden="true"
                          className="text-[#F5A623]"
                          size={18}
                          strokeWidth={2.5}
                        />
                      </span>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-[#888888]">
                      {feature.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2A2A2A] px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-7xl">
          <h2 className="text-2xl font-bold tracking-[-0.04em] lg:text-3xl">
            Stop guessing. Start earning.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#888888] lg:text-base">
            Set up your profile in under a minute and get zone recommendations
            instantly.
          </p>
          <Link
            className="bolt-btn-primary mx-auto mt-6 !w-auto px-10 lg:inline-flex"
            href="/signup"
          >
            Create free account
          </Link>
        </div>
      </section>
    </main>
  );
}
