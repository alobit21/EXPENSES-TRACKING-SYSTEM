"use client"

import React from "react"
import {
  ResponsiveContainer,
  LineChart as RCLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export type XYPoint = { x: number | string; y: number }

export default function ReLineChart({ data, stroke = "#2563eb" }: { data: XYPoint[]; stroke?: string }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <RCLineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke={stroke} strokeWidth={2} dot={false} name="Count" />
        </RCLineChart>
      </ResponsiveContainer>
    </div>
  )
}
