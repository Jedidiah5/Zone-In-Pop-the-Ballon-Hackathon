"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { APP_IMAGES } from "@/lib/images";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user?.identities?.length === 0) {
          setError("This email is already registered. Sign in instead.");
          return;
        }

        if (data.session) {
          router.push("/onboarding");
          router.refresh();
          return;
        }

        setMessage(
          "Account created. Check your email to confirm your account, then sign in."
        );
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .maybeSingle();

      router.push(
        profileData?.onboarding_completed ? "/zones" : "/onboarding"
      );
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-white text-black lg:grid lg:grid-cols-2">
      <div className="bolt-hero-curve relative hidden h-full min-h-dvh overflow-hidden lg:block">
        <Image
          alt=""
          className="object-cover opacity-80"
          fill
          priority
          sizes="50vw"
          src={APP_IMAGES.heroMap}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-[#F7F7F7]/90" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <p className="text-3xl font-bold tracking-[-0.04em]">
            ZoneIn<span className="text-black font-bold">.</span>
          </p>
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.06em]">
              Drive smarter across London.
            </h2>
            <p className="mt-3 max-w-md text-lg text-[#666666]">
              Live zone demand, surge intel, and one-tap navigation for gig
              drivers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-dvh flex-col lg:justify-center lg:px-12">
        <div className="bolt-hero-curve relative h-[42dvh] overflow-hidden lg:hidden">
          <Image
            alt=""
            className="object-cover opacity-70"
            fill
            priority
            sizes="100vw"
            src={APP_IMAGES.heroMap}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F7F7F7]" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-3xl font-bold tracking-[-0.04em]">
              ZoneIn<span className="text-black font-bold">.</span>
            </p>
          </div>
        </div>

        <div className="relative -mt-8 flex flex-1 flex-col rounded-t-lg bg-[#F7F7F7] px-6 pb-8 pt-8 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-[-0.05em] lg:text-3xl">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              {isSignup
                ? "Sign up to save your zones and profile across devices."
                : "Sign in with the email and password you used to sign up."}
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#999999]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="bolt-input"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#999999]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className="bolt-input pr-12"
                    id="password"
                    minLength={6}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md text-[#666666] active:opacity-70"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" size={20} strokeWidth={2.5} />
                    ) : (
                      <Eye aria-hidden="true" size={20} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  className="rounded-md border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3 text-sm font-bold text-black"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {message && (
                <p
                  className="rounded-md border border-black bg-[#F5F5F5] px-4 py-3 text-sm font-bold text-black"
                  role="status"
                >
                  {message}
                </p>
              )}

              <button
                className="bolt-btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoading}
                type="submit"
              >
                {isLoading
                  ? isSignup
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-bold text-[#666666]">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                className="text-black active:opacity-80"
                href={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Sign in" : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
