export const ZONE_COORDINATES: Record<string, [number, number]> = {
  westminster: [-0.1343, 51.4975],
  camden: [-0.1426, 51.529],
  islington: [-0.1063, 51.5416],
  hackney: [-0.055, 51.545],
  shoreditch: [-0.0754, 51.5227],
  soho: [-0.1337, 51.5137],
  brixton: [-0.1132, 51.4613],
  "canary wharf": [-0.0235, 51.5054],
  "kings cross": [-0.124, 51.5308],
  greenwich: [0.0099, 51.4769],
  southwark: [-0.089, 51.503],
  "tower hamlets": [-0.059, 51.52],
  lambeth: [-0.114, 51.493],
  wandsworth: [-0.19, 51.457],
  hammersmith: [-0.223, 51.492],
  chelsea: [-0.168, 51.487],
  kensington: [-0.192, 51.501],
  stratford: [-0.003, 51.542],
  colindale: [-0.252, 51.595],
  angel: [-0.106, 51.532],
  borough: [-0.093, 51.503],
  dalston: [-0.075, 51.545],
  mayfair: [-0.149, 51.511],
  clapham: [-0.14, 51.462],
  fulham: [-0.195, 51.475],
  ealing: [-0.302, 51.513],
  richmond: [-0.301, 51.461],
  wimbledon: [-0.206, 51.421],
  croydon: [-0.098, 51.376],
  enfield: [-0.084, 51.652],
  barnet: [-0.207, 51.625],
  brent: [-0.272, 51.558],
  hounslow: [-0.362, 51.468],
  harrow: [-0.334, 51.589],
  barking: [0.081, 51.54],
  romford: [0.183, 51.575],
  ilford: [0.084, 51.559],
  walthamstow: [-0.02, 51.583],
  leyton: [-0.008, 51.558],
  tottenham: [-0.076, 51.588],
  finchley: [-0.195, 51.595],
  hampstead: [-0.178, 51.556],
  paddington: [-0.177, 51.516],
  "notting hill": [-0.196, 51.509],
  whitechapel: [-0.066, 51.516],
  bankside: [-0.099, 51.507],
  "london bridge": [-0.087, 51.505],
};

export function getZoneSlug(name: string) {
  return encodeURIComponent(
    name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
  );
}

export function getZoneCoordinates(zoneName: string): [number, number] | null {
  const normalized = zoneName.toLowerCase();

  for (const [key, coords] of Object.entries(ZONE_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  return null;
}

export function getMapsDirectionsUrl(zoneName: string) {
  const coords = getZoneCoordinates(zoneName);
  if (!coords) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${zoneName}, London`)}`;
  }

  const [longitude, latitude] = coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
