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

type PlatformIconProps = {
  platform: Platform;
  size?: number;
};

export default function PlatformIcon({ platform, size = 40 }: PlatformIconProps) {
  const logo = PLATFORM_LOGOS[platform];

  return (
    <div
      className="pointer-events-none overflow-hidden rounded-lg bg-black"
      style={{ height: size, width: size }}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
        height={size}
        src={logo}
        unoptimized
        width={size}
      />
    </div>
  );
}
