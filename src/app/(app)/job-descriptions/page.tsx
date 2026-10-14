"use client";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { Empty, ErrorBox, Loading } from "@/components/states";
export default function JDs() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useLoad(() => api.jobDescriptions(page), [page]);
  async function del(id: string) {
    if (!confirm("Delete this job description?")) return;
    try { await api.deleteJD(id); reload(); } catch (e) { alert((e as Error).message); }
  }
  return (<div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="h-display text-5xl md:text-6xl">Job Descriptions</h1><Link className="btn" href="/job-descriptions/new">Add job description</Link></div>
    {loading ? <Loading /> : error || !data ? <ErrorBox message={error ?? "No data."} retry={reload} /> : !data.items.length ? <Empty title="No job descriptions yet" hint="Save the roles you're targeting."><Link className="btn" href="/job-descriptions/new">Add job description</Link></Empty> : <>
      <p className="text-sm text-black/60">{data.total} total</p>
      <ul className="space-y-2">{data.items.map((j) => <li key={j.id} className="card flex flex-wrap items-center justify-between gap-3">
        <Link href={`/job-descriptions/${j.id}`} className="min-w-0 flex-1 hover:text-brand"><p className="truncate text-xl font-extrabold uppercase">{j.title ?? "Untitled role"}</p><p className="text-sm text-black/60">{j.company_name ?? "No company"} · Added {new Date(j.created_at).toLocaleDateString()}{j.updated_at ? ` · Updated ${new Date(j.updated_at).toLocaleDateString()}` : ""}</p></Link>
        <div className="flex gap-2"><Link className="btn" href={`/customize?jd=${j.id}`}>Customize</Link><button className="btn2" onClick={() => del(j.id)}>Delete</button></div></li>)}</ul>
      <div className="flex items-center gap-3"><button className="btn2" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm">Page {data.page} of {Math.max(data.total_pages, 1)}</span><button className="btn2" disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>Next</button></div></>}</div>);
}
