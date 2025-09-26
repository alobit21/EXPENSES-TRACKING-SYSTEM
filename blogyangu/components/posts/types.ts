

import { Dispatch, SetStateAction } from "react"



// Extend Prisma Post with UI-friendly fields
export type PostWithExtras = Post & {
  likeCount: number
  commentCount: number
}

// Type for commentsByPost state
export type CommentsByPost = Record<number, Comment[]>



export interface Comment {
  id: number
  content: string
  author: Author
  replies?: Comment[]
}

export interface Post {
  id: number
  title: string
  excerpt?: string
  slug: string
  coverImage?: string
  author: Author
  publishedAt: string | null
  likeCount: number
  commentCount: number
  category?: {
    id: number
    name: string
  } | null
}

export interface CommentListProps {
  post: Post
  loadingComments: boolean
  commentsByPost: Record<number, Comment[]>
  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}

export interface CommentItemProps {
  comment: Comment
  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}


export interface PostCommonProps {
  imageErrors: Record<number | string, boolean>
  setImageErrors: Dispatch<SetStateAction<Record<number | string, boolean>>>
  activeCommentPostId: number | null
  commentText: string
  setCommentText: Dispatch<SetStateAction<string>>
  loadingComments: boolean
  commentsByPost: Record<number, Comment[]>
  isAdminOrAuthor: boolean
  session: any
  onToggleComments: (postId: number) => void
  onSubmitComment: (postId: number) => void
  onLike: (postId: number) => void
  onDeletePost: (postId: number) => void

  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}


export interface PostProps extends PostCommonProps {
  post: Post
}

export interface CommentProps extends PostCommonProps {
  post: Post
}

 


export interface CommentItemProps {
  comment: Comment
  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}

export interface Author {
  id: number
  name?: string | null
  displayName: string | null
  username: string
  avatarUrl?: string | null
  email?: string | null
}