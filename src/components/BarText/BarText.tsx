import type { CSSProperties, ReactNode } from 'react'
import styles from './BarText.module.css'

type BarConfig = { fontSize: number; top: number; bottom: number; leftRight: number }

/** Header / Footer 中绝对定位的整行文本，内边距与行高统一取自配置。 */
export function BarText({
  bar,
  align,
  testId,
  style,
  children,
}: {
  bar: BarConfig
  align: 'left' | 'center' | 'right'
  testId?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  return (
    <div
      className={styles.text}
      data-testid={testId}
      style={{
        paddingTop: bar.top,
        paddingBottom: bar.bottom,
        paddingLeft: bar.leftRight,
        paddingRight: bar.leftRight,
        lineHeight: `${bar.fontSize}px`,
        fontSize: bar.fontSize,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
