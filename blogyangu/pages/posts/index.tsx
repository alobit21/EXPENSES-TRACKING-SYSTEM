import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Post {
  id: number
  title: string
  excerpt?: string
  slug: string
  coverImage?: string
  author: {
    id: number
    displayName: string | null
    username: string
    avatarUrl?: string | null
  }
  publishedAt: string | null
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }
    fetchPosts()
  }, [])

  if (!posts.length) return <p>No posts yet.</p>

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Posts</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
            <Link href={`/posts/${post.id}`}><h2>{post.title}</h2></Link>
            <p>{post.excerpt || "No excerpt provided."}</p>
            <small>
              By {post.author.displayName || post.author.username}{" "}
              {post.publishedAt && `on ${new Date(post.publishedAt).toLocaleDateString()}`}
            </small>
            {session?.user?.role && ["ADMIN", "AUTHOR"].includes(session.user.role) && (
              <div style={{ marginTop: "0.5rem" }}>
                <Link href={`/posts/edit/${post.id}`}><button>Edit</button></Link>
                <button
                  style={{ marginLeft: "0.5rem", color: "red" }}
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this post?")) {
                      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
                      if (res.ok) {
                        setPosts(posts.filter((p) => p.id !== post.id))
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
