export type Platform = "uber" | "bolt" | "deliveroo" | "stuart";

export type VehicleType = "car" | "bike" | "scooter" | "van";

export type ShiftPreference =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "flexible";

export type Zone = {
  name: string;
  distance: string;
  potential: "high" | "medium" | "low";
  reasoning: string;
  detailedReasoning: string;
  surgeMultiplier: number;
  activeJobs: number;
  demandWindowMinutes: number;
  congestionWarning: boolean;
  peakEndTime: string;
};

export type DriverProfile = {
  platform: Platform;
  location: string;
  preferredZones: string[];
  fullName?: string;
  vehicleType?: VehicleType;
  shiftPreference?: ShiftPreference;
};

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  platform: Platform | null;
  home_area: string | null;
  active_zone: string | null;
  vehicle_type: VehicleType | null;
  shift_preference: ShiftPreference | null;
  onboarding_completed: boolean;
};

export type OnboardingData = {
  fullName: string;
  platform: Platform | null;
  location: string;
  vehicleType: VehicleType | null;
  shiftPreference: ShiftPreference | null;
};
