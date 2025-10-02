import { useEffect, useMemo, useState } from "react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DataTable from "@/components/dashboard/DataTable"

export default function AdminLikes() {
  const [likes, setLikes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/likes")
        const data = r.ok ? await r.json() : []
        setLikes(data)
      } catch {
        setError("Failed to load likes")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const rows = useMemo(() => likes.map((l) => ({
    id: l.id,
    user: l.user?.username || l.user?.displayName || `#${l.userId}`,
    target: l.post ? `Post: ${l.post.title}` : l.comment ? `Comment: ${l.comment.content?.slice(0,50)}…` : "-",
    createdAt: l.createdAt,
  })), [likes])

  return (
    <RoleGuard allow={["ADMIN"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Likes</h1>
          </header>

          {loading ? (
            <div className="text-muted-foreground">Loading likes...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={[
                { key: "id", header: "ID" },
                { key: "user", header: "User" },
                { key: "target", header: "Target" },
                { key: "createdAt", header: "Date", render: (r: any) => new Date(r.createdAt).toLocaleString() },
              ]}
              rows={rows}
            />
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
