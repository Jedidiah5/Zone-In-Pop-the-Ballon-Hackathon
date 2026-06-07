import MaterialIcon from "./MaterialIcon";

type AppHeaderProps = {
  variant?: "onboarding" | "app";
  title?: string;
};

export default function AppHeader({
  variant = "app",
  title,
}: AppHeaderProps) {
  if (variant === "onboarding") {
    return (
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-primary-container bg-primary px-container-padding lg:h-16 lg:px-8">
        <span className="font-headline-md-mobile text-headline-md-mobile font-bold tracking-tighter text-on-primary">
          ZoneIn
        </span>
        <button
          aria-label="Menu"
          className="text-on-primary transition-transform active:scale-95"
          type="button"
        >
          <MaterialIcon icon="grid_view" />
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-primary-container bg-primary px-container-padding lg:h-16 lg:px-8">
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          aria-label="Menu"
          className="text-on-primary transition-transform active:scale-95 lg:hidden"
          type="button"
        >
          <MaterialIcon icon="grid_view" />
        </button>
        <h1 className="font-headline-md-mobile text-headline-md-mobile font-bold tracking-tighter text-on-primary lg:font-headline-md lg:text-headline-md">
          {title ?? "ZoneIn"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="text-on-primary transition-transform hover:opacity-70 active:scale-95"
          type="button"
        >
          <MaterialIcon icon="notifications" />
        </button>
      </div>
    </header>
  );
}
