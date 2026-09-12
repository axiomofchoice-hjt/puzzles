import { expect, test } from '@playwright/test'
import { collectPageErrors, gotoLevel } from './helpers'

/** 关卡序号 → header.message（顺序与 src/stages/index.ts 的 LEVELS 一一对应） */
const LEVELS: [number, string][] = [
  [1, '猜数'],
  [2, '填充'],
  [3, '地砖'],
  [4, '扫雷'],
  [5, '24 点'],
  [6, '直径'],
  [7, '填充 2.0'],
  [8, '二进制'],
  [9, '开关'],
  [10, '点灯'],
  [11, '光'],
  [12, '平移'],
  [13, '十字'],
  [14, '找不同'],
  [15, '对称'],
  [16, '交换'],
  [17, '化学'],
  [18, '水滴'],
  [19, '博弈'],
  [20, '爱心'],
  [21, '刷子'],
  [22, '寻宝'],
  [23, '赛车'],
  [24, '指令循环'],
  [25, '数间'],
  [26, '贪吃蛇'],
  [27, '运算'],
  [28, '星之战'],
  [29, '独棋'],
]

for (const [level, message] of LEVELS) {
  test(`#${level} 初始渲染：${message}`, async ({ page }) => {
    await gotoLevel(page, level)
    await expect(page.getByTestId('header-message')).toHaveText(message)
    await expect(page.getByTestId('header-level')).toHaveText(`第 ${level} 关`)
    expect(await page.getByTestId('block').count()).toBeGreaterThan(0)
  })
}

test('29 关遍历点击与按键：无运行期错误', async ({ page }) => {
  test.setTimeout(180_000)
  const getErrors = collectPageErrors(page)

  for (const [level] of LEVELS) {
    await gotoLevel(page, level)
    // 逐次点击当前可交互块（DOM 每次会变，重查询），最多 12 次
    for (let i = 0; i < 12; i++) {
      const el = page.locator('[data-clickable="true"]').first()
      if ((await el.count()) === 0) break
      await el.click({ timeout: 2000 }).catch(() => {})
    }
    // 覆盖键盘分支（运算/方向/回车/空格/确认）
    for (const key of [
      'Space',
      'Equal',
      'NumpadAdd',
      'Enter',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'ArrowLeft',
    ]) {
      await page.keyboard.press(key).catch(() => {})
    }
  }

  expect(getErrors()).toEqual([])
})
