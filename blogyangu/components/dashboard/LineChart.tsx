"use client"

import React from "react"

type Point = { x: number; y: number }

export default function LineChart({
  data,
  height = 160,
}: {
  data: Point[]
  height?: number
}) {
  const width = 600
  const pad = 16
  const xs = data.map((d) => d.x)
  const ys = data.map((d) => d.y)
  const minX = Math.min(...xs, 0)
  const maxX = Math.max(...xs, 1)
  const minY = Math.min(...ys, 0)
  const maxY = Math.max(...ys, 1)
  const sx = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2)
  const sy = (y: number) => height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2)
  const d = data
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`)
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect x={0} y={0} width={width} height={height} className="fill-white dark:fill-gray-900" />
      <path d={d} className="stroke-blue-600 dark:stroke-blue-400" fill="none" strokeWidth={2} />
      {data.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2.5} className="fill-blue-600 dark:fill-blue-400" />
      ))}
    </svg>
  )
}
