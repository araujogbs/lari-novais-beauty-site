import { defineConfig } from 'vite';

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer hospedagem ou subpasta.
  base: './',
  build: { target: 'es2020', sourcemap: true },
});
