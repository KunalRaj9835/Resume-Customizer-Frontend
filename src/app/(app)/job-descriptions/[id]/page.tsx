"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { ErrorBox, Loading } from "@/components/states";
import { JDForm } from "@/components/JDForm";
export default function JDDetail() {
  const { id } = useParams<{ id: string }>(); const router = useRouter(); const [edit, setEdit] = useState(false); const [delErr, setDelErr] = useState<string>();
  const { data, error, loading, reload } = useLoad(() => api.jobDescription(id), [id]);
  if (loading) return <Loading />; if (error || !data) return <ErrorBox message={error ?? "Not found."} retry={reload} />;
  async function del() { if (!confirm("Delete this job description?")) return; try { await api.deleteJD(id); router.push("/job-descriptions"); } catch (e) { setDelErr((e as Error).message); } }
  if (edit) return (<div className="space-y-4"><h1 className="h-display text-5xl">Edit</h1>
    <JDForm initial={{ title: data.title ?? "", company: data.company_name ?? "", description: data.jd_text }} submitLabel="Save changes"
      onSubmit={async (v) => { await api.updateJD(id, { title: v.title, company: v.company, description: v.description }); setEdit(false); reload(); }} />
    <button className="btn2" onClick={() => setEdit(false)}>Cancel</button></div>);
  return (<div className="space-y-4"><h1 className="h-display text-5xl md:text-6xl">{data.title ?? "Untitled role"}</h1>
    <p className="text-black/60">{data.company_name ?? "No company"} · Added {new Date(data.created_at).toLocaleDateString()}{data.updated_at ? ` · Updated ${new Date(data.updated_at).toLocaleDateString()}` : ""}</p>
    <div className="flex flex-wrap gap-2"><Link className="btn" href={`/customize?jd=${id}`}>Customize a resume</Link><button className="btn2" onClick={() => setEdit(true)}>Edit</button><button className="btn2" onClick={del}>Delete</button></div>
    {delErr && <p role="alert" className="card border-red-700 bg-red-50 text-sm text-red-900">{delErr}</p>}
    <div className="card whitespace-pre-wrap break-words leading-relaxed">{data.jd_text}</div></div>);
}
