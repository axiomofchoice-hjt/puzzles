// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BlockView } from '@/components/BlockView/BlockView'
import { arrowValue, emptyValue, numValue } from '@/game/BlockValue'
import { GameStoreProvider } from '@/store/GameStoreContext'
import { makeBlock, type Block } from '@/store/types'

function renderBlock(block: Block) {
  return render(
    <GameStoreProvider>
      <BlockView block={block} />
    </GameStoreProvider>,
  )
}

afterEach(cleanup)

describe('BlockView 值切换', () => {
  it('immediate 与 value 同一次更新（L0 点击模式）：清空后立刻淡入新值，而非保持空白', () => {
    const { container, rerender } = renderBlock(makeBlock(0, { value: numValue(1) }))
    expect(container.textContent).toContain('1')

    const next = makeBlock(0, { value: arrowValue(270) })
    next.immediate = emptyValue()
    rerender(
      <GameStoreProvider>
        <BlockView block={next} />
      </GameStoreProvider>,
    )

    expect(container.querySelector('svg path')).not.toBeNull()
  })
})
