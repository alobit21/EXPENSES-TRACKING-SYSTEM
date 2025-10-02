"use client"

import React from "react"

export type StatItem = {
  label: string
  value: string | number
  sublabel?: string
}

export default function StatsCards({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.label} className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
          <div className="text-sm text-muted-foreground">{it.label}</div>
          <div className="mt-2 text-2xl font-semibold text-foreground">{it.value}</div>
          {it.sublabel && (
            <div className="mt-1 text-xs text-muted-foreground">{it.sublabel}</div>
          )}
        </div>
      ))}
    </div>
  )
}
