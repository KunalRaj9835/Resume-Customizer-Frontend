import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
let c: SupabaseClient | null = null;
export function supabase() { return (c ??= createClient(env.supabaseUrl, env.supabaseKey)); }
