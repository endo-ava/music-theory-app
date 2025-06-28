import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'storybook-static/',
        '**/*.stories.*',
        '**/*.test.*',
        '**/*.config.*',
        '.next/',
      ],
    },
    // CI最適化
    ...(process.env.CI && {
      minThreads: 1,
      maxThreads: 2,
      reporter: ['verbose', 'junit'],
      outputFile: './test-results.xml',
    }),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
