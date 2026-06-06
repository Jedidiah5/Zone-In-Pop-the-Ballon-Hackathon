type NominatimResponse = {
  address?: {
    borough?: string;
    suburb?: string;
    neighbourhood?: string;
    city_district?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    city?: string;
  };
  display_name?: string;
};

function getReadableArea(address: NominatimResponse["address"]) {
  if (!address) {
    return null;
  }

  return (
    address.borough ||
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.city ||
    null
  );
}

export async function getCurrentAreaName(): Promise<string> {
  if (!navigator.geolocation) {
    throw new Error("Location is not supported on this device");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 120000,
    });
  });

  const { latitude, longitude } = position.coords;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=14`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-GB",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Could not resolve your area from GPS");
  }

  const data = (await response.json()) as NominatimResponse;
  const area = getReadableArea(data.address);

  if (!area) {
    throw new Error("Could not find a nearby London area");
  }

  return area.replace(/\s+London$/i, "").trim();
}

export function getGeolocationErrorMessage(error: unknown) {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access denied. Allow GPS or type your area manually.";
      case error.POSITION_UNAVAILABLE:
        return "GPS unavailable right now. Type your area manually.";
      case error.TIMEOUT:
        return "Location timed out. Try again or type your area.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Could not get your location";
}
