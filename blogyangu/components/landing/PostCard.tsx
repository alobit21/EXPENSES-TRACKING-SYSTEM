import Link from "next/link"
import Image from "next/image"

interface Author {
  id: number
  username: string
  displayName: string | null
  avatarUrl?: string | null
}

export interface LandingPost {
  id: number
  title: string
  excerpt?: string | null
  slug: string
  coverImage?: string | null
  author: Author
  publishedAt: string | null
  likeCount: number
  commentCount: number
  category?: { id: number; name: string } | null
}

export default function PostCard({ post }: { post: LandingPost }) {
  return (
    <article className="bg-card dark:bg-gray-900 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col">
      {post.coverImage ? (
        <div className="w-full h-48 overflow-hidden">
          <Image src={post.coverImage} alt={post.title} width={400} height={192} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="w-full h-48 bg-secondary dark:bg-gray-900 flex items-center justify-center text-muted-foreground dark:text-gray-400">No image</div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {post.category && (
          <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full mb-2">
            {post.category.name}
          </span>
        )}
        <Link href={`/posts/${post.slug}`} className="group">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">{post.title}</h3>
        </Link>
        {post.excerpt && (
          <p className="text-muted-foreground dark:text-gray-300 text-sm mt-2 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {post.author?.avatarUrl ? (
              <Image src={post.author.avatarUrl} alt={post.author.username} width={24} height={24} className="rounded-full border border-border dark:border-gray-600" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-secondary dark:bg-gray-700 flex items-center justify-center border border-border dark:border-gray-600">
                <span className="text-[10px] text-muted-foreground dark:text-gray-300">{(post.author?.displayName || post.author?.username || "U").charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span>{post.author?.displayName || post.author?.username || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>👍 {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
