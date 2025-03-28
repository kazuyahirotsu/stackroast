import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined. Please set this environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please set this environment variable.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type User = {
  id: string;
  created_at: string;
  email: string;
  name?: string;
};

export type Stack = {
  id: string;
  created_at: string;
  user_id: string;
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  hosting: string;
  styling: string;
  misc?: string;
};

export type Roast = {
  id: string;
  created_at: string;
  stack_id: string;
  content: string;
  is_public: boolean;
}; 