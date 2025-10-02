import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DataTable from "@/components/dashboard/DataTable"
import { Role } from "@prisma/client"

interface CommentAuthor {
  id: number
  username?: string | null
  displayName?: string | null
}

interface CommentPost {
  id: number
  title?: string
  author?: {
    id: number
  }
}

interface Comment {
  id: number
  postId: number
  authorId: number
  content: string
  status: string
  createdAt: string | Date
  post?: CommentPost
  author?: CommentAuthor
}

interface Post {
  id: number
  title?: string
  author?: {
    id: number
  }
}

type CommentRow = {
  id: number
  postId: number
  author: CommentAuthor | Record<string, unknown>
  status: string
  createdAt: string | Date
}

export default function AuthorComments() {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [postsById, setPostsById] = useState<Record<number, Post>>({})
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
        const map: Record<number, Post> = {}
        ps.forEach((p: Post) => (map[p.id] = p))
        setPostsById(map)
        setComments(cs)
      } catch {
        setError("Failed to load comments")
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  const role = session?.user?.role as Role | undefined
  const myComments = useMemo(() => {
    if (role === "ADMIN") return comments
    const sid = Number(session?.user?.id)
    if (!sid) return comments
    return comments.filter((c: Comment) => {
      const postAuthorId = Number(c.post?.author?.id ?? postsById[c.postId]?.author?.id)
      const commenterId = Number(c.authorId)
      return postAuthorId === sid || commenterId === sid
    })
  }, [comments, postsById, session, role])

  const approve = async (row: CommentRow) => {
    try {
      const res = await fetch(`/api/comments/${row.id}/approve`, { method: "POST" })
      if (res.ok) {
        setComments((arr) => arr.map((x) => (x.id === row.id ? { ...x, status: "APPROVED" } : x)))
      }
    } catch {}
  }
  const deny = async (row: CommentRow) => {
    const note = prompt("Enter reason for denial (optional):") || ""
    try {
      await fetch(`/api/comments/${row.id}/deny`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) })
      setComments((arr) => arr.map((x) => (x.id === row.id ? { ...x, status: "REJECTED", moderationNote: note } : x)))
    } catch {}
  }
  const remove = async (row: CommentRow) => {
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
                { key: "postId", header: "Post", render: (r: CommentRow) => (r.author as CommentAuthor)?.username || (r.author as CommentAuthor)?.displayName || "user" },
                { key: "author", header: "Author", render: (r: CommentRow) => (r.author as CommentAuthor)?.username || (r.author as CommentAuthor)?.displayName || "user" },
                { key: "status", header: "Status" },
                { key: "createdAt", header: "Date", render: (r: CommentRow) => new Date(r.createdAt).toLocaleString() },
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
