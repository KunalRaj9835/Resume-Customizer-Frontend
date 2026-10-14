"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, download } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { ErrorBox, Loading } from "@/components/states";
import { ResumePreview } from "@/components/ResumePreview";
export default function Result() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, reload } = useLoad(() => api.customization(id), [id]);
  if (loading) return <Loading />; if (error || !data) return <ErrorBox message={error ?? "Not found."} retry={reload} />;
  const dl = (f: "pdf" | "docx") => download(`/customizations/${id}/download?format=${f}`, `resume.${f}`).catch((e) => alert(e.message));
  return (<div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><h1 className="h-display text-5xl md:text-6xl">{data.job_title ?? "Tailored resume"}{data.company ? ` at ${data.company}` : ""}</h1>
    <div className="flex gap-2"><button className="btn" onClick={() => dl("pdf")}>Download PDF</button><button className="btn2" onClick={() => dl("docx")}>Download DOCX</button><Link className="btn2" href="/customize">New</Link></div></div>
    {data.content ? <ResumePreview c={data.content} /> : <p>No preview content was returned.</p>}</div>);
}
