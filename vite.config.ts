import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // SSR configuration
  ssr: {
    noExternal: [
      'react-helmet-async',
      'react-router-dom',
      '@radix-ui/react-slot',
      'lucide-react'
    ]
  },
  build: {
    rollupOptions: command === 'build' && process.env.BUILD_SSR ? {
      input: './src/App.tsx',
      output: {
        format: 'es'
      }
    } : undefined
  }
}));
