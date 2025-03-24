import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    retries: 0,
    baseUrl: "http://localhost:9999",
    slowMo: 50000, // slow down each command by xx ms
    defaultCommandTimeout: 10000, // 10 seconds
    watchForFileChanges: false, // disables auto-reloading when tests change
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    pecPattern: "src/component/**/*.spec.{js,ts,jsx}"
  },
});
