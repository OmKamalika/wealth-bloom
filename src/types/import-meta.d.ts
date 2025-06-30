interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other environment variables here that are used with import.meta.env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}