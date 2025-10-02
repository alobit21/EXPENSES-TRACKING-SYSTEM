export interface Author {
  id: number
  displayName: string | null
  username: string
  avatarUrl?: string | null
}

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

export interface PostCommonProps {
  imageErrors: Record<number | string, boolean>
  setImageErrors: (errors: Record<number | string, boolean>) => void
  activeCommentPostId: number | null
  commentText: string
  setCommentText: (text: string) => void
  loadingComments: boolean
  commentsByPost: Record<number, Comment[]>
  isAdminOrAuthor: boolean
  session: any
  onToggleComments: (postId: number) => void
  onSubmitComment: (postId: number) => void
  onLike: (postId: number) => void
  onDeletePost: (postId: number) => void
}

export interface PostProps extends PostCommonProps {
  post: Post
}