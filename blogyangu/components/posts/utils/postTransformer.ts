import { Post } from "../../../types/posts"
import { Post as PrismaPost } from "@prisma/client"

export const transformPrismaPostToCustomPost = (
  prismaPost: PrismaPost & { 
    author?: any
    category?: any
    _count?: { likes?: number; comments?: number }
  }
): Post => {
  return {
    id: prismaPost.id,
    title: prismaPost.title,
    excerpt: prismaPost.excerpt,
    slug: prismaPost.slug,
    coverImage: prismaPost.coverImage,
    author: prismaPost.author || {
      id: prismaPost.authorId,
      username: "Unknown",
      name: "Unknown Author",
      displayName: null,
      avatarUrl: null,
    },
    // 👇 Convert Date → string
    publishedAt: (prismaPost.publishedAt || prismaPost.createdAt)?.toISOString() ?? null,

    likeCount: prismaPost._count?.likes || 0,
    commentCount: prismaPost._count?.comments || 0,
    category: prismaPost.category || null,

    // Keep raw Prisma fields
    content: prismaPost.content,
    metaDescription: prismaPost.metaDescription,
    status: prismaPost.status,
    allowComments: prismaPost.allowComments,
    categoryId: prismaPost.categoryId,
    authorId: prismaPost.authorId,
    createdAt: prismaPost.createdAt,   // 👈 these you can keep as Date if needed
    updatedAt: prismaPost.updatedAt,
    viewCount: prismaPost.viewCount,
  }
}
