import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid TypeScript error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Prioritize VITE_API_KEY, then API_KEY.
  // We explicitly check process.env as well to ensure we capture variables injected 
  // by CI/CD platforms (like Netlify) even if loadEnv misses them.
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || "";

  // Log status during build (visible in Netlify Build Logs)
  if (!apiKey) {
    console.warn("⚠️  WARNING: API_KEY is empty or undefined during build. Gemini features will not work.");
  } else {
    console.log("✅  API_KEY detected during build. Injecting into client.");
  }

  return {
    plugins: [react()],
    define: {
      // Use JSON.stringify(apiKey) so it becomes a string literal "AIza..." or "" in the code.
      // This prevents "undefined" token issues or "process is not defined" at runtime.
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Polyfill process.env to avoid "process is not defined" errors in browser contexts
      'process.env': {} 
    },
  };
});