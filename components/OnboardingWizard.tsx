"use client";

import Image from "next/image";
import { LocateFixed, MapPin, User } from "lucide-react";
import { useState } from "react";
import PlatformSelector from "@/components/PlatformSelector";
import { APP_IMAGES } from "@/lib/images";
import type {
  OnboardingData,
  Platform,
  ShiftPreference,
  VehicleType,
} from "@/types";

const VEHICLES: { id: VehicleType; label: string; emoji: string }[] = [
  { id: "car", label: "Car", emoji: "🚗" },
  { id: "bike", label: "Bike", emoji: "🚲" },
  { id: "scooter", label: "Scooter", emoji: "🛵" },
  { id: "van", label: "Van", emoji: "🚐" },
];

const SHIFTS: { id: ShiftPreference; label: string; time: string }[] = [
  { id: "morning", label: "Morning", time: "6am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 6pm" },
  { id: "evening", label: "Evening", time: "6pm – 12am" },
  { id: "night", label: "Night", time: "12am – 6am" },
  { id: "flexible", label: "Flexible", time: "Any time" },
];

const STEP_IMAGES = [
  APP_IMAGES.heroDriver,
  APP_IMAGES.heroMap,
  APP_IMAGES.cityStreet,
  APP_IMAGES.driverPhone,
];

const STEP_LABELS = ["About you", "Platform", "Location", "Your setup"];

type OnboardingWizardProps = {
  initialData?: Partial<OnboardingData>;
  isLoading: boolean;
  isLocating: boolean;
  error: string;
  onComplete: (data: OnboardingData) => void;
  onUseCurrentLocation: () => Promise<string | null>;
};

