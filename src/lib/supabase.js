import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ufwpbeaiokjzrzgyrbda.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmd3BiZWFpb2tqenJ6Z3lyYmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjE4MDcsImV4cCI6MjA5NzY5NzgwN30.IL4I7sIcDjBH4XfsR0iJKDGwpuJYn9RXSuWm6m8XSeg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export { SUPABASE_URL }
