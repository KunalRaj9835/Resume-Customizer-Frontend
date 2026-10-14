function req(v: string | undefined, name: string): string {
  if (!v) throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`);
  return v;
}
export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Resume Customizer",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  get apiBase() { return req(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL").replace(/\/$/, ""); },
  get supabaseUrl() { return req(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"); },
  get supabaseKey() { return req(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"); },
};
