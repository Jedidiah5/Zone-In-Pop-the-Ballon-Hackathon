export type Platform = "uber" | "bolt" | "deliveroo" | "stuart";

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
};

export type UserProfile = {
  id: string;
  email: string | null;
  platform: Platform | null;
  home_area: string | null;
  active_zone: string | null;
};
