import Image from "next/image";
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
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-container-padding backdrop-blur-md lg:h-16 lg:px-8 lg:bg-transparent lg:backdrop-blur-none">
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            alt="ZoneIn Logo"
            className="h-8 w-auto"
            height={32}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFTU27D_0ATOR8k9uvupj68WS9azGx-LH6pGZlsBbCFncTIeJOSHO7jVCWva8sXD8yle2NUJUkUAmcZeQCImidsuauyhIGCzOD7VlINF3pWM2SDLCtLCGn4jwih7Ml3uEYZM5zNkVkCtKPWDOVQqnmznyJXS1Y0hPhbZtpaI_cycJeanxqIZe9FYgjfH7GACwpcIwpy4QOYc2QchUXOLS2V0TJLr2oGdFIgxMsOPBa9UpdAwDUiJ8GVNDgKURSf0arcijoOuoMdTk"
            width={32}
          />
          <span className="font-headline-md-mobile text-headline-md-mobile font-bold tracking-tighter text-primary">
            ZoneIn
          </span>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
            Get Started
          </span>
        </div>
        <button
          aria-label="Menu"
          className="text-primary transition-transform active:scale-95 lg:hidden"
          type="button"
        >
          <MaterialIcon icon="grid_view" />
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-container-padding backdrop-blur-md lg:h-16 lg:px-8">
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          aria-label="Menu"
          className="text-primary transition-transform active:scale-95 lg:hidden"
          type="button"
        >
          <MaterialIcon icon="grid_view" />
        </button>
        <h1 className="font-headline-md-mobile text-headline-md-mobile font-bold tracking-tighter text-primary lg:font-headline-md lg:text-headline-md">
          {title ?? "ZoneIn"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="text-primary transition-transform hover:opacity-70 active:scale-95"
          type="button"
        >
          <MaterialIcon icon="notifications" />
        </button>
      </div>
    </header>
  );
}
