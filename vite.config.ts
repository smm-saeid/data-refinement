import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'context': path.resolve(__dirname, './src/context'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'modules': path.resolve(__dirname, './src/modules'),
      'services': path.resolve(__dirname, './src/services'),
      'types': path.resolve(__dirname, './src/types'),
    }
  }
})
