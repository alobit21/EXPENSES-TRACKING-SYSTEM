"use client"

import React from "react"

type Bar = { label: string; value: number; color?: string }

function palette(n: number) {
  const base = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"]
  return Array.from({ length: n }, (_, i) => base[i % base.length])
}

export default function BarChart({ data, height = 160 }: { data: Bar[]; height?: number }) {
  const width = 600
  const pad = 16
  const maxV = Math.max(...data.map((d) => d.value), 1)
  const barW = (width - pad * 2) / (data.length || 1)
  const colors = palette(data.length)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect x={0} y={0} width={width} height={height} className="fill-white dark:fill-gray-900" />
      {data.map((d, i) => {
        const h = ((d.value / maxV) * (height - pad * 2)) | 0
        const x = pad + i * barW + 4
        const y = height - pad - h
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW - 8} height={h} rx={4} style={{ fill: d.color || colors[i] }} />
            <text x={x + (barW - 8) / 2} y={height - 4} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-[10px]">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
