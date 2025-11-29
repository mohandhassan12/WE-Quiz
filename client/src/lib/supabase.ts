import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ixoxyglkpwhggxmomwih.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3h5Z2xrcHdoZ2d4bW9td2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzY0NTQsImV4cCI6MjA3OTg1MjQ1NH0.gyZGxeua5p3Zo6JyMoerZlcctE7tpTqAkZoQHaNrxC4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
