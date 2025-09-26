import { Author } from "@/components/posts/types";
import { Session } from "next-auth";

 
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
  onLike?: (postId: number) => void; // Changed from handleLike
  onToggleComments?: (postId: number) => void; // Changed from handleToggleComments
  activeCommentPostId?: number | null;
  commentText?: string;
  setCommentText?: (text: string) => void;
  handleSubmitComment?: (e: React.FormEvent) => void;
  loadingComments?: boolean;
  commentsByPost?: { [key: number]: Comment[] };
  isAdminOrAuthor?: boolean;
  handleDeletePost?: (postId: number) => void;
  getAuthorDisplay?: (author: any) => string;
  getAvatarUrl?: (author: any) => string | null;
  getInitials?: (author: any) => string;
  session?: any;
}