import { useEffect, useState } from "react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DataTable from "@/components/dashboard/DataTable"
import TableToolbar from "@/components/dashboard/TableToolbar"

export default function AdminTags() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/tags")
        const data = r.ok ? await r.json() : []
        setTags(data)
      } catch {
        setError("Failed to load tags")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <RoleGuard allow={["ADMIN"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tags</h1>
          </header>

          <TableToolbar title="Tags" />

          {loading ? (
            <div className="text-muted-foreground">Loading tags...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={[
                { key: "id", header: "ID" },
                { key: "name", header: "Name" },
                { key: "slug", header: "Slug" },
                { key: "createdAt", header: "Date", render: (r: any) => new Date(r.createdAt).toLocaleString() },
              ]}
              rows={tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug, createdAt: t.createdAt }))}
            />
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
