// pages/api/posts/index.ts
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import formidable from "formidable"
import fs from "fs"
import path from "path"

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
function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const role = session?.user?.role

  // ---------------- GET posts
  if (req.method === "GET") {
    const where =
      role && ["ADMIN", "AUTHOR"].includes(role)
        ? {} // see all posts
        : { status: "PUBLISHED" } // public/readers see only published

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        coverImage: true,
        status: true,
        metaDescription: true,
        allowComments: true,
        viewCount: true,
        categoryId: true,
        author: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
        publishedAt: true,
      },
    })
    return res.json(posts)
  }

  // ---------------- POST/PUT/DELETE require ADMIN or AUTHOR
  if (!session || !["ADMIN", "AUTHOR"].includes(role ?? "")) {
    return res.status(403).json({ message: "Forbidden" })
  }

  try {
    const { fields, files } = await parseForm(req)

    // normalize fields
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title
    const content = Array.isArray(fields.content) ? fields.content[0] : fields.content
    const excerpt = Array.isArray(fields.excerpt) ? fields.excerpt[0] : fields.excerpt
    const metaDescription = Array.isArray(fields.metaDescription) ? fields.metaDescription[0] : fields.metaDescription
    const status = Array.isArray(fields.status) ? fields.status[0] : fields.status
    const categoryIdRaw = Array.isArray(fields.categoryId) ? fields.categoryId[0] : fields.categoryId
    const allowCommentsRaw = Array.isArray(fields.allowComments) ? fields.allowComments[0] : fields.allowComments

    const coverFile = files.coverImage as formidable.File | undefined
    const coverImagePath = coverFile?.filepath ? `/uploads/${path.basename(coverFile.filepath)}` : null

    if (req.method === "POST") {
      if (!title || !content) return res.status(400).json({ message: "Title and content required" })
      const slug = await makeUniqueSlug(title)

      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          excerpt: excerpt || null,
          metaDescription: metaDescription || null,
          coverImage: coverImagePath,
          categoryId: categoryIdRaw ? Number(categoryIdRaw) : null,
          status: status || "DRAFT",
          allowComments: allowCommentsRaw === "false" ? false : true,
          slug,
          authorId: parseInt(session.user.id),
        },
      })
      return res.status(201).json(newPost)
    }

    if (req.method === "PUT") {
      const postIdRaw = Array.isArray(fields.id) ? fields.id[0] : fields.id
      if (!postIdRaw) return res.status(400).json({ message: "Post ID required" })
      const postId = Number(postIdRaw)

      const existing = await prisma.post.findUnique({ where: { id: postId } })
      if (!existing) return res.status(404).json({ message: "Post not found" })

      // AUTHOR can edit only own posts
      if (session.user.role === "AUTHOR" && existing.authorId !== parseInt(session.user.id)) {
        return res.status(403).json({ message: "Forbidden" })
      }

      const slug = title && title !== existing.title ? await makeUniqueSlug(title, postId) : existing.slug

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title: title || existing.title,
          content: content || existing.content,
          excerpt: excerpt ?? existing.excerpt,
          metaDescription: metaDescription ?? existing.metaDescription,
          coverImage: coverImagePath || existing.coverImage,
          categoryId: categoryIdRaw ? Number(categoryIdRaw) : existing.categoryId,
          status: status || existing.status,
          allowComments: allowCommentsRaw === undefined ? existing.allowComments : allowCommentsRaw === "true",
          slug,
        },
      })
      return res.json(updatedPost)
    }

    if (req.method === "DELETE") {
      const postIdRaw = Array.isArray(fields.id) ? fields.id[0] : fields.id
      if (!postIdRaw) return res.status(400).json({ message: "Post ID required" })
      const postId = Number(postIdRaw)

      const existing = await prisma.post.findUnique({ where: { id: postId } })
      if (!existing) return res.status(404).json({ message: "Post not found" })

      // AUTHOR can delete only own posts
      if (session.user.role === "AUTHOR" && existing.authorId !== parseInt(session.user.id)) {
        return res.status(403).json({ message: "Forbidden" })
      }

      await prisma.post.delete({ where: { id: postId } })
      return res.status(204).end()
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}


