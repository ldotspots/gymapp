import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions for common operations

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function uploadPhoto(file: Blob, workoutId: string): Promise<string> {
  const fileName = `${workoutId}/${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('exercise-photos')
    .upload(fileName, file, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('exercise-photos')
    .getPublicUrl(data.path);

  return publicUrl;
}
