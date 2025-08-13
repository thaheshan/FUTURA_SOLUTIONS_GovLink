// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other env variables if needed, e.g.:
  // readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}