"use client";
import Link from "next/link";
import { useState } from "react";
import { api, download } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { Empty, ErrorBox, Loading } from "@/components/states";
export default function Customized() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useLoad(async () => {
    const [c, r, j] = await Promise.all([api.customizations(page), api.resumes(1).catch(() => null), api.jobDescriptions(1).catch(() => null)]);
    return { c, rn: new Map(r?.items.map((x) => [x.id, x.resume_name ?? x.original_filename])), jn: new Map(j?.items.map((x) => [x.id, [x.title, x.company_name].filter(Boolean).join(" at ") || "Untitled role"])) };
  }, [page]);
  if (loading) return <Loading />; if (error || !data) return <ErrorBox message={error ?? "No data."} retry={reload} />;
  const { c, rn, jn } = data;
  const dl = (id: string, f: "pdf" | "docx") => download(`/customizations/${id}/download?format=${f}`, `resume.${f}`).catch((e) => alert(e.message));
  return (<div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="h-display text-5xl md:text-6xl">Customized Resumes</h1><Link className="btn" href="/customize">New customization</Link></div>
    {!c.items.length ? <Empty title="Nothing here yet" hint="Your tailored resumes will appear here."><Link className="btn" href="/customize">Create one</Link></Empty> : <>
      <p className="text-sm text-black/60">{c.total} total</p>
      <ul className="space-y-2">{c.items.map((x) => <li key={x.id} className="card flex flex-wrap items-center justify-between gap-3">
        <Link href={`/customizations/${x.id}`} className="min-w-0 flex-1 hover:text-brand"><p className="truncate text-xl font-extrabold uppercase">{x.job_title ?? (x.jd_id && jn.get(x.jd_id)) ?? "Customization"}</p>
          <p className="text-sm text-black/60">{x.resume_name ?? (x.resume_id && rn.get(x.resume_id)) ?? "Resume"} · {new Date(x.created_at).toLocaleDateString()}{x.match_score != null ? ` · Match ${Math.round(x.match_score)}` : ""}</p></Link>
        <div className="flex flex-wrap gap-2"><Link className="btn2" href={`/customizations/${x.id}`}>View</Link><button className="btn2" onClick={() => dl(x.id, "pdf")}>PDF</button><button className="btn2" onClick={() => dl(x.id, "docx")}>DOCX</button></div></li>)}</ul>
      <div className="flex items-center gap-3"><button className="btn2" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm">Page {c.page} of {Math.max(c.total_pages, 1)}</span><button className="btn2" disabled={page >= c.total_pages} onClick={() => setPage(page + 1)}>Next</button></div></>}</div>);
}
