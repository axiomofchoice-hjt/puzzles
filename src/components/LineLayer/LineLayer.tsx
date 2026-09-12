import type { Line } from '@/game/Line'

export function LineLayer({ width, height, lines }: { width: number; height: number; lines: Line[] }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      {lines.map((l) => (
        <line
          key={l.id}
          x1={l.pos[0].y}
          y1={l.pos[0].x}
          x2={l.pos[1].y}
          y2={l.pos[1].x}
          style={{ stroke: l.color.toString(l.opacity), strokeWidth: l.width }}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
