"use client"

import React from "react"

type Item = {
  id: string | number
  title: string
  meta: string
}

export default function ActivityFeed({ items, title = "Recent Activity" }: { items: Item[]; title?: string }) {
  return (
    <section className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="text-muted-foreground text-sm">No recent activity</li>
        ) : (
          items.map((it) => (
            <li key={it.id} className="flex justify-between text-sm">
              <span className="text-foreground">{it.title}</span>
              <span className="text-muted-foreground">{it.meta}</span>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
