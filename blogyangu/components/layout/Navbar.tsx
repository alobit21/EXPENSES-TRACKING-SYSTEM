"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { useSession, signIn, signOut } from "next-auth/react"
import { Role } from "@prisma/client"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const role = session?.user?.role as Role | undefined
  const links = useMemo(() => {
    const base = [
      { href: "/", label: "Home" },
      { href: "/posts", label: "Posts" },
    ]
    if (role === "ADMIN") return [...base, { href: "/admin", label: "Dashboard" }]
    if (role === "AUTHOR") return [...base, { href: "/author", label: "Dashboard" }]
    return base
  }, [role])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/80 text-gray-900 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:text-white dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-semibold">
            Blog Yangu
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-44 rounded-md border border-input bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-56"
              />
            </div>
          </div>
          <ThemeToggle />
          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="hidden md:inline-flex items-center rounded-md border border-border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/blogyangu/auth/signin"
              className="hidden md:inline-flex items-center rounded-md border border-border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </Link>
          )}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-white text-gray-900 dark:bg-gray-900 dark:text-white md:hidden">
          <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3">
              {session?.user ? (
                <button
                  onClick={() => { setOpen(false); signOut() }}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/blogyangu/auth/signin"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
