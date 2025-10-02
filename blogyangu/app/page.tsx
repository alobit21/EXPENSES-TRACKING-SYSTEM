import Link from "next/link"
import { prisma } from "@/lib/prisma"
import PostCard from "@/components/landing/PostCard"
import Newsletter from "@/components/landing/Newsletter"


interface Category {
  id: number;
  name: string;
}

interface LandingPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  author: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  category: {
    id: number;
    name: string;
  } | null;
  publishedAt: string;
  likeCount: number;
  commentCount: number;
}



export const revalidate = 0

export default async function Page() {

  
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      include: { author: true, comments: true, likes: true, category: true },
      orderBy: { publishedAt: "desc" },
      take: 12,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  const postsWithCounts = posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    author: post.author
      ? {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatarUrl,
        }
      : { id: 0, username: "unknown", displayName: "Unknown", avatarUrl: null },
    category: post.category ? { id: post.category.id, name: post.category.name } : null,
    publishedAt: post.publishedAt,
    likeCount: post.likes.length,
    commentCount: post.comments.filter((c: any) => c.status === "APPROVED").length,
  }))

  const featured = postsWithCounts[0]
  const latest = postsWithCounts.slice(1, 7)

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary to-background dark:from-gray-900/50 dark:to-gray-900" />
        <div className="container mx-auto px-4 pt-20 pb-16 max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Discover. Learn. Inspire.</h1>
              <p className="mt-4 text-muted-foreground dark:text-gray-300 text-lg max-w-xl">A professional, human-friendly blog where developers and creators share deep dives, quick tips, and opinions.</p>
              <div className="mt-8 flex gap-3">
                <Link href="/posts" className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium">Explore Posts</Link>
                <a href="#newsletter" className="bg-card hover:bg-accent hover:text-accent-foreground text-foreground px-5 py-3 rounded-lg border border-border font-medium dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">Subscribe</a>
              </div>
              {categories.slice(0, 10).map((c: Category) => (
  <span key={c.id} className="text-xs px-3 py-1 rounded-full bg-blue-900 text-blue-300 border border-blue-800">
    {c.name}
  </span>
))}

            </div>
            {featured && (
              <div className="bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-900/60 dark:border-gray-700">
                <PostCard post={featured} />
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-900/60 dark:border-gray-700">
              <div className="text-3xl font-bold">{postsWithCounts.length}</div>
              <div className="text-muted-foreground dark:text-gray-400 text-sm">Featured & Latest</div>
            </div>
            <div className="bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-900/60 dark:border-gray-700">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-muted-foreground dark:text-gray-400 text-sm">Categories</div>
            </div>
            <div className="bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-900/60 dark:border-gray-700">
              <div className="text-3xl font-bold">Community</div>
              <div className="text-muted-foreground dark:text-gray-400 text-sm">Open & inclusive</div>
            </div>
            <div className="bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-900/60 dark:border-gray-700">
              <div className="text-3xl font-bold">No Ads</div>
              <div className="text-muted-foreground dark:text-gray-400 text-sm">Focus on content</div>
            </div>
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Latest insights</h2>
            <Link href="/posts" className="text-sm text-blue-300 hover:text-blue-200">Browse all →</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((p: LandingPost) => (
  <PostCard key={p.id} post={p} />
))}



          </div>
        </section>
      )}

      <Newsletter />
    </main>
  )
}