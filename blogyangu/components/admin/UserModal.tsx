"use client"

import React, { useEffect, useState } from "react"
import { Role } from "@prisma/client"

interface User {
  id?: string
  username: string
  email: string
  displayName?: string
  role: Role
  password?: string
}

interface UserModalProps {
  open: boolean
  onClose: () => void
  onSaved: (user: User) => void
  initialUser?: Partial<User>
  mode?: "create" | "edit"
}

export default function UserModal({
  open,
  onClose,
  onSaved,
  initialUser,
  mode = "create",
}: UserModalProps) {
  const [username, setUsername] = useState(initialUser?.username ?? "")
  const [email, setEmail] = useState(initialUser?.email ?? "")
  const [displayName, setDisplayName] = useState(initialUser?.displayName ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(initialUser?.role ?? Role.AUTHOR)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setUsername("")
    setEmail("")
    setDisplayName("")
    setPassword("")
    setRole(Role.AUTHOR)
    setError(null)
  }

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initialUser) {
      setUsername(initialUser.username ?? "")
      setEmail(initialUser.email ?? "")
      setDisplayName(initialUser.displayName ?? "")
      setRole(initialUser.role ?? Role.AUTHOR)
      setPassword("")
      setError(null)
    } else if (mode === "create") {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initialUser?.id])

  const submit = async () => {
    setError(null)
    if (mode === "create") {
      if (!username || !email || !password) {
        setError("Username, email and password are required")
        return
      }
    } else {
      if (!username || !email) {
        setError("Username and email are required")
        return
      }
    }

    setLoading(true)
    try {
      const url = mode === "edit" && initialUser?.id ? `/api/users/${initialUser.id}` : "/api/users"
      const method = mode === "edit" ? "PUT" : "POST"
      const payload: Partial<User> = { username, email, role, displayName }
      if (mode === "create") payload.password = password
      if (mode === "edit" && password) payload.password = password

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const ct = res.headers.get("content-type") || ""
      const isJson = ct.includes("application/json")
      const data = isJson ? await res.json() : await res.text()
      if (!res.ok) {
        const msg = typeof data === "object" && (data as { message?: string })?.message ? (data as { message?: string }).message : (typeof data === "string" && data) || "Failed to save user"
        throw new Error(msg)
      }
      onSaved(data)
      reset()
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
          <h3 className="text-lg font-semibold">{mode === "edit" ? "Edit User" : "Create User"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

        <div className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name (optional)"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={mode === "edit" ? "New password (optional)" : "Password"}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700"
          >
            <option value={Role.AUTHOR}>AUTHOR</option>
            <option value={Role.ADMIN}>ADMIN</option>
          </select>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded px-4 py-2 text-sm border border-input hover:bg-accent">Cancel</button>
          <button onClick={submit} disabled={loading} className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}
