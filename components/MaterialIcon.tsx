type MaterialIconProps = {
  icon: string;
  className?: string;
  weight?: number;
};

export default function MaterialIcon({
  icon,
  className = "",
  weight = 400,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' 0, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24` }}
    >
      {icon}
    </span>
  );
}
