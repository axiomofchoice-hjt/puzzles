import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

// WSL/本机使用系统 Chromium（CDN 不可达时的兜底）；CI 上由 Playwright 自管浏览器（npx playwright install）。
// 可用 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH 显式覆盖。
const systemChromium = process.env.CI
  ? undefined
  : ['/usr/bin/chromium-browser', '/usr/bin/chromium'].find((p) => existsSync(p))
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? systemChromium

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  // html reporter：失败时生成 playwright-report/（CI artifact 依赖此目录）
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    ...devices['Desktop Chrome'],
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  webServer: {
    command: 'pnpm dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
