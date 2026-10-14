"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { registerSession } from "@/lib/api";
export default function Callback() {
  const router = useRouter(); const [err, setErr] = useState<string>();
  useEffect(() => {
    (async () => {
      try {
        const p = new URLSearchParams(window.location.search);
        if (p.get("error")) throw new Error(p.get("error_description") ?? "Sign-in was cancelled.");
        const code = p.get("code");
        if (code) { const { error } = await supabase().auth.exchangeCodeForSession(code); if (error) throw error; }
        const { data } = await supabase().auth.getSession();
        if (!data.session) throw new Error("No session was created. Please try again.");
        await registerSession();
        router.replace("/dashboard");
      } catch (e) { setErr(e instanceof Error ? e.message : "Sign-in failed."); }
    })();
  }, [router]);
  return <main className="p-10 text-center">{err ? <><p role="alert" className="text-red-700">{err}</p><a className="btn mt-4" href="/login">Back to sign in</a></> : <p role="status">Signing you in…</p>}</main>;
}
