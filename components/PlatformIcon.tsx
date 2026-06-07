import Image, { type StaticImageData } from "next/image";
import type { Platform } from "@/types";
import boltLogo from "@/app/bolt_logo.png";
import deliverooLogo from "@/app/deliveroo_logo.png";
import stuartLogo from "@/app/staut_logo.png";
import uberLogo from "@/app/uber_logo.png";

const PLATFORM_LOGOS: Record<Platform, StaticImageData> = {
  uber: uberLogo,
  bolt: boltLogo,
  deliveroo: deliverooLogo,
  stuart: stuartLogo,
};

const DARK_BACKGROUND_PLATFORMS = new Set<Platform>(["uber", "stuart"]);

type PlatformIconProps = {
  platform: Platform;
  size?: number;
};

export default function PlatformIcon({ platform, size = 40 }: PlatformIconProps) {
  const logo = PLATFORM_LOGOS[platform];
  const useDarkBackground = DARK_BACKGROUND_PLATFORMS.has(platform);

  return (
    <div
      className={`pointer-events-none flex items-center justify-center overflow-hidden rounded-lg border p-1.5 ${
        useDarkBackground
          ? "border-black bg-black"
          : "border-[#E5E5E5] bg-white"
      }`}
      style={{ height: size, width: size }}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain"
        height={size}
        src={logo}
        unoptimized
        width={size}
      />
    </div>
  );
}
