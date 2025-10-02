"use client"

import React from "react"

export type PieSlice = { label: string; value: number; color?: string }

function genPalette(n: number): string[] {
  const base = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f43f5e",
    "#10b981",
  ]
  return Array.from({ length: n }, (_, i) => base[i % base.length])
}

export default function PieChart({ data, size = 180, inner = 60 }: { data: PieSlice[]; size?: number; inner?: number }) {
  const total = Math.max(1, data.reduce((a, d) => a + (d.value || 0), 0))
  const r = size / 2
  const colors = genPalette(data.length)
  let angle = -Math.PI / 2
  const cx = r
  const cy = r

  const arcs = data.map((d, i) => {
    const frac = (d.value || 0) / total
    const theta = frac * Math.PI * 2
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    const x2 = cx + r * Math.cos(angle + theta)
    const y2 = cy + r * Math.sin(angle + theta)
    const largeArc = theta > Math.PI ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    angle += theta
    return { path, color: d.color || colors[i] }
  })

  return (
    <div className="flex items-center gap-3">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[280px]">
        <circle cx={cx} cy={cy} r={r} className="fill-white dark:fill-gray-900" />
        {arcs.map((a, i) => (
          <path key={i} d={a.path} style={{ fill: a.color }} />
        ))}
        {/* inner hole */}
        <circle cx={cx} cy={cy} r={inner} className="fill-white dark:fill-gray-900" />
      </svg>
      <div className="text-xs space-y-1 min-w-[140px]">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ background: d.color || colors[i] }} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="ml-auto font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
