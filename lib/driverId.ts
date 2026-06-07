function toBase64Url(raw: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(raw, "utf8").toString("base64")
      : btoa(raw);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function deriveDriverId(platform: string, location: string): string {
  const raw = `${platform.trim().toLowerCase()}:${location.trim().toLowerCase()}`;
  return toBase64Url(raw);
}
