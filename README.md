# Puzzles

Blockchallenge 重制版（React + TypeScript + Vite）

[传送门](https://axiomofchoice-hjt.github.io/puzzles/)

## 关于游戏

这是一个解谜游戏，每关都是有独立的规则和玩法，但是并不会直接告诉玩家，需要玩家去发掘出来。

每个游戏关卡底部会有任务进度提示。当然，任务的含义也是隐藏的规则。

游戏可以只用鼠标游玩。对于一些特定的关卡，方向键也会有作用。

关卡难度没有单调性，遇到卡关可以考虑跳过。

## 关于代码

使用 TypeScript + React 19 开发的网页小游戏，没有后端。关卡状态用 zustand + immer 管理，动画使用 framer-motion。

纯逻辑集中在 `src/game/`（零 React 依赖）：`tools.ts` 是通用数组/几何工具，`board.ts` 封装整盘重绘与邻域枚举，`Line.ts`/`Frac.ts` 等按职责拆分；每个关卡只描述自己的规则（`src/stages/L*.ts`），不重复实现公共逻辑。

## 开发

pnpm install
pnpm dev

构建：pnpm build（产物在 dist/）
