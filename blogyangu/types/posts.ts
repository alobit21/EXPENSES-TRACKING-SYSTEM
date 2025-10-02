import { Author } from "@/components/posts/types";
import { Session } from "next-auth";

export type { Author };

 
export interface Comment {
  id: number;
  content: string;
  author: Author;
  replies?: Comment[];
}

export interface Post {
  id: number
  title: string
  excerpt?: string | null
  slug: string
  coverImage?: string | null
  author: Author
  publishedAt: string | null
  likeCount: number
  commentCount: number
  category?: {
    id: number
    name: string
  } | null
  
  // Include Prisma fields to make it compatible
  content?: string
  metaDescription?: string | null
  status?: string
  allowComments?: boolean
  categoryId?: number | null
  authorId?: number
  createdAt?: Date
  updatedAt?: Date
  viewCount?: number
}


// In your types/posts.ts file
// In your types/posts.ts file
// @/types/posts.ts
// In your types/posts.ts file
export interface PostComponentProps {
  post: Post;
  imageErrors?: { [key: string]: boolean };
  setImageErrors?: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  onLike?: (postId: number) => void;
  onToggleComments?: (postId: number) => void;
  activeCommentPostId?: number | null;
  commentText?: string;
  setCommentText?: React.Dispatch<React.SetStateAction<string>>;
  onSubmitComment?: (postId: number) => void;
  loadingComments?: boolean;
  commentsByPost?: Record<number, Comment[]>;
  isAdminOrAuthor?: boolean;
  onDeletePost?: (postId: number) => void;
  onApproveComment?: (commentId: number, postId: number) => void;
  onReplyComment?: (postId: number, parentId: number, content: string) => void;
  onLikeComment?: (commentId: number, postId: number) => void;
  getAuthorDisplay?: (author: any) => string;
  getAvatarUrl?: (author: any) => string | null;
  getInitials?: (author: any) => string;
  session?: Session | null;
}