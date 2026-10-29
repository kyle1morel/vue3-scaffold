import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'html', 'json', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/index.ts',

        // Type-only files
        'src/**/*.d.ts',
        'src/interfaces/**',
        'src/types/**',

        // Migrations and migration helpers.
        'src/db/migrations/**',
        'src/db/utils/migrations/**',

        // Local development data
        'src/db/seeds/**',

        ...coverageConfigDefaults.exclude
      ]
    },
    globals: true,
    reporters: ['verbose'],
    setupFiles: ['./tests/__mocks__/prismaMock.ts']
  }
});
