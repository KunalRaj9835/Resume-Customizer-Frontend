"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
const MAX_MB = 10; // ASSUMED: match backend limit
const OK = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export default function Upload() {
  const router = useRouter(); const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>(); const [err, setErr] = useState<string>(); const [busy, setBusy] = useState(false);
  function pick(f?: File) {
    setErr(undefined); if (!f) return;
    if (!OK.includes(f.type) && !/\.(pdf|docx)$/i.test(f.name)) return setErr("Only PDF and DOCX files are supported.");
    if (f.size > MAX_MB * 1024 * 1024) return setErr(`File must be under ${MAX_MB} MB.`);
    setFile(f);
  }
  async function submit() { if (!file || busy) return; setBusy(true); setErr(undefined); try { await api.uploadResume(file); router.push("/resumes"); } catch (e) { setErr((e as Error).message); setBusy(false); } }
  return (<div className="max-w-xl space-y-4"><h1 className="h-display text-5xl md:text-6xl">Upload resume</h1><p className="text-sm text-ink/70">PDF or DOCX, up to {MAX_MB} MB.</p>
    <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }} className="card border-dashed text-center">
      <p className="mb-3">{file ? `${file.name} (${(file.size / 1024).toFixed(0)} KB)` : "Drag a file here, or"}</p>
      <button className="btn2" onClick={() => input.current?.click()}>Choose file</button>
      <input ref={input} type="file" accept=".pdf,.docx" className="sr-only" aria-label="Resume file" onChange={(e) => pick(e.target.files?.[0])} /></div>
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn" disabled={!file || busy} onClick={submit}>{busy ? "Uploading…" : "Upload"}</button></div>);
}
