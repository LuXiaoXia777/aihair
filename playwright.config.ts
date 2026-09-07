import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.PREVIEW_URL || "http://127.0.0.1:5173/",
    viewport: { width: 390, height: 844 },
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  webServer: process.env.PREVIEW_URL
    ? undefined
    : {
        command:
          "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173",
        url: "http://127.0.0.1:5173/",
        reuseExistingServer: !process.env.CI,
      },
});
