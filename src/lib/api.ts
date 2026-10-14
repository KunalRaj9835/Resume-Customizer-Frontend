import { env } from "./env";
import { supabase } from "./supabase";
import type { Preferences, Page, Resume, JobDescription, DashboardSummary, Customization } from "./types";

export class ApiError extends Error {
  code = "";
  constructor(public status: number, message: string) { super(message); }
}
const SESSION_KEY = "rc_app_session";
export const appSession = {
  get: () => (typeof window === "undefined" ? null : sessionStorage.getItem(SESSION_KEY)),
  set: (v: string) => sessionStorage.setItem(SESSION_KEY, v),
  clear: () => sessionStorage.removeItem(SESSION_KEY),
};
const MESSAGES: Record<number, string> = {
  403: "You don't have access to this item.", 404: "This item no longer exists.", 409: "This conflicts with existing data.",
  413: "That file is too large.", 422: "Some fields are invalid.", 429: "Too many requests. Please wait and try again.", 500: "The server had a problem. Try again shortly.",
};
const CODES: Record<string, string> = {
  jd_in_use: "This job description is used by a saved customization, so it can't be deleted. Delete that customization first.",
  generation_in_progress: "A resume is already being generated. Wait for it to finish.",
  rate_limited: "Too many requests. Please wait a moment and try again.",
};
// Backend uses resume_id / jd_id / customization_id; the UI uses a uniform `id`.
const norm = <T,>(x: any): T => {
  // Unwrap { data: {...} } / { job_description: {...} } style envelopes.
  if (x && typeof x === "object" && !Array.isArray(x)) {
    const keys = Object.keys(x);
    if (keys.length === 1 && x[keys[0]] && typeof x[keys[0]] === "object") x = x[keys[0]];
  }
  const idKey = ["id", "jd_uuid", "resume_uuid", "customization_id", "jd_id", "resume_id", "job_description_id"].find((k) => typeof x?.[k] === "string")
    ?? Object.keys(x ?? {}).find((k) => /(^|_)(id|uuid)$/i.test(k) && typeof x[k] === "string");
  return { ...x, id: idKey ? x[idKey] : undefined };
};
const normPage = <T,>(p: any): Page<T> => ({ ...p, items: (p.items ?? []).map((i: unknown) => norm<T>(i)) });
async function headers(extra: HeadersInit = {}): Promise<Headers> {
  const { data } = await supabase().auth.getSession();
  const h = new Headers(extra);
  if (data.session) h.set("Authorization", `Bearer ${data.session.access_token}`);
  const s = appSession.get();
  if (s) h.set("X-Session-ID", s); // ASSUMED header name
  return h;
}
export async function request(path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try { res = await fetch(env.apiBase + path, { ...init, headers: await headers(init.headers) }); }
  catch { throw new ApiError(0, "Can't reach the server. Check your connection or that the backend is running."); }
  if (res.status === 401) {
    appSession.clear();
    if (typeof window !== "undefined") window.location.assign("/login?reason=session_ended");
    throw new ApiError(401, "Your session has ended. Please sign in again.");
  }
  if (!res.ok) {
    let detail = "";
    let code = "";
    try { const b = await res.json(); detail = b?.error?.message ?? (typeof b.detail === "string" ? b.detail : ""); code = b?.error?.code ?? ""; } catch {}
    const e = new ApiError(res.status, CODES[code] ?? (detail || MESSAGES[res.status] || `Request failed (${res.status}).`)); e.code = code; throw e;
  }
  return res;
}
async function json<T>(path: string, init?: RequestInit): Promise<T> { return (await request(path, init)).json(); }
const body = (b: unknown): RequestInit => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
const q = (p: Record<string, string | number | undefined>) => "?" + new URLSearchParams(Object.entries(p).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]));

export async function registerSession() {
  const r = await json<{ session_id?: string }>("/auth/session", { method: "POST" });
  if (r.session_id) appSession.set(r.session_id);
}
const PS = 20;
export const api = {
  summary: () => json<DashboardSummary>("/dashboard/summary"),
  resumes: (page = 1) => json<Page<Resume>>("/resumes" + q({ page, page_size: PS })).then((p) => normPage<Resume>(p)),
  resume: (id: string) => json<Resume>(`/resumes/${id}`).then((x) => norm<Resume>(x)),
  uploadResume: (file: File) => { const f = new FormData(); f.append("file", file); return json<Resume>("/resumes", { method: "POST", body: f }); },
  deleteResume: (id: string) => request(`/resumes/${id}`, { method: "DELETE" }),
  jobDescriptions: (page = 1) => json<Page<JobDescription>>("/job-descriptions" + q({ page, page_size: PS })).then((p) => normPage<JobDescription>(p)),
  jobDescription: (id: string) => json<JobDescription>(`/job-descriptions/${id}`).then((x) => norm<JobDescription>(x)),
  // Form state uses description/company; the API wants jd_text/company_name.
  createJD: (f: { title?: string; company?: string; description: string }) =>
    json<JobDescription>("/job-descriptions", { method: "POST", ...body({ jd_text: f.description, title: f.title || undefined, company_name: f.company || undefined }) }).then((x) => norm<JobDescription>(x)),
  updateJD: (id: string, f: { title?: string; company?: string; description?: string }) =>
    json<JobDescription>(`/job-descriptions/${id}`, { method: "PATCH", ...body({ jd_text: f.description, title: f.title, company_name: f.company }) }).then((x) => norm<JobDescription>(x)),
  deleteJD: (id: string) => request(`/job-descriptions/${id}`, { method: "DELETE" }),
  customizations: (page = 1) => json<Page<Customization>>("/customizations" + q({ page, page_size: PS })).then((p) => normPage<Customization>(p)),
  customization: (id: string) => json<Customization>(`/customizations/${id}`).then((x) => norm<Customization>(x)),
  createCustomization: (b: { resume_id: string; jd_id: string; preferences?: Preferences }) => json<Customization>("/customizations", { method: "POST", ...body(b) }).then((x) => norm<Customization>(x)),
  logout: () => request("/auth/logout", { method: "POST" }),
};
export async function download(path: string, fallbackName: string) {
  const res = await request(path);
  const blob = await res.blob();
  const m = /filename="?([^";]+)"?/.exec(res.headers.get("content-disposition") ?? "");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = m?.[1] ?? fallbackName; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
