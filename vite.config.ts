import * as path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild'
  },
  esbuild: {
    target: 'es2020',
    logOverride: { 
      'this-is-undefined-in-esm': 'silent'
    }
  }
});