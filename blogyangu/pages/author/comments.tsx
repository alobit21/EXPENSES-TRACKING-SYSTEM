import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DataTable from "@/components/dashboard/DataTable"

export default function AuthorComments() {
  const { data: session } = useSession()
  const [comments, setComments] = useState<any[]>([])
  const [postsById, setPostsById] = useState<Record<number, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [cr, pr] = await Promise.all([
          fetch("/api/comments"),
          fetch("/api/posts"),
        ])
        const cs = cr.ok ? await cr.json() : []
        const ps = pr.ok ? await pr.json() : []
        const map: Record<number, any> = {}
        ps.forEach((p: any) => (map[p.id] = p))
        setPostsById(map)
        setComments(cs)
      } catch (e) {
        setError("Failed to load comments")
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  const role = (session?.user as any)?.role as "ADMIN" | "AUTHOR" | undefined
  const myComments = useMemo(() => {
    if (role === "ADMIN") return comments
    const sid = Number((session?.user as any)?.id)
    if (!sid) return comments
    return comments.filter((c: any) => {
      const postAuthorId = Number(c.post?.authorId ?? postsById[c.postId]?.author?.id)
      const commenterId = Number(c.authorId)
      return postAuthorId === sid || commenterId === sid
    })
  }, [comments, postsById, session, role])

  const approve = async (row: any) => {
    try {
      const res = await fetch(`/api/comments/${row.id}/approve`, { method: "POST" })
      if (res.ok) {
        setComments((arr) => arr.map((x) => (x.id === row.id ? { ...x, status: "APPROVED" } : x)))
      }
    } catch {}
  }
  const deny = async (row: any) => {
    const note = prompt("Enter reason for denial (optional):") || ""
    try {
      await fetch(`/api/comments/${row.id}/deny`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) })
      setComments((arr) => arr.map((x) => (x.id === row.id ? { ...x, status: "REJECTED", moderationNote: note } : x)))
    } catch {}
  }
  const remove = async (row: any) => {
    if (!confirm("Delete this comment?")) return
    try {
      const res = await fetch(`/api/comments/${row.id}`, { method: "DELETE" })
      if (res.ok) setComments((arr) => arr.filter((x) => x.id !== row.id))
    } catch {}
  }

  return (
    <RoleGuard allow={["AUTHOR", "ADMIN"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Comments</h1>
          </header>

          {loading ? (
            <div className="text-muted-foreground">Loading comments...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={[
                { key: "id", header: "ID" },
                { key: "postId", header: "Post", render: (r: any) => r.post?.title || postsById[r.postId]?.title || `#${r.postId}` },
                { key: "author", header: "Author", render: (r: any) => r.author?.username || r.author?.displayName || "user" },
                { key: "status", header: "Status" },
                { key: "createdAt", header: "Date", render: (r: any) => new Date(r.createdAt).toLocaleString() },
                {
                  key: "id",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      {row.status !== "APPROVED" && (
                        <button className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded" onClick={() => approve(row)}>Approve</button>
                      )}
                      {row.status !== "REJECTED" && (
                        <button className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded" onClick={() => deny(row)}>Deny</button>
                      )}
                      <button className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded" onClick={() => remove(row)}>Delete</button>
                    </div>
                  ),
                },
              ]}
              rows={myComments.map((c) => ({
                id: c.id,
                postId: c.postId,
                author: c.author || {},
                status: c.status || "PENDING",
                createdAt: c.createdAt,
              }))}
            />
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
