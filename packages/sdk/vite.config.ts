import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'RayCRM',
      formats: ['es', 'cjs'],
      fileName: 'ray-crm-sdk',
    },
  },
});
