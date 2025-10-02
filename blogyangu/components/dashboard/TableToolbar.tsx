"use client"

import React from "react"

export default function TableToolbar({
  title,
  onAdd,
  right,
}: {
  title: string
  onAdd?: () => void
  right?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <button className="rounded border border-input px-2 py-1 hover:bg-accent">Filters</button>
        <button className="rounded border border-input px-2 py-1 hover:bg-accent">Fields</button>
        <div className="ml-2 text-muted-foreground hidden sm:block">Showing</div>
      </div>
      <div className="flex items-center gap-2">
        {right}
        {onAdd && (
          <button onClick={onAdd} className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">Add record</button>
        )}
      </div>
    </div>
  )
}
