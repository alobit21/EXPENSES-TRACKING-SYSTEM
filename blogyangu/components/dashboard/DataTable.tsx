"use client"

import React from "react"

type Column<T> = {
  key: keyof T
  header: string
  render?: (row: T) => React.ReactNode
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  emptyText = "No data",
}: {
  columns: Column<T>[]
  rows: T[]
  emptyText?: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden dark:bg-gray-900 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-white dark:bg-gray-900">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-accent hover:text-accent-foreground">
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 text-sm">
                      {c.render ? c.render(row) : (row[c.key] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
