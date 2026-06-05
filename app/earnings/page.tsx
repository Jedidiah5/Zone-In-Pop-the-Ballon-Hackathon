import AppHeader from "@/components/AppHeader";
import AppShell from "@/components/AppShell";

export default function EarningsPage() {
  return (
    <AppShell>
      <AppHeader title="Earnings" />
      <main className="flex flex-grow items-center justify-center px-container-padding pb-24 pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="w-full max-w-lg border border-outline-variant bg-surface p-8 text-center lg:max-w-md lg:p-12">
          <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">
            Coming Soon
          </p>
          <h2 className="mt-2 font-headline-md text-headline-md text-primary">
            Earnings Dashboard
          </h2>
          <p className="mt-3 font-body-md text-on-surface-variant">
            Track your daily earnings and compare performance across zones.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
