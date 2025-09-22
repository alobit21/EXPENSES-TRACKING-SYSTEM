import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  author: {
    id: number
    displayName: string | null
    username: string
    avatarUrl?: string | null
  }
  publishedAt: string | null
}

export default function PostDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (!id) return
    async function fetchPost() {
      const res = await fetch(`/api/posts/${id}`)
      if (res.ok) {
        setPost(await res.json())
      }
    }
    fetchPost()
  }, [id])

  if (!post) return <p>Loading...</p>

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p><em>By {post.author.displayName || post.author.username}</em></p>
      {post.coverImage && <img src={post.coverImage} alt={post.title} style={{ maxWidth: "600px", margin: "1rem 0" }} />}
      <article>{post.content}</article>

      {session?.user?.role && ["ADMIN", "AUTHOR"].includes(session.user.role) && (
        <div style={{ marginTop: "1rem" }}>
          <Link href={`/posts/edit/${post.id}`}><button>Edit</button></Link>
          <button
            style={{ marginLeft: "0.5rem", color: "red" }}
            onClick={async () => {
              if (confirm("Delete this post?")) {
                const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
                if (res.ok) router.push("/posts")
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
