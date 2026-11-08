import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    // Safety net: if any test imports src/db.ts, it gets a throwaway in-memory
    // database instead of the real oncampus.db. NODE_ENV=test also stops
    // src/index.ts from starting the HTTP server.
    env: {
      DB_PATH: ':memory:',
      NODE_ENV: 'test',
    },
  },
});
