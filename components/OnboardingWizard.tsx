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
    <main className="min-h-dvh bg-white text-black lg:flex lg:items-center lg:justify-center lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-lg flex-col lg:max-w-5xl lg:flex-row lg:overflow-hidden lg:rounded-lg lg:border lg:border-[#E5E5E5]">
        <div className="bolt-hero-curve relative h-[38dvh] shrink-0 overflow-hidden lg:h-auto lg:min-h-[560px] lg:w-[42%] lg:rounded-none">
          <Image
            alt=""
            className="object-cover"
            fill
            priority
            src={STEP_IMAGES[step]}
            unoptimized={step > 1}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F7F7F7] lg:bg-gradient-to-r lg:from-transparent lg:to-[#F7F7F7]/80" />
          <div className="absolute left-6 top-safe pt-4 text-xl font-bold tracking-[-0.04em] lg:left-8 lg:text-2xl">
            ZoneIn<span className="text-black font-bold">.</span>
          </div>
        </div>

        <div className="relative -mt-6 flex flex-1 flex-col rounded-t-lg bg-[#F7F7F7] px-6 pb-8 pt-6 lg:mt-0 lg:rounded-none lg:px-8 lg:py-8">
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#999999]">
                Step {step + 1} of {STEP_LABELS.length}
              </p>
              <p className="text-xs font-bold text-black">{STEP_LABELS[step]}</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E5E5]">
              <div
                className="h-full rounded-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1">
            {step === 0 && (
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
                  Hey driver 👋
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Let&apos;s set up your profile so ZoneIn can find the best
                  earning zones for you.
                </p>
                <label
                  className="mb-2 mt-5 block text-xs font-bold uppercase tracking-[0.12em] text-[#999999]"
                  htmlFor="full-name"
                >
                  Your name
                </label>
                <div className="relative">
                  <User
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black"
                    size={20}
                  />
                  <input
                    autoComplete="name"
                    className="bolt-input pl-12"
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
                <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
                  Your platform
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
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
                <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
                  Where are you?
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Your current area helps us find nearby high-demand zones.
                </p>
                <label
                  className="mb-2 mt-5 block text-xs font-bold uppercase tracking-[0.12em] text-[#999999]"
                  htmlFor="location"
                >
                  Current area
                </label>
                <div className="relative mb-4">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black"
                    size={20}
                  />
                  <input
                    className="bolt-input pl-12"
                    id="location"
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shoreditch, Hackney"
                    value={location}
                  />
                </div>
                <button
                  className="bolt-btn-secondary w-full gap-2"
                  disabled={isLocating}
                  onClick={handleLocate}
                  type="button"
                >
                  <LocateFixed
                    aria-hidden="true"
                    className={isLocating ? "animate-pulse text-black" : "text-black"}
                    size={18}
                  />
                  {isLocating ? "Locating..." : "Use my current location"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
                  Your setup
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  Vehicle and shift info helps us rank zones that suit how you
                  drive.
                </p>

                <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#999999]">
                  Vehicle type
                </p>
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {VEHICLES.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      className={`flex h-20 touch-manipulation flex-col items-center justify-center gap-1 rounded-md border text-sm font-bold active:opacity-80 ${
                        vehicleType === vehicle.id
                          ? "border-black bg-black/12 text-black"
                          : "border-[#E5E5E5] bg-white text-[#666666]"
                      }`}
                      onClick={() => setVehicleType(vehicle.id)}
                      type="button"
                    >
                      <span className="text-2xl">{vehicle.emoji}</span>
                      {vehicle.label}
                    </button>
                  ))}
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#999999]">
                  Usual shift
                </p>
                <div className="space-y-2">
                  {SHIFTS.map((shift) => (
                    <button
                      key={shift.id}
                      className={`flex w-full touch-manipulation items-center justify-between rounded-md border px-4 py-3.5 text-left active:opacity-80 ${
                        shiftPreference === shift.id
                          ? "border-black bg-black/12"
                          : "border-[#E5E5E5] bg-white"
                      }`}
                      onClick={() => setShiftPreference(shift.id)}
                      type="button"
                    >
                      <span className="font-bold">{shift.label}</span>
                      <span className="text-xs text-[#666666]">{shift.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(stepError || error) && (
            <p
              className="mb-4 rounded-md border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3 text-sm font-bold text-black"
              role="alert"
            >
              {stepError || error}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            {step > 0 && (
              <button
                className="bolt-btn-secondary flex-1"
                disabled={isLoading}
                onClick={handleBack}
                type="button"
              >
                Back
              </button>
            )}
            <button
              className="bolt-btn-primary flex-[2] disabled:opacity-70"
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
