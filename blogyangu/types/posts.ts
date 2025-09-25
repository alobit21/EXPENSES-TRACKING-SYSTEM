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


export interface PostComponentProps {
  post: Post;
  session: Session | null;
  imageErrors: Record<number | string, boolean>;
  setImageErrors: React.Dispatch<React.SetStateAction<Record<number | string, boolean>>>;
  handleLike: (postId: number) => void;
  handleToggleComments: (postId: number) => void;
  activeCommentPostId: number | null;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitComment: (postId: number) => void;
  loadingComments: boolean;
  commentsByPost: Record<number, Comment[]>;
  isAdminOrAuthor: boolean;
  handleDeletePost: (postId: number) => void;
  getAuthorDisplay: (author: Author) => string;
  getAvatarUrl: (author: Author) => string | null;
  getInitials: (author: Author) => string;
}