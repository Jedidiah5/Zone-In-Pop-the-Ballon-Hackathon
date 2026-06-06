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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#E5E5E5] bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        role="dialog"
        aria-labelledby="paywall-title"
        aria-modal="true"
      >
        <span className="inline-block rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-black">
          ZoneIn Pro
        </span>

        <h2
          className="mt-4 text-[28px] font-bold leading-tight text-black"
          id="paywall-title"
        >
          Unlock full shift intelligence
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#666666]">
          Real-time zone recommendations, AI-powered surge alerts, and driver
          memory — all for less than a coffee a month.
        </p>

        <div className="mt-6">
          <p className="text-[36px] font-bold text-black">£2/month</p>
          <p className="mt-1 text-xs text-[#666666]">Cancel anytime.</p>
        </div>

        <ul className="mt-6 space-y-3">
          {FEATURES.map((feature) => (
            <li className="flex items-start gap-3 text-sm text-[#666666]" key={feature}>
              <Check
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-black"
                size={16}
                strokeWidth={3}
              />
              {feature}
            </li>
          ))}
        </ul>

        {error && (
          <p className="mt-4 rounded-md border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-2 text-sm font-bold text-black">
            {error}
          </p>
        )}

        <button
          className="bolt-btn-primary mt-6 disabled:opacity-70"
          disabled={isLoading}
          onClick={handleCheckout}
          type="button"
        >
          {isLoading ? "Redirecting..." : "Start for £2/month →"}
        </button>

        <button
          className="mt-4 w-full text-center text-xs font-bold text-[#666666] underline-offset-2 hover:underline"
          onClick={handleGuestContinue}
          type="button"
        >
          Continue as guest (demo only)
        </button>
      </div>
    </div>
  );
}
