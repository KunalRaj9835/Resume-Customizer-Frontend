"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Tone } from "@/lib/types";
import { useLoad } from "@/components/useLoad";
import { Empty, ErrorBox, Loading } from "@/components/states";
export default function Customize() {
  const router = useRouter();
  const r = useLoad(() => api.resumes(1)); const j = useLoad(() => api.jobDescriptions(1));
  const [rid, setRid] = useState(""); const [jid, setJid] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState<string>();
  const [tone, setTone] = useState<Tone>("professional");
  useEffect(() => { const sp = new URLSearchParams(window.location.search); const x = sp.get("jd"); if (x) setJid(x); const y = sp.get("resume"); if (y) setRid(y); }, []);
  const [jd, setJd] = useState({ title: "", company: "", description: "" });
  async function addJD() { try { const x = await api.createJD({ title: jd.title || undefined, company: jd.company || undefined, description: jd.description }); setJid(x.id); j.reload(); } catch (e) { setErr((e as Error).message); } }
  async function go() { if (busy) return; setBusy(true); setErr(undefined);
    try { const c = await api.createCustomization({ resume_id: rid, jd_id: jid, preferences: { tone } }); router.push(`/customizations/${c.id}`); }
    catch (e) { setErr((e as Error).message + " Check your history before retrying; the request may have completed."); setBusy(false); } }
  if (r.loading || j.loading) return <Loading />; if (r.error || j.error) return <ErrorBox message={(r.error ?? j.error)!} retry={() => { r.reload(); j.reload(); }} />;
  return (<div className="space-y-6"><h1 className="h-display text-5xl md:text-6xl">New customization</h1>
    <section><h2 className="mb-2 text-xl font-extrabold uppercase">1. Choose a resume</h2>{!r.data?.items.length ? <Empty title="No resumes" hint="Upload one first."><Link className="btn" href="/resumes/upload">Upload resume</Link></Empty> :
      <div role="radiogroup" className="space-y-2">{r.data.items.filter((x) => x.id).map((x) => <label key={x.id} className="card flex gap-3"><input type="radio" name="r" checked={rid === x.id} onChange={() => setRid(x.id)} />{x.resume_name ?? x.original_filename}</label>)}</div>}</section>
    <section><h2 className="mb-2 text-xl font-extrabold uppercase">2. Choose or add a job description</h2>
      <div role="radiogroup" className="space-y-2">{j.data?.items.filter((x) => x.id).map((x) => <label key={x.id} className="card flex gap-3"><input type="radio" name="j" checked={jid === x.id} onChange={() => setJid(x.id)} />{x.title ?? "Untitled"}{x.company_name ? ` at ${x.company_name}` : ""}</label>)}</div>
      <details className="card mt-3"><summary className="cursor-pointer">Add a new job description</summary><div className="mt-3 space-y-2">
        <input className="input" placeholder="Job title (optional)" aria-label="Job title" value={jd.title} onChange={(e) => setJd({ ...jd, title: e.target.value })} />
        <input className="input" placeholder="Company (optional)" aria-label="Company" value={jd.company} onChange={(e) => setJd({ ...jd, company: e.target.value })} />
        <textarea className="input h-40" aria-label="Job description" placeholder="Paste the job description" value={jd.description} onChange={(e) => setJd({ ...jd, description: e.target.value })} />
        <button className="btn2" disabled={jd.description.trim().length < 20} onClick={addJD}>Save job description</button></div></details></section>
    <label className="block text-sm font-extrabold uppercase">Tone <select className="input mt-1" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>{["professional", "concise", "confident", "technical"].map((t) => <option key={t}>{t}</option>)}</select></label>
    <p className="text-sm text-ink/70">The AI is instructed to use only your real experience. Review the result before using it.</p>
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn" disabled={!rid || !jid || busy} onClick={go}>{busy ? "Generating… this can take a minute" : "Generate tailored resume"}</button></div>);
}
