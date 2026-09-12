import { Vec } from './Vec'

/** Header / Footer 共用的横条尺寸策略。 */
function makeBar() {
  const bar = {
    fontSize: 25,
    top: 25,
    bottom: 25,
    leftRight: 25,
    getHeight: () => bar.fontSize + bar.top + bar.bottom + 2,
  }
  return bar
}

export const CONFIG = {
  blockSize: 100,
  blockGap: 8,
  mouseEnterOpacity: 0.7,
  mouseEnterLightChange: 0.9,
  mouseDownSize: 94,
  svgRelativeSize: 0.5,
  grid: {
    getBlockMid(v: Vec): Vec {
      return new Vec(
        CONFIG.blockSize * v.x + (CONFIG.blockGap + CONFIG.blockSize) / 2,
        CONFIG.blockSize * v.y + (CONFIG.blockGap + CONFIG.blockSize) / 2,
      )
    },
    getGapMid(v: Vec): Vec {
      return new Vec(
        CONFIG.blockSize * v.x + CONFIG.blockGap / 2,
        CONFIG.blockSize * v.y + CONFIG.blockGap / 2,
      )
    },
    getBlockVertices(v: Vec): { x1: number; y1: number; x2: number; y2: number } {
      return {
        x1: CONFIG.blockGap + v.x * CONFIG.blockSize,
        y1: CONFIG.blockGap + v.y * CONFIG.blockSize,
        x2: CONFIG.blockSize * (v.x + 1),
        y2: CONFIG.blockSize * (v.y + 1),
      }
    },
  },
  header: makeBar(),
  footer: makeBar(),
  buttons: { size: 65, svgSize: 40, gap: 20, right: 20, tipHeight: 45, tipFontSize: 20 },
} as const
