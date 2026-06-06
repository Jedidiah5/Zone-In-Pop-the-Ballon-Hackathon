export function deriveDriverId(platform: string, location: string): string {
  const raw = `${platform.trim().toLowerCase()}:${location.trim().toLowerCase()}`;

  if (typeof Buffer !== "undefined") {
    return Buffer.from(raw, "utf8").toString("base64url");
  }

  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
