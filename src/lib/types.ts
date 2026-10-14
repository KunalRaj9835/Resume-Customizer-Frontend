// ASSUMED shapes: reconcile with the real FastAPI schemas (see docs/api-integration.md).
export interface Page<T> { items: T[]; total: number; page: number; page_size: number; total_pages: number }
export interface Resume { id: string; resume_name?: string | null; original_filename: string; mime_type: string; file_size_bytes: number; created_at: string; updated_at?: string; extracted_text_preview?: string; extracted_text_length?: number }
export interface JobDescription { id: string; jd_id?: string; title?: string | null; company_name?: string | null; jd_text: string; created_at: string; updated_at?: string }
export interface RecentCustomization { customization_id: string; created_at: string; match_score?: number | null; resume_name?: string | null; job_title?: string | null }
export interface DashboardSummary { uploaded_resumes: number; saved_job_descriptions: number; retained_customizations: number; customizations_last_7_days: number; average_match_score?: number | null; latest_customization_at?: string | null; recent_customizations?: RecentCustomization[] }
export interface ResumeContent {
  name?: string; contact?: string[]; summary?: string; skills?: string[];
  experience?: { title?: string; company?: string; dates?: string; bullets?: string[] }[];
  education?: { degree?: string; school?: string; dates?: string }[];
  projects?: { name?: string; description?: string; bullets?: string[] }[];
  certifications?: string[];
  additional?: { heading: string; items: string[] }[];
}
export interface Customization { id: string; created_at: string; resume_id?: string; resume_name?: string; downloads?: unknown; jd_id?: string; customization_id?: string; job_title?: string; company?: string; match_score?: number; content?: ResumeContent }

export type Tone = "professional" | "concise" | "confident" | "technical";
export interface Preferences { tone?: Tone; emphasis?: string }
