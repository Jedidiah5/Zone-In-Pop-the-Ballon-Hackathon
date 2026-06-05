import type { Zone } from "@/types";

export const MOCK_ZONES: Zone[] = [
  {
    name: "Soho",
    distance: "1.2 MILES AWAY",
    potential: "high",
    reasoning:
      "High demand due to theatre closing times and limited driver availability in W1.",
    surgeMultiplier: 1.8,
    activeJobs: 422,
  },
  {
    name: "Islington",
    distance: "2.8 MILES AWAY",
    potential: "high",
    reasoning:
      "Rising trip volume near Upper Street restaurants and N1 residential hubs.",
    surgeMultiplier: 1.8,
    activeJobs: 422,
  },
  {
    name: "Shoreditch",
    distance: "3.5 MILES AWAY",
    potential: "medium",
    reasoning:
      "Steady weekend traffic near Old Street; surge pricing expected in 20 mins.",
    surgeMultiplier: 1.8,
    activeJobs: 422,
  },
];
