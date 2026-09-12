import type { Page } from '@playwright/test'

/** 进入指定关卡（hash 路由 #N；#home 为选关页） */
export async function gotoLevel(page: Page, level: number) {
  await page.goto(`/#${level}`)
  await page.getByTestId('stage').waitFor({ state: 'visible' })
}

export async function gotoHome(page: Page) {
  await page.goto('/#home')
  await page.getByTestId('stage').waitFor({ state: 'visible' })
}

/** 收集页面运行期错误（pageerror + console.error），返回读取函数 */
export function collectPageErrors(page: Page): () => string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`)
  })
  return () => errors
}
