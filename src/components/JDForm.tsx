"use client";
import { useState } from "react";
export interface JDValues { title: string; company: string; description: string }
const MAX = 50000;
export function JDForm({ initial, submitLabel, onSubmit }: { initial?: Partial<JDValues>; submitLabel: string; onSubmit: (v: JDValues) => Promise<void> }) {
  const [v, setV] = useState<JDValues>({ title: initial?.title ?? "", company: initial?.company ?? "", description: initial?.description ?? "" });
  const [err, setErr] = useState<string>(); const [busy, setBusy] = useState(false);
  const bad = !v.description.trim() ? "Job description is required." : v.description.length > MAX ? `Max ${MAX.toLocaleString()} characters.` : v.title.length > 200 || v.company.length > 200 ? "Title and company are max 200 characters." : "";
  async function go() { if (bad || busy) return; setBusy(true); setErr(undefined); try { await onSubmit(v); } catch (e) { setErr((e as Error).message); setBusy(false); } }
  return (<div className="max-w-2xl space-y-3">
    <input className="input" aria-label="Job title" placeholder="Job title (optional)" maxLength={200} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} />
    <input className="input" aria-label="Company name" placeholder="Company name (optional)" maxLength={200} value={v.company} onChange={(e) => setV({ ...v, company: e.target.value })} />
    <textarea className="input h-72" aria-label="Job description" placeholder="Paste the job description" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
    <p className={`text-xs ${v.description.length > MAX ? "text-red-700" : "text-black/60"}`}>{v.description.length.toLocaleString()} / {MAX.toLocaleString()}</p>
    {(err || (v.description && bad)) && <p role="alert" className="text-sm text-red-700">{err ?? bad}</p>}
    <button className="btn" disabled={!!bad || busy} onClick={go}>{busy ? "Saving…" : submitLabel}</button></div>);
}
