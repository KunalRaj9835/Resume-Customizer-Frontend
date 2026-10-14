"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { registerSession } from "@/lib/api";

// Rejects instead of hanging forever, so a stuck step becomes a visible error.
const withTimeout = <T,>(p: Promise<T>, label: string, ms = 20000) =>
  Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`Timed out at: ${label}`)), ms)),
  ]);

export default function Callback() {
  const router = useRouter();
  const [err, setErr] = useState<string>();
  const [step, setStep] = useState("starting");

  useEffect(() => {
    let current = "starting";
    const mark = (s: string) => { current = s; setStep(s); };
    (async () => {
      try {
        const p = new URLSearchParams(window.location.search);
        if (p.get("error")) throw new Error(p.get("error_description") ?? "Sign-in was cancelled.");
        const code = p.get("code");
        if (code) {
          mark("exchanging code with Supabase");
          const { error } = await withTimeout(supabase().auth.exchangeCodeForSession(code), "exchange code");
          if (error) throw error;
        }
        mark("reading session");
        const { data } = await withTimeout(supabase().auth.getSession(), "getSession");
        if (!data.session) throw new Error("No session was created. Please try again.");
        mark("registering with backend");
        await withTimeout(registerSession(), "backend /auth/session");
        router.replace("/dashboard");
      } catch (e) {
        console.error("Callback failed at step:", current, e);
        setErr(`${e instanceof Error ? e.message : "Sign-in failed."} (step: ${current})`);
      }
    })();
  }, [router]);

  return (
    <main className="p-10 text-center">
      {err ? (
        <>
          <p role="alert" className="text-red-700">{err}</p>
          <a className="btn mt-4" href="/login">Back to sign in</a>
        </>
      ) : (
        <p role="status">Signing you in… ({step})</p>
      )}
    </main>
  );
}