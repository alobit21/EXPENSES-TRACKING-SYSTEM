"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme/ThemeProvider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center rounded-md border border-border px-2.5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}`}
    >
      {!mounted ? (
        // Render a stable placeholder to avoid hydration mismatch
        <span className="h-4 w-4 inline-block" aria-hidden="true" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
