import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o build funciona em qualquer hospedagem ou subpasta.
  base: './',
  build: { target: 'es2020', sourcemap: false },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    env: { VITE_AGENDAMENTO_API: 'http://api.test/api', VITE_WHATSAPP: '5511999999999' },
  },
});
