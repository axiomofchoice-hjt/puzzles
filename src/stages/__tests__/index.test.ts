import { describe, it, expect } from 'vitest'
import { LEVELS } from '../index'

const EXPECTED_MESSAGES = [
  '猜数',
  '填充',
  '地砖',
  '扫雷',
  '24 点',
  '直径',
  '填充 2.0',
  '二进制',
  '开关',
  '点灯',
  '光',
  '平移',
  '十字',
  '找不同',
  '对称',
  '交换',
  '化学',
  '水滴',
  '博弈',
  '爱心',
  '刷子',
  '寻宝',
  '赛车',
  '指令循环',
  '数间',
  '贪吃蛇',
  '运算',
  '星之战',
  '独棋',
]

describe('stages', () => {
  it('共 29 关且顺序正确（L0..L28）', () => {
    expect(LEVELS.length).toBe(29)
    expect(LEVELS.map((l) => l.headerMessage)).toEqual(EXPECTED_MESSAGES)
  })
})
