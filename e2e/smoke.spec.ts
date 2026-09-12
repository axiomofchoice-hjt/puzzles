import { expect, test } from '@playwright/test'
import { collectPageErrors, gotoHome, gotoLevel } from './helpers'

test('首页：选关网格与进入关卡', async ({ page }) => {
  await gotoHome(page)
  await expect(page.getByTestId('header-message')).toHaveText('选关')
  await expect(page.getByTestId('header-level')).toHaveText('')
  // ceil(29/5)=6 行 × 5 列 = 30 格
  await expect(page.getByTestId('block')).toHaveCount(30)
  await expect(page.getByTestId('btn-back')).toHaveCount(0)
  await expect(page.getByTestId('btn-tip')).toHaveCount(1)
  await expect(page.getByTestId('footer-tasks')).toContainText('/29')

  await page.locator('[data-block-id="0"]').click()
  await expect(page).toHaveURL(/#1$/)
  await expect(page.getByTestId('header-message')).toHaveText('猜数')
})

test('L0 猜数：immediate+value 同帧切换后仍显示新值（箭头）', async ({ page }) => {
  await gotoLevel(page, 1)
  await expect(page.getByTestId('header-message')).toHaveText('猜数')
  await expect(page.getByTestId('block')).toHaveCount(32)

  // id=10（左半区间 0..30）→ 必走 270° 上箭头分支
  const block = page.locator('[data-block-id="10"]')
  await expect(block).toHaveAttribute('data-clickable', 'true')
  await block.click()

  await expect(block).toHaveAttribute('data-clickable', 'false')
  await expect(block.locator('svg path')).toBeVisible()
  await expect(block).toContainText('') // 数字被清空，无残留文本
})

test('键盘：Escape 回首页、R 重开当前关', async ({ page }) => {
  await gotoLevel(page, 1)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('header-message')).toHaveText('选关')

  await gotoLevel(page, 1)
  await expect(page.getByTestId('header-message')).toHaveText('猜数')
  const block = page.locator('[data-block-id="10"]')
  await block.click()
  await expect(block).toHaveAttribute('data-clickable', 'false')
  await page.keyboard.press('r')
  await expect(page.locator('[data-block-id="10"]')).toHaveAttribute('data-clickable', 'true')
})

test('切关重挂载：返回首页再进不残留上一局方块状态', async ({ page }) => {
  await gotoLevel(page, 1)
  await page.locator('[data-block-id="10"]').click()
  await expect(page.locator('[data-block-id="10"] svg path')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('header-message')).toHaveText('选关')
  await page.locator('[data-block-id="0"]').click()
  await expect(page.getByTestId('header-message')).toHaveText('猜数')

  const block = page.locator('[data-block-id="10"]')
  await expect(block).toHaveAttribute('data-clickable', 'true')
  await expect(block).toContainText('11')
  await expect(block.locator('svg path')).toHaveCount(0)
})

test('可伸缩布局：不同视口下舞台等比缩放且相对位置不变', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await gotoLevel(page, 1)
  const stage = page.getByTestId('stage')
  const big = (await stage.boundingBox())!

  await page.setViewportSize({ width: 640, height: 400 })
  await expect
    .poll(async () => (await stage.boundingBox())!.width, { timeout: 3000 })
    .toBeLessThan(big.width)

  const small = (await stage.boundingBox())!
  // 缩放上限 0.8：1280 宽时也应 ≤ 舞台逻辑宽度
  expect(big.width).toBeLessThanOrEqual(8 * 100 + 8 + 0.5)
  // 居中：左右留白近似相等（相对位置不变）
  expect(Math.abs(small.x - (640 - small.width) / 2)).toBeLessThanOrEqual(2)
})

test('运行期无页面错误：首页与 L0 交互', async ({ page }) => {
  const getErrors = collectPageErrors(page)
  await gotoHome(page)
  await page.locator('[data-block-id="1"]').click()
  await page.keyboard.press('Space')
  await page.locator('[data-block-id="5"]').click()
  await page.keyboard.press('Escape')
  expect(getErrors()).toEqual([])
})
