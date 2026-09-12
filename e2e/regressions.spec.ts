import { expect, test } from '@playwright/test'
import { gotoHome, gotoLevel } from './helpers'

test('第一关：点击后显示箭头且底部任务计数更新', async ({ page }) => {
  await gotoLevel(page, 1)
  const tasks = page.getByTestId('footer-tasks')
  await expect(tasks).toHaveText('[0/1][0/5]')

  const block = page.locator('[data-block-id="10"]')
  await block.click()
  await expect(tasks).toHaveText('[0/1][1/5]')

  const arrow = block.locator('svg path')
  await expect(arrow).toHaveCount(1)
  await expect
    .poll(async () => arrow.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 3000 })
    .toBeGreaterThan(0.9)
})

test('标题/页脚行高按像素生效，文字贴近顶部而非被推到屏幕中部', async ({ page }) => {
  await gotoHome(page)
  const lh = await page
    .getByTestId('header-message')
    .evaluate((el) => getComputedStyle(el).lineHeight)
  expect(lh).toBe('25px')
  const footerLh = await page
    .getByTestId('footer-tasks')
    .evaluate((el) => getComputedStyle(el).lineHeight)
  expect(footerLh).toBe('25px')
})

test('方块数字显示：文本内容存在且行高等于块尺寸（不是无单位倍数）', async ({ page }) => {
  await gotoHome(page)
  const first = page.getByTestId('block').first()
  await expect(first.locator('p')).toHaveText('1')
  const lh = await first
    .locator('p')
    .evaluate((el) => getComputedStyle(el).lineHeight)
  expect(lh).toBe('92px')
})

test('入场无位移动画：方块加载后即在目标位置（不从左上方飞入）', async ({ page }) => {
  await page.goto('/#home')
  await page.waitForSelector('[data-block-id="0"]', { state: 'attached' })
  // 目标 left：pos(0,0) → (0+0.5)*100 + 8/2 - 92/2 = 8px；无 initial={false} 时会从 0 补间过来
  const left = await page
    .locator('[data-block-id="0"]')
    .evaluate((el) => (el as HTMLElement).style.left)
  expect(left).toBe('8px')
})
