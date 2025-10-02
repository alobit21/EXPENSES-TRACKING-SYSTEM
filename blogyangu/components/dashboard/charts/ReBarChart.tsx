"use client"

import React from "react"
import {
  ResponsiveContainer,
  BarChart as RCBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"

export type BarDatum = { label: string; value: number; color?: string }

const palette = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f43f5e", "#10b981"]

export default function ReBarChart({ data }: { data: BarDatum[] }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <RCBarChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fill: "#6b7280" }} interval={0} angle={-35} textAnchor="end" height={70} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count">
            {data.map((d, i) => (
              <Cell key={`c-${i}`} fill={d.color || palette[i % palette.length]} />
            ))}
          </Bar>
        </RCBarChart>
      </ResponsiveContainer>
    </div>
  )
}
