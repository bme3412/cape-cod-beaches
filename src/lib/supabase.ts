import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side client with full access (for API routes and cron jobs)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}

// Client-side client with anon key (read-only public data)
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
