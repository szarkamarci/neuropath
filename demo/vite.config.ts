/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Chrome refuses ES-module scripts on file:// pages. The build emits a single
 * IIFE bundle, and this rewrites its tag into a classic deferred script so
 * dist/index.html also opens straight from a folder (venue-safe fallback).
 */
function classicScriptForFileProtocol(): Plugin {
  return {
    name: 'classic-script-for-file-protocol',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/<script type="module" crossorigin src=/g, '<script defer src=').replace(/ crossorigin(?=[ >])/g, '');
    },
  };
}

// Relative base so dist/ works from any static host or straight from a folder.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), classicScriptForFileProtocol()],
  build: {
    outDir: 'dist',
    // One offline bundle is intended; no code splitting for the demo.
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: false,
    rolldownOptions: {
      output: { format: 'iife' },
    },
  },
  test: {
    environment: 'node',
  },
});
