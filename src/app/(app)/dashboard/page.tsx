"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { useLoad } from "@/components/useLoad";
import { Empty, ErrorBox, Loading } from "@/components/states";
export default function Dashboard() {
  const { data, error, loading, reload } = useLoad(api.summary);
  if (loading) return <Loading />; if (error || !data) return <ErrorBox message={error ?? "No data."} retry={reload} />;
  const avg = data.average_match_score;
  const cards: [string, string | number][] = [
    ["Resumes", data.uploaded_resumes], ["Job descriptions", data.saved_job_descriptions], ["Customizations", data.retained_customizations],
    ["Last 7 days", data.customizations_last_7_days], ["Avg match score", avg == null ? "—" : Math.round(avg)],
    ["Latest", data.latest_customization_at ? new Date(data.latest_customization_at).toLocaleDateString() : "—"],
  ];
  return (<div className="space-y-6"><h1 className="h-display text-5xl md:text-6xl">Dashboard</h1>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([l, n]) => <div key={l} className="card"><p className="h-display text-5xl text-brand">{n}</p><p className="text-sm text-black/60">{l}</p></div>)}</div>
    <div className="flex flex-wrap gap-3"><Link className="btn" href="/resumes/upload">Upload a resume</Link><Link className="btn2" href="/job-descriptions/new">Add job description</Link><Link className="btn2" href="/customize">New customization</Link></div>
    <h2 className="text-xl font-extrabold uppercase">Recent activity</h2>
    {data.recent_customizations?.length ? <ul className="space-y-2">{data.recent_customizations.map((c) => <li key={c.customization_id}><Link className="card block hover:border-brand" href={`/customizations/${c.customization_id}`}><span className="font-extrabold uppercase">{c.job_title ?? "Customization"}</span> <span className="text-sm text-black/60">· {c.resume_name ?? "Resume"} · {new Date(c.created_at).toLocaleDateString()}{c.match_score != null ? ` · Match ${Math.round(c.match_score)}` : ""}</span></Link></li>)}</ul>
      : <Empty title="No customizations yet" hint="Upload a resume and add a job description to create your first one." />}</div>);
}
