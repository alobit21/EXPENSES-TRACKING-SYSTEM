"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

// Type of theme we support
export type Theme = "light" | "dark"

// Context shape
type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// Keys and helpers
const STORAGE_KEY = "theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  try {
    const ls = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (ls === "dark" || ls === "light") return ls
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
  } catch {
    return "light"
  }
}

function applyThemeToDom(next: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (next === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Sync theme to DOM and storage
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {}
    applyThemeToDom(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  // On mount, ensure DOM matches current state; also subscribe to system changes if user has no explicit pref
  useEffect(() => {
    applyThemeToDom(theme)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const stored = ((): Theme | null => {
      try {
        const v = localStorage.getItem(STORAGE_KEY)
        return v === "dark" || v === "light" ? v : null
      } catch {
        return null
      }
    })()

    const onChange = (e: MediaQueryListEvent) => {
      // Only react to system changes if user hasn't explicitly chosen
      if (!stored) setTheme(e.matches ? "dark" : "light")
    }

    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [setTheme])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
