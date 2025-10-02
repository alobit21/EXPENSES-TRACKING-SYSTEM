"use client"

import React, { useState } from "react"

interface Tag {
  id: number
  name: string
  slug: string
}

interface TagModalProps {
  open: boolean
  onClose: () => void
  onCreated: (tag: Tag) => void
}

export default function TagModal({
  open,
  onClose,
  onCreated,
}: TagModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    if (!name || !slug) return setError("Name and slug are required")
    setLoading(true)
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to create tag")
      onCreated(data)
      setName("")
      setSlug("")
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Tag</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded px-4 py-2 text-sm border border-input hover:bg-accent">Cancel</button>
          <button onClick={submit} disabled={loading} className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}
