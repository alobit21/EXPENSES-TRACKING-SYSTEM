"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Menu, X, LayoutDashboard, Users, MessageSquare, Folder, ThumbsUp, Tag, Settings } from "lucide-react"

type Role = 'USER' | 'ADMIN' | 'AUTHOR';

interface SidebarItemProps {
  href: string
  label: string
  count?: number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  active: boolean
}

function SidebarItem({ href, label, count, icon: Icon, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {typeof count === "number" && (
        <span className="ml-3 inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground group-hover:text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const role: Role | undefined = session?.user?.role as Role | undefined
  const router = useRouter()

  // Counts for sidebar badges
  const [counts, setCounts] = useState({ posts: 0, comments: 0, categories: 0, likes: 0, users: 0, tags: 0 })

  useEffect(() => {
    ;(async () => {
      try {
        const [pr, cr, gr, tr, lr, ur] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/comments"),
          fetch("/api/categories"),
          fetch("/api/tags"),
          fetch("/api/likes"),
          fetch("/api/users"),
        ])
        const posts = pr.ok ? await pr.json() : []
        const comments = cr.ok ? await cr.json() : []
        const categories = gr.ok ? await gr.json() : []
        const tags = tr.ok ? await tr.json() : []
        const likesData = lr.ok ? await lr.json() : []
        const users = ur.ok ? await ur.json() : []
        setCounts({
          posts: posts.length,
          comments: comments.length,
          categories: categories.length,
          tags: tags.length,
          likes: likesData.length,
          users: users.length,
        })
      } catch {
        // ignore network errors; keep defaults
      }
    })()
  }, [])

  const links = useMemo(
    () => [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, show: role === "ADMIN" },
      { href: "/author", label: "Dashboard", icon: LayoutDashboard, show: role !== "ADMIN" },
      { href: role === "ADMIN" ? "/admin/posts" : "/author/posts", label: "Post", icon: Folder, count: counts.posts, show: true },
      { href: "/author/comments", label: "Comment", icon: MessageSquare, count: counts.comments, show: true },
      { href: "/admin/categories", label: "Category", icon: Folder, count: counts.categories, show: role === "ADMIN" },
      { href: role === "ADMIN" ? "/admin/likes" : "/author/likes", label: "Like", icon: ThumbsUp, count: counts.likes, show: true },
      { href: role === "ADMIN" ? "/admin/tags" : "/author/tags", label: "Tag", icon: Tag, count: counts.tags, show: role === "ADMIN" },
      { href: "/settings", label: "Setting", icon: Settings, show: role === "ADMIN" },
      { href: "/admin/users", label: "User", icon: Users, count: counts.users, show: role === "ADMIN" },
    ],
    [role, counts]
  )



  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className={`lg:col-span-3 xl:col-span-2 ${open ? "block" : "hidden lg:block"}`}>
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-xl border border-border bg-card p-3 dark:bg-gray-900 dark:border-gray-700">
              <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">All Models</div>
              <nav className="flex flex-col gap-1">
                {links.filter((l) => l.show).map((l) => (
                  <SidebarItem
                    key={l.href}
                    href={l.href}
                    label={l.label}
                    count={l.count as number | undefined}
                    icon={l.icon}
                    active={router.pathname === l.href || router.pathname.startsWith(l.href + "/")}
                  />
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 xl:col-span-10">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}


