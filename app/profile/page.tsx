import AppHeader from "@/components/AppHeader";
import AppShell from "@/components/AppShell";

export default function ProfilePage() {
  return (
    <AppShell>
      <AppHeader title="Profile" />
      <main className="flex flex-1 flex-grow items-center justify-center bg-primary-container px-container-padding pb-24 pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="w-full max-w-lg border border-white/10 bg-white/5 p-8 text-center lg:max-w-md lg:p-12">
          <p className="font-label-caps text-label-caps uppercase text-on-primary/60">
            Coming Soon
          </p>
          <h2 className="mt-2 font-headline-md text-headline-md text-on-primary">
            Driver Profile
          </h2>
          <p className="mt-3 font-body-md text-on-primary/70">
            Manage your platform preferences, location, and saved zones.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
