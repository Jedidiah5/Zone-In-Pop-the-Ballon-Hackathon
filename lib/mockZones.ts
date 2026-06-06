import type { Zone } from "@/types";

export const MOCK_ZONES: Zone[] = [
  {
    name: "Westminster",
    distance: "1.2 MILES AWAY",
    potential: "high",
    reasoning:
      "Soho, Mayfair and theatre exits are pulling short, high-value trips into W1.",
    detailedReasoning:
      "Westminster is running hot because late restaurant, hotel and theatre traffic is overlapping with fewer available drivers around Soho and Mayfair. The zone usually holds demand in waves as groups move from dinner to bars and then into rides home. Expect quick pickups near Oxford Street, Piccadilly and the Strand, but avoid sitting on blocked side streets for too long.",
    surgeMultiplier: 1.8,
    activeJobs: 422,
    demandWindowMinutes: 45,
    congestionWarning: true,
    peakEndTime: "11:30pm",
  },
  {
    name: "Islington",
    distance: "2.8 MILES AWAY",
    potential: "high",
    reasoning:
      "Rising trip volume near Upper Street restaurants and N1 residential hubs.",
    detailedReasoning:
      "Islington is building strong demand as Upper Street venues turn tables and residential drop-offs stack up around Angel. Drivers are thin north of the City, so the next set of requests should favour nearby cars. Work the main corridors and keep moving between Angel, Highbury and Canonbury instead of waiting deep inside estates.",
    surgeMultiplier: 1.8,
    activeJobs: 368,
    demandWindowMinutes: 40,
    congestionWarning: false,
    peakEndTime: "11:20pm",
  },
  {
    name: "Hackney",
    distance: "3.5 MILES AWAY",
    potential: "medium",
    reasoning:
      "Shoreditch and Dalston have steady food and ride demand, with stronger pickup pockets near stations.",
    detailedReasoning:
      "Hackney is steady rather than explosive right now, led by Shoreditch bars, Dalston restaurants and station runs. Demand is spread out, so the best results come from staying mobile on Kingsland Road and Old Street instead of chasing one hotspot. Surge may lift if rain or event exits hit together in the next half hour.",
    surgeMultiplier: 1.5,
    activeJobs: 286,
    demandWindowMinutes: 35,
    congestionWarning: false,
    peakEndTime: "11:10pm",
  },
  {
    name: "Camden",
    distance: "4.1 MILES AWAY",
    potential: "medium",
    reasoning:
      "Camden Town nightlife is active, but driver supply is keeping surge controlled.",
    detailedReasoning:
      "Camden has dependable late-evening traffic from music venues, pubs and station pickups. The issue is supply: plenty of drivers are already circling Camden High Street, so patience matters. Use the edges around Kentish Town and Mornington Crescent when the core gets jammed.",
    surgeMultiplier: 1.4,
    activeJobs: 231,
    demandWindowMinutes: 30,
    congestionWarning: false,
    peakEndTime: "10:55pm",
  },
  {
    name: "Southwark",
    distance: "2.4 MILES AWAY",
    potential: "low",
    reasoning:
      "Demand has cooled after the dinner rush and several dead streets are slowing pickups.",
    detailedReasoning:
      "Southwark has pockets of movement around London Bridge and Borough, but the main dinner rush has already faded. Traffic near the river can trap drivers without enough nearby jobs to justify waiting. Treat it as a pass-through zone unless you get a strong ping near a station or hotel.",
    surgeMultiplier: 1.1,
    activeJobs: 118,
    demandWindowMinutes: 20,
    congestionWarning: true,
    peakEndTime: "10:40pm",
  },
];
