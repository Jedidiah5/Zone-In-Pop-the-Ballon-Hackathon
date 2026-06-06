import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    let onboardingDone = false;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (!error) {
      onboardingDone = Boolean(profile?.onboarding_completed);
    } else {
      const { data: legacyProfile } = await supabase
        .from("profiles")
        .select("platform, home_area")
        .eq("id", user.id)
        .maybeSingle();

      onboardingDone = Boolean(
        legacyProfile?.platform && legacyProfile?.home_area
      );
    }

    if (!onboardingDone) {
      redirect("/onboarding");
    }

    redirect("/zones");
  }

  // LandingPage handles returning-driver localStorage (zonein_driver_id, zonein_last_platform).
  return <LandingPage />;
}
