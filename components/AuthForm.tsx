"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <main className="overflow-y-auto bg-[#0A0A0A] px-5 pb-6 pt-safe text-white md:flex md:min-h-dvh md:items-center md:justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col py-4 md:rounded-2xl md:border md:border-[#222222] md:bg-[#111111] md:p-6">
        <div className="mb-5 text-xl font-bold tracking-[-0.04em] md:text-2xl">
          ZoneIn<span className="text-[#F5A623]">.</span>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.06em] text-white md:text-3xl">
            {isSignup ? "Create account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#888888]">
            {isSignup
              ? "Sign up to save your zones and profile across devices."
              : "Sign in with the email and password you used to sign up."}
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-3 block text-xs font-bold uppercase tracking-[0.14em] text-[#555555]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoComplete="email"
              className="h-12 w-full touch-manipulation rounded-lg border border-[#222222] bg-[#141414] px-4 text-base font-bold text-white outline-none transition-colors placeholder:text-[#555555] focus:border-[#F5A623]"
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
              className="mb-3 block text-xs font-bold uppercase tracking-[0.14em] text-[#555555]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="h-12 w-full touch-manipulation rounded-lg border border-[#222222] bg-[#141414] px-4 text-base font-bold text-white outline-none transition-colors placeholder:text-[#555555] focus:border-[#F5A623]"
              id="password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 6 characters"
              required
              type="password"
              value={password}
            />
          </div>

          {error && (
            <p
              className="rounded-lg border border-[#FF3B30] bg-[#FF3B30]/10 px-4 py-3 text-sm font-bold text-[#FF3B30]"
              role="alert"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              className="rounded-lg border border-[#00FF94] bg-[#00FF94]/10 px-4 py-3 text-sm font-bold text-[#00FF94]"
              role="status"
            >
              {message}
            </p>
          )}

          <button
            className="mt-1 flex h-12 w-full touch-manipulation cursor-pointer items-center justify-center rounded-lg bg-[#F5A623] text-sm font-bold uppercase tracking-[0.08em] text-[#0A0A0A] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
            type="submit"
          >
            {isLoading
              ? isSignup
                ? "CREATING ACCOUNT..."
                : "SIGNING IN..."
              : isSignup
                ? "CREATE ACCOUNT"
                : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-bold text-[#888888]">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="text-[#F5A623] active:opacity-80"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
