import Image from "next/image";
import zoneInLogo from "@/app/Zoneinlogo.png";

type ZoneInLogoProps = {
  size?: number;
  className?: string;
};

export default function ZoneInLogo({
  size = 32,
  className = "",
}: ZoneInLogoProps) {
  return (
    <Image
      alt="ZoneIn Logo"
      className={`object-contain ${className}`}
      height={size}
      priority
      src={zoneInLogo}
      unoptimized
      width={size}
    />
  );
}
