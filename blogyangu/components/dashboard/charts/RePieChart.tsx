"use client"

import React, { useMemo } from "react"
import {
  ResponsiveContainer,
  PieChart as RCPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

export type PieDatum = { label: string; value: number; color?: string }

const palette = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"]

export default function RePieChart({ data, innerRadius = 60, outerRadius = 110 }: { data: PieDatum[]; innerRadius?: number; outerRadius?: number }) {
  const total = useMemo(() => Math.max(1, data.reduce((a, d) => a + (d.value || 0), 0)), [data])
  const chartData = data.map((d) => ({ name: d.label, value: d.value, color: d.color }))
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <RCPieChart>
          <Tooltip formatter={(val: any, _n, payload: any) => {
            const v = Number(val) || 0
            const pct = ((v / total) * 100).toFixed(1)
            return [`${v} (${pct}%)`, payload?.name]
          }} />
          <Legend verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: 8 }} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            cornerRadius={4}
            stroke="#0b1220"
            strokeWidth={2}
            labelLine={false}
            label={({ name, value }) => {
              const v = Number(value) || 0
              const pct = (v / total) * 100
              return pct >= 8 ? `${Math.round(pct)}%` : ""
            }}
          >
            {chartData.map((d, i) => (
              <Cell key={`p-${i}`} fill={d.color || palette[i % palette.length]} />
            ))}
          </Pie>
        </RCPieChart>
      </ResponsiveContainer>
    </div>
  )
}
