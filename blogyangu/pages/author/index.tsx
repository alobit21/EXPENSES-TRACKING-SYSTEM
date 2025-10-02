import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import StatsCards, { StatItem } from "@/components/dashboard/StatsCards"
import ReLineChart from "@/components/dashboard/charts/ReLineChart"
import ReBarChart from "@/components/dashboard/charts/ReBarChart"
import RePieChart from "@/components/dashboard/charts/RePieChart"
import DataTable from "@/components/dashboard/DataTable"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Role } from "@prisma/client"

interface Post {
  id: number
  title: string
  publishedAt?: string | Date | null
  author?: {
    id: number
  }
  category?: {
    id: number
    name: string
  }
  categoryId?: number | null
  commentCount?: number
  likeCount?: number
}

interface Comment {
  id: number
  postId: number
  content: string
}

interface Like {
  id: number
  postId: number
  post?: {
    category?: {
      name: string
    }
  }
}

interface Category {
  id: number
  name: string
}

interface PostRow {
  id: number
  title: string
  publishedAt?: string | Date | null
  category?: {
    id: number
    name: string
  }
  categoryId?: number | null
}

interface TrendData {
  x: string
  y: number
}

export default function AuthorDashboard() {
  const { data: session, status } = useSession()
  const role = session?.user?.role as Role | undefined
  const meId = session?.user?.id ? Number(session.user.id) : undefined
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState<number>(0)
  const [topCats, setTopCats] = useState<{ label: string; value: number }[]>([])
  const [categoryShare, setCategoryShare] = useState<{ label: string; value: number }[]>([])
  const [likesByCat, setLikesByCat] = useState<{ label: string; value: number }[]>([])
  const [catMap, setCatMap] = useState<Record<number, string>>({})

  useEffect(() => {
    ;(async () => {
      try {
        const [pr, cr, lr, gr] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/comments"),
          fetch("/api/likes"),
          fetch("/api/categories"),
        ])
        const allPosts = pr.ok ? await pr.json() : []
        const allComments = cr.ok ? await cr.json() : []
        const likesArr = lr.ok ? await lr.json() : []
        const categories = gr.ok ? await gr.json() : []
        const cmap: Record<number, string> = {}
        categories.forEach((c: Category) => { if (c?.id != null) cmap[Number(c.id)] = c.name })
        setCatMap(cmap)
        let useAll = role === "ADMIN"
        let basePosts = useAll ? allPosts : (meId ? allPosts.filter((p: Post) => Number(p.author?.id) === Number(meId)) : [])
        // If author has no posts yet, fall back to site-wide data to avoid empty dashboard
        if (!useAll && basePosts.length === 0) {
          useAll = true
          basePosts = allPosts
        }
        const basePostIds = new Set(basePosts.map((p: Post) => p.id))
        const baseComments = useAll ? allComments : allComments.filter((c: Comment) => basePostIds.has(c.postId))
        const baseLikes = useAll ? likesArr.length : likesArr.filter((l: Like) => l.postId && basePostIds.has(l.postId)).length

        // Set primary data
        setPosts(basePosts)
        setComments(baseComments)
        setLikes(baseLikes)

        // Category metrics
        const counts: Record<string, number> = {}
        basePosts.forEach((p: Post) => {
          const name = p.category?.name || "Uncategorized"
          counts[name] = (counts[name] || 0) + 1
        })
        const catBars = Object.entries(counts)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 8)
          .map(([label, value]) => ({ label, value: value as number }))
        setTopCats(catBars)
        setCategoryShare(Object.entries(counts).map(([label, value]) => ({ label, value: value as number })))

        // Likes by category within scope
        const likeCounts: Record<string, number> = {}
        likesArr.forEach((l: Like) => {
          if (useAll || basePostIds.has(l.postId)) {
            const cat = l.post?.category?.name || "Uncategorized"
            likeCounts[cat] = (likeCounts[cat] || 0) + 1
          }
        })
        const likesByCatLocal = Object.entries(likeCounts)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 8)
          .map(([label, value]) => ({ label, value: value as number }))
        setLikesByCat(likesByCatLocal)
      } catch {
        setPosts([]); setComments([]); setLikes(0)
      }
    })()
  }, [meId, role, status])

  const statItems: StatItem[] = useMemo(() => [
    { label: "My Posts", value: posts.length },
    { label: "Comments", value: comments.length },
    { label: "Likes", value: likes },
    { label: "Drafts", value: posts.filter((p) => !p.publishedAt).length },
  ], [posts, comments, likes])

  const trend: TrendData[] = posts
    .filter((p) => p.publishedAt)
    .slice(0, 10)
    .map((p: Post) => ({ x: new Date(p.publishedAt!).toLocaleDateString(), y: (p.commentCount ?? 0) + (p.likeCount ?? 0) }))

  return (
    <RoleGuard allow={["AUTHOR", "ADMIN"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Author Dashboard</h1>
          </header>

          <StatsCards items={statItems} />

          <section className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-3">Engagement trend</h3>
            <ReLineChart data={trend} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-3">Top categories</h3>
              <ReBarChart data={topCats} />
            </section>
            <section className="lg:col-span-2 bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-3">Category share</h3>
              <RePieChart data={categoryShare} />
            </section>
          </div>

          <section className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-3">Likes by category</h3>
            <ReBarChart data={likesByCat} />
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-3">Recent Posts</h3>
            <DataTable
              columns={[
                { key: "title", header: "Title" },
                { key: "publishedAt", header: "Status", render: (r: PostRow) => (r.publishedAt ? "Published" : "Draft") },
                { key: "category", header: "Category", render: (r: PostRow) => r.category?.name || (r.category?.id != null ? catMap[Number(r.category.id)] : undefined) || (r.categoryId != null ? catMap[Number(r.categoryId)] : undefined) || "-" },
              ]}
              rows={posts.slice(0, 10).map((p: Post) => ({
                id: p.id,
                title: p.title,
                publishedAt: p.publishedAt,
                category: p.category,
                categoryId: p.category?.id ?? p.categoryId,
              }))}
            />
          </section>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
