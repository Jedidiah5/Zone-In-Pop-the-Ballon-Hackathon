import { AuthApiError } from "@supabase/supabase-js";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    const message = error.message.toLowerCase();

    if (message.includes("invalid login credentials")) {
      return "Wrong email or password. Create an account if you haven't signed up yet.";
    }

    if (message.includes("email not confirmed")) {
      return "Confirm your email first — check your inbox, then sign in.";
    }

    if (message.includes("user already registered")) {
      return "This email is already registered. Sign in instead.";
    }

    if (message.includes("password")) {
      return error.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Try again.";
}