export default function OnboardingWizard({
  initialData,
  isLoading,
  isLocating,
  error,
  onComplete,
  onUseCurrentLocation,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [platform, setPlatform] = useState<Platform | null>(
    initialData?.platform ?? null
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(
    initialData?.vehicleType ?? null
  );
  const [shiftPreference, setShiftPreference] = useState<ShiftPreference | null>(
    initialData?.shiftPreference ?? null
  );
  const [stepError, setStepError] = useState("");

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!fullName.trim()) {
          setStepError("Enter your first name so we can personalise your zones");
          return false;
        }
        break;
      case 1:
        if (!platform) {
          setStepError("Select the platform you drive for");
          return false;
        }
        break;
      case 2:
        if (!location.trim()) {
          setStepError("Enter your area or use current location");
          return false;
        }
        break;
      case 3:
        if (!vehicleType) {
          setStepError("Select your vehicle type");
          return false;
        }
        if (!shiftPreference) {
          setStepError("Select when you usually drive");
          return false;
        }
        break;
    }
    setStepError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (step < STEP_LABELS.length - 1) {
      setStep(step + 1);
      return;
    }

    onComplete({
      fullName: fullName.trim(),
      platform,
      location: location.trim(),
      vehicleType,
      shiftPreference,
    });
  };

  const handleBack = () => {
    setStepError("");
    setStep(Math.max(0, step - 1));
  };

  const handleLocate = async () => {
    setStepError("");
    const area = await onUseCurrentLocation();
    if (area) {
      setLocation(area);
    }
  };

  return (
    <main className="bg-[#0A0A0A] text-white md:flex md:min-h-dvh md:items-start md:justify-center md:py-6">
      <div className="mx-auto flex w-full max-w-lg flex-col md:rounded-2xl md:border md:border-[#222222] md:bg-[#111111]">
      <div className="relative h-36 shrink-0 overflow-hidden md:h-28 md:rounded-t-2xl">
        <Image
          alt=""
          className="object-cover"
          fill
          priority
          src={STEP_IMAGES[step]}
          unoptimized={step > 1}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
        <div className="absolute left-5 top-safe pt-4 text-xl font-bold tracking-[-0.04em]">
          ZoneIn<span className="text-[#F5A623]">.</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 md:px-6 md:pb-6">
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#555555]">
              Step {step + 1} of {STEP_LABELS.length}
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F5A623]">
              {STEP_LABELS[step]}
            </p>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[#222222]">
            <div
              className="h-full rounded-full bg-[#F5A623] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.05em] md:text-3xl">
                Hey driver 👋
              </h1>
              <p className="mt-2 text-sm leading-5 text-[#888888]">
                Let&apos;s set up your profile so ZoneIn can find the best
                earning zones for you.
              </p>
              <label
                className="mb-2 mt-5 block text-xs font-bold uppercase tracking-[0.14em] text-[#555555]"
                htmlFor="full-name"
              >
                Your name
              </label>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F5A623]"
                  size={20}
                />
                <input
                  autoComplete="name"
                  className="h-12 w-full rounded-lg border border-[#222222] bg-[#141414] pl-12 pr-4 text-base font-bold outline-none focus:border-[#F5A623]"
                  id="full-name"
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. James"
                  value={fullName}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.05em]">
                Your platform
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#888888]">
                Which app do you earn on? We&apos;ll tailor zone intel to your
                platform.
              </p>
              <div className="mt-5">
                <PlatformSelector onSelect={setPlatform} selected={platform} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.05em]">
                Where are you?
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#888888]">
                Your current area helps us find nearby high-demand zones.
              </p>
              <label
                className="mb-3 mt-8 block text-xs font-bold uppercase tracking-[0.14em] text-[#555555]"
                htmlFor="location"
              >
                Current area
              </label>
              <div className="relative mb-4">
                <MapPin
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F5A623]"
                  size={20}
                />
                <input
                  className="h-14 w-full rounded-lg border border-[#222222] bg-[#141414] pl-12 pr-4 text-base font-bold outline-none focus:border-[#F5A623]"
                  id="location"
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Shoreditch, Hackney"
                  value={location}
                />
              </div>
              <button
                className="flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-lg border border-[#222222] bg-[#141414] text-sm font-bold uppercase tracking-[0.08em] active:opacity-80 disabled:opacity-60"
                disabled={isLocating}
                onClick={handleLocate}
                type="button"
              >
                <LocateFixed
                  aria-hidden="true"
                  className={isLocating ? "animate-pulse text-[#F5A623]" : "text-[#F5A623]"}
                  size={18}
                />
                {isLocating ? "Locating..." : "Use my current location"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.05em]">
                Your setup
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#888888]">
                Vehicle and shift info helps us rank zones that suit how you
                drive.
              </p>

              <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-[0.14em] text-[#555555]">
                Vehicle type
              </p>
              <div className="mb-6 grid grid-cols-2 gap-3">
                {VEHICLES.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className={`flex h-20 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl border text-sm font-bold active:opacity-80 ${
                      vehicleType === vehicle.id
                        ? "border-[#F5A623] bg-[#F5A623]/10 text-white"
                        : "border-[#222222] bg-[#141414] text-[#888888]"
                    }`}
                    onClick={() => setVehicleType(vehicle.id)}
                    type="button"
                  >
                    <span className="text-2xl">{vehicle.emoji}</span>
                    {vehicle.label}
                  </button>
                ))}
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#555555]">
                Usual shift
              </p>
              <div className="space-y-2">
                {SHIFTS.map((shift) => (
                  <button
                    key={shift.id}
                    className={`flex w-full touch-manipulation items-center justify-between rounded-xl border px-4 py-3 text-left active:opacity-80 ${
                      shiftPreference === shift.id
                        ? "border-[#F5A623] bg-[#F5A623]/10"
                        : "border-[#222222] bg-[#141414]"
                    }`}
                    onClick={() => setShiftPreference(shift.id)}
                    type="button"
                  >
                    <span className="font-bold">{shift.label}</span>
                    <span className="text-xs text-[#888888]">{shift.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {(stepError || error) && (
          <p
            className="mb-4 rounded-lg border border-[#FF3B30] bg-[#FF3B30]/10 px-4 py-3 text-sm font-bold text-[#FF3B30]"
            role="alert"
          >
            {stepError || error}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          {step > 0 && (
            <button
              className="h-12 flex-1 touch-manipulation rounded-lg border border-[#222222] bg-[#141414] text-sm font-bold uppercase tracking-[0.08em] active:opacity-80"
              disabled={isLoading}
              onClick={handleBack}
              type="button"
            >
              Back
            </button>
          )}
          <button
            className="h-12 flex-[2] touch-manipulation rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.08em] text-[#0A0A0A] active:opacity-80 disabled:opacity-70"
            disabled={isLoading || isLocating}
            onClick={handleNext}
            type="button"
          >
            {isLoading
              ? "Finding zones..."
              : step === STEP_LABELS.length - 1
                ? "Find my zones →"
                : "Continue"}
          </button>
        </div>
      </div>
      </div>
    </main>
  );
}
