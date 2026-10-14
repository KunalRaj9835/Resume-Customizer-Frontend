"use client";
import Link from "next/link";
import { useState } from "react";
import { api, download } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { Empty, ErrorBox, Loading } from "@/components/states";
export default function Resumes() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useLoad(() => api.resumes(page), [page]);
  async function del(id: string) { if (!confirm("Delete this resume? This can't be undone.")) return; try { await api.deleteResume(id); reload(); } catch (e) { alert((e as Error).message); } }
  return (<div className="space-y-4"><div className="flex items-center justify-between"><h1 className="h-display text-5xl md:text-6xl">Resumes</h1><Link className="btn" href="/resumes/upload">Upload resume</Link></div>
    {loading ? <Loading /> : error || !data ? <ErrorBox message={error ?? "No data."} retry={reload} /> : !data.items.length ? <Empty title="No resumes yet" hint="Upload a PDF or DOCX to get started." /> :
      <ul className="space-y-2">{data.items.map((r) => <li key={r.id} className="card flex flex-wrap items-center justify-between gap-2"><Link href={`/resumes/${r.id}`} className="min-w-0 flex-1 hover:text-brand"><p className="truncate text-xl font-extrabold uppercase">{r.resume_name ?? r.original_filename}</p><p className="text-sm text-ink/60">{r.mime_type.includes("pdf") ? "PDF" : "DOCX"} · {(r.file_size_bytes / 1024).toFixed(0)} KB · {new Date(r.created_at).toLocaleDateString()}</p></Link>
        <div className="flex flex-wrap gap-2"><Link className="btn" href={`/customize?resume=${r.id}`}>Customize</Link><button className="btn2" onClick={() => download(`/resumes/${r.id}/download`, r.original_filename).catch((e) => alert(e.message))}>Download</button><button className="btn2" onClick={() => del(r.id)}>Delete</button></div></li>)}</ul>}
    {data && data.total > data.page_size && <div className="flex gap-2"><button className="btn2" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="btn2" disabled={page * data.page_size >= data.total} onClick={() => setPage(page + 1)}>Next</button></div>}</div>);
}
