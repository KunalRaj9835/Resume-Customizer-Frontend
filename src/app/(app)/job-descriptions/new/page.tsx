"use client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { JDForm } from "@/components/JDForm";
export default function NewJD() {
  const router = useRouter();
  return (<div className="space-y-4"><h1 className="h-display text-5xl">Add job description</h1>
    <JDForm submitLabel="Save" onSubmit={async (v) => { const j = await api.createJD(v); router.push(j.id ? `/job-descriptions/${j.id}` : "/job-descriptions"); }} /></div>);
}
