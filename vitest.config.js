import { defineConfig } from 'vitest/config';

// Kept separate from vite.config.js so unit tests run in a plain Node
// environment without booting the SvelteKit plugin.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js', 'scripts/**/*.test.js'],
  },
});
