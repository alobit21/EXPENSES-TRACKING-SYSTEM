// pages/api/posts/index.ts
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import formidable from "formidable"
import fs from "fs"
import path from "path"
import { Post, User, Comment, Like } from "@prisma/client";



type Fields<T> = {
  [key: string]: T[];
};



export const config = {
  api: { bodyParser: false },
}

// ---------------- Slug generation
async function makeUniqueSlug(title: string, postId?: number) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

  const existing = await prisma.post.findFirst({
    where: { slug: baseSlug, id: postId ? { not: postId } : undefined },
  })

  if (!existing) return baseSlug
  return `${baseSlug}-${Date.now().toString(36)}`
}

// ---------------- Parse formidable form
function parseForm(
  req: NextApiRequest
): Promise<{ fields: { [key: string]: string[] }; files: formidable.Files }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, rawFields, files) => {
      if (err) return reject(err);

      const fields: { [key: string]: string[] } = {};

    for (const key in rawFields) {
  const value = rawFields[key];
  const normalized = Array.isArray(value) ? value : [value];
  fields[key] = normalized.filter((v): v is string => typeof v === "string");
}


      if (files.coverImage) {
        const file = Array.isArray(files.coverImage)
          ? files.coverImage[0]
          : files.coverImage;
        const relativePath = `/uploads/${path.basename(file.filepath)}`;
        fields.coverImage = [relativePath]; // ✅ safe assignment
      }

      resolve({ fields, files });
    });
  });
}


// ---------------- Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          comments: true,
          likes: true,
          category: true,
        },
        orderBy: { publishedAt: "desc" },
      })

     const postsWithCounts = posts.map((post: Post & {
  author: User;
  comments: Comment[];
       likes: Like[];
      category: { id: number; name: string } | null; // add this
}) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  slug: post.slug,
  coverImage: post.coverImage,
 author: post.author
    ? {
        id: post.author.id,
        username: post.author.username,
        displayName: post.author.displayName,
        avatarUrl: post.author.avatarUrl,
      }
    : { id: 0, username: "unknown", displayName: "Unknown", avatarUrl: null },
  category: post.category ? { id: post.category.id, name: post.category.name } : null, // ✅ map category
  publishedAt: post.publishedAt,
  likeCount: post.likes.length,
  commentCount: post.comments.filter((c) => c.status === "APPROVED").length,
}));


      return res.status(200).json(postsWithCounts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }

 if (req.method === "POST") {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" })
    }

const { fields } = await parseForm(req)
const title = Array.isArray(fields.title) ? fields.title[0] : fields.title
const excerpt = Array.isArray(fields.excerpt) ? fields.excerpt[0] : fields.excerpt || null
const coverImage = Array.isArray(fields.coverImage) ? fields.coverImage[0] : fields.coverImage || null
const content = Array.isArray(fields.content) ? fields.content[0] : fields.content

if (!title || typeof title !== "string") {
  return res.status(400).json({ error: "Title is required" })
}

const slug = await makeUniqueSlug(title)


    


    const newPost = await prisma.post.create({
      data: {
        title,
        excerpt,
        slug,
        content,
        coverImage,
        authorId: Number(session.user.id), // 🔑 check this matches your schema
        publishedAt: new Date(),
      },
    })

    return res.status(201).json(newPost)
  } catch (error: any) {
    console.error("🔥 Error creating post:", error)
    return res.status(500).json({ error: error.message || "Internal server error" })
  }
}


  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
