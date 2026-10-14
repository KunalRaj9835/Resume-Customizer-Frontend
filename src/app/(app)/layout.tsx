"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api, appSession } from "@/lib/api";
const nav = [["/dashboard", "Dashboard"], ["/resumes", "Resumes"], ["/job-descriptions", "Job Descriptions"], ["/customize", "Customize"], ["/customizations", "Customized Resumes"]];
export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const [ok, setOk] = useState(false);
  useEffect(() => { supabase().auth.getSession().then(({ data }) => (data.session ? setOk(true) : router.replace("/login"))); }, [router]);
  async function out() { try { await api.logout(); } catch {} appSession.clear(); await supabase().auth.signOut(); router.replace("/login"); }
  if (!ok) return <p role="status" className="p-6 text-white">Loading…</p>;
  return (
    <div className="min-h-screen md:flex">
      <aside className="grid-dark border-b border-white/15 bg-black p-4 text-white md:w-60 md:border-b-0 md:border-r">
        <p className="h-display mb-4 text-3xl text-brand">Resume<br className="hidden md:block" /> Customizer</p>
        <nav className="flex flex-wrap gap-2 md:flex-col">{nav.map(([h, l]) => <Link key={h} href={h} className="h-display px-3 py-2 text-xl hover:text-brand">{l}</Link>)}
          <button onClick={out} className="px-3 py-2 text-left text-sm text-white/60 hover:text-brand">Sign out</button></nav></aside>
      <main id="main" className="grid-light flex-1 text-black"><div className="mx-auto w-full max-w-4xl p-5 md:p-10">{children}</div></main></div>);
}
