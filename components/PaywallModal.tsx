"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { setGuestAccess } from "@/lib/storage";

const FEATURES = [
  "Live zone recommendations updated every 2 minutes",
  "AI reasoning powered by your shift history",
  "Surge alerts before they peak",
];

type PaywallModalProps = {
  onClose: () => void;
  onGuestContinue: () => void;
};

export default function PaywallModal({
  onClose,
  onGuestContinue,
}: PaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    setGuestAccess();
    onGuestContinue();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
    >
      <div
        className="w-full max-w-md rounded-[24px] border border-[#222222] bg-[#141414] p-8"
        role="dialog"
        aria-labelledby="paywall-title"
        aria-modal="true"
      >
        <span className="inline-block rounded-full border border-[#F5A623]/40 bg-[#F5A623]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#F5A623]">
          ZoneIn Pro
        </span>

        <h2
          className="mt-4 text-[28px] font-bold leading-tight text-white"
          id="paywall-title"
        >
          Unlock full shift intelligence
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#888888]">
          Real-time zone recommendations, AI-powered surge alerts, and driver
          memory — all for less than a coffee a month.
        </p>

        <div className="mt-6">
          <p className="text-[36px] font-bold text-[#F5A623]">£2.99/month</p>
          <p className="mt-1 text-xs text-[#888888]">Cancel anytime.</p>
        </div>

        <ul className="mt-6 space-y-3">
          {FEATURES.map((feature) => (
            <li className="flex items-start gap-3 text-sm text-[#888888]" key={feature}>
              <Check
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[#F5A623]"
                size={16}
                strokeWidth={3}
              />
              {feature}
            </li>
          ))}
        </ul>

        {error && (
          <p className="mt-4 rounded-lg border border-[#FF3B30]/40 bg-[#FF3B30]/10 px-3 py-2 text-sm font-bold text-[#FF3B30]">
            {error}
          </p>
        )}

        <button
          className="mt-6 flex h-14 w-full touch-manipulation items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.08em] text-black active:opacity-90 disabled:opacity-70"
          disabled={isLoading}
          onClick={handleCheckout}
          type="button"
        >
          {isLoading ? "Redirecting..." : "Start for £2.99/month →"}
        </button>

        <button
          className="mt-4 w-full text-center text-xs font-bold text-[#888888] underline-offset-2 hover:underline"
          onClick={handleGuestContinue}
          type="button"
        >
          Continue as guest (demo only)
        </button>
      </div>
    </div>
  );
}
