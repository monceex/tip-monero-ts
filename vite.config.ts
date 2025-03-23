import { copyFileSync, mkdirSync } from "fs";
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Создаем директорию public и копируем файлы
mkdirSync("public", { recursive: true });
[
  {
    src: "node_modules/monero-ts/dist/monero.worker.js",
    dest: "public/monero.worker.js",
  }
].forEach(({ src, dest }) => copyFileSync(src, dest));

export default defineConfig({
  plugins: [
    react(), // Подключаем плагин для React
    tsconfigPaths(), // Подключаем поддержку путей из tsconfig.json
    nodePolyfills({ include: ["http", "https", "fs", "stream", "util", "path"] }), // Подключаем полифиллы для Node.js
    {
      name: "copy-files",
      writeBundle: () =>
        [
          {
            src: "node_modules/monero-ts/dist/monero.worker.js",
            dest: "dist/monero.worker.js",
          }
        ].forEach(({ src, dest }) => copyFileSync(src, dest)),
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        format: "es",
      },
    },
  },
  publicDir: "public",
});