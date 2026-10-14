"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api, download } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { ErrorBox, Loading } from "@/components/states";
export default function ResumeDetail() {
  const { id } = useParams<{ id: string }>(); const router = useRouter(); const [msg, setMsg] = useState<string>();
  const { data: r, error, loading, reload } = useLoad(() => api.resume(id), [id]);
  if (loading) return <Loading />; if (error || !r) return <ErrorBox message={error ?? "Not found."} retry={reload} />;
  async function del() { if (!confirm("Delete this resume?")) return; try { await api.deleteResume(id); router.push("/resumes"); } catch (e) { setMsg((e as Error).message); } }
  const meta: [string, string][] = [["File", r.original_filename], ["Type", r.mime_type.includes("pdf") ? "PDF" : "DOCX"], ["Size", `${(r.file_size_bytes / 1024).toFixed(0)} KB`], ["Uploaded", new Date(r.created_at).toLocaleString()], ...(r.updated_at ? [["Updated", new Date(r.updated_at).toLocaleString()] as [string, string]] : [])];
  return (<div className="space-y-4"><h1 className="h-display text-5xl md:text-6xl">{r.resume_name ?? r.original_filename}</h1>
    <div className="flex flex-wrap gap-2"><Link className="btn" href={`/customize?resume=${id}`}>Customize this resume</Link>
      <button className="btn2" onClick={() => download(`/resumes/${id}/download`, r.original_filename).catch((e) => setMsg(e.message))}>Download original</button><button className="btn2" onClick={del}>Delete</button></div>
    {msg && <p role="alert" className="card border-red-700 bg-red-50 text-sm text-red-900">{msg}</p>}
    <dl className="card grid gap-3 sm:grid-cols-2">{meta.map(([k, v]) => <div key={k}><dt className="text-xs font-extrabold uppercase text-black/60">{k}</dt><dd className="break-words">{v}</dd></div>)}</dl>
    <h2 className="text-xl font-extrabold uppercase">Extracted text</h2>
    <div className="card whitespace-pre-wrap break-words text-sm leading-relaxed">{r.extracted_text_preview || "No text was extracted."}{r.extracted_text_length && r.extracted_text_preview && r.extracted_text_length > r.extracted_text_preview.length ? "…" : ""}</div></div>);
}
