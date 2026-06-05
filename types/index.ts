export type Platform = "uber" | "bolt" | "deliveroo" | "stuart";

export type Zone = {
  name: string;
  distance: string;
  potential: "high" | "medium" | "low";
  reasoning: string;
  surgeMultiplier: number;
  activeJobs: number;
};

export type DriverProfile = {
  platform: Platform;
  location: string;
  preferredZones: string[];
};
