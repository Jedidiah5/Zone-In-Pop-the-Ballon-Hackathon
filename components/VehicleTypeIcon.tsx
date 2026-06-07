import type { IconType } from "react-icons";
import {
  IoBicycleOutline,
  IoBusOutline,
  IoCarSportOutline,
} from "react-icons/io5";
import type { VehicleType } from "@/types";

function MopedOutline({
  className = "",
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 512 512"
      width={size}
    >
      <circle
        cx="128"
        cy="352"
        r="48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <circle
        cx="352"
        cy="352"
        r="48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M176 352h96M272 352l48-96M176 352l40-72M320 256l64-32M384 224V176"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M216 280h48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
}

const VEHICLE_ICONS: Record<VehicleType, IconType | typeof MopedOutline> = {
  car: IoCarSportOutline,
  bike: IoBicycleOutline,
  scooter: MopedOutline,
  van: IoBusOutline,
};

type VehicleTypeIconProps = {
  type: VehicleType;
  className?: string;
  size?: number;
};

export default function VehicleTypeIcon({
  type,
  className = "",
  size = 28,
}: VehicleTypeIconProps) {
  const Icon = VEHICLE_ICONS[type];

  return <Icon aria-hidden="true" className={className} size={size} />;
}
