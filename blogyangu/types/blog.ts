// types/blog.ts

export interface CommentWithAuthor {
  _count: any
  id: number
  content: string
  author: {
    id: number
    username: string
    displayName?: string | null
    avatarUrl?: string | null
  }
  parentId?: number | null
  replies?: CommentWithAuthor[]
  likes?: { id: number }[]
  createdAt: string
  updatedAt: string
}

export interface PostWithDetails {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  author: {
    id: number
    username: string
    displayName?: string | null
    avatarUrl?: string | null
  }
  category?: {
    id: number
    name: string
    slug: string
  } | null
  tags?: { tag: { id: number; name: string; slug: string } }[]
  comments?: CommentWithAuthor[]
  likes?: { id: number }[]
  bookmarks?: { id: number }[]
  viewCount?: number
  readTime?: number
  publishedAt?: string
  _count?: {
    comments?: number
  }
}
