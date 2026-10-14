"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";
import Scene3D from "@/components/Scene3D";
function Form() {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string>();
  const ended = useSearchParams().get("reason") === "session_ended";
  async function go() {
    setBusy(true); setErr(undefined);
    const { error } = await supabase().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${env.appUrl}/auth/callback` } });
    if (error) { setErr(error.message); setBusy(false); }
  }
  return (
    <main className="grid-light relative grid min-h-screen place-items-center overflow-hidden p-5"><Scene3D mode="ribbon" /><div className="card relative z-10 w-full max-w-sm">
      <h1 className="h-display text-5xl">Sign in</h1>
      <p className="mt-1 text-sm text-ink/70">Continue with Google. You'll return here after signing in.</p>
      {ended && <p role="status" className="mt-3 rounded bg-amber-50 p-2 text-sm">Your session ended. Please sign in again.</p>}
      {err && <p role="alert" className="mt-3 text-sm text-red-700">{err}</p>}
      <button className="btn mt-5 w-full" onClick={go} disabled={busy}>{busy ? "Redirecting…" : "Continue with Google"}</button>
      <Link href="/" className="mt-4 block text-center text-sm text-black/60 underline hover:text-brand">Back to home</Link></div></main>);
}
export default function Login() { return <Suspense><Form /></Suspense>; }
