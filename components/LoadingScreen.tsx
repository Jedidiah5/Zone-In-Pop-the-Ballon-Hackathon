import ZoneInLogo from "@/components/ZoneInLogo";

type LoadingScreenProps = {
  message?: string;
  className?: string;
  compact?: boolean;
};

export default function LoadingScreen({
  message = "Loading...",
  className = "",
  compact = false,
}: LoadingScreenProps) {
  if (compact) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center gap-3 ${className}`}
      >
        <ZoneInLogo size={40} />
        <p className="text-sm font-bold text-[#666666]">{message}</p>
      </div>
    );
  }

  return (
    <main
      className={`flex min-h-dvh flex-col items-center justify-center gap-4 bg-white ${className}`}
    >
      <ZoneInLogo className="animate-pulse" size={64} />
      <p className="text-sm font-bold text-[#666666]">{message}</p>
    </main>
  );
}
