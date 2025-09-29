// pages/api/posts/[id]/comments.ts
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "GET") {
    try {
      const postId = parseInt(id as string)
      const isPrivileged = session?.user?.role && ["ADMIN", "AUTHOR"].includes(session.user.role)

      // Fetch flat comments with author and replies data
      const comments = await prisma.comment.findMany({
        where: isPrivileged
          ? { postId, deletedAt: null }
          : {
              postId,
              deletedAt: null,
              OR: [
                { status: "APPROVED" },
                session?.user?.id
                  ? { authorId: parseInt(session.user.id) }
                  : { id: -1 },
              ],
            },
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          _count: { select: { likes: true } },
        },
      })

      // Build threaded tree
      const byId: Record<number, any> = {}
      const roots: any[] = []
      comments.forEach((c) => {
        byId[c.id] = {
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          status: c.status,
          author: {
            id: c.author.id,
            username: c.author.username,
            displayName: c.author.displayName,
            avatarUrl: c.author.avatarUrl,
          },
          parentId: c.parentId,
          likeCount: c._count?.likes ?? 0,
          replies: [],
        }
      })
      comments.forEach((c) => {
        const node = byId[c.id]
        if (c.parentId && byId[c.parentId]) {
          byId[c.parentId].replies.push(node)
        } else {
          roots.push(node)
        }
      })

      return res.status(200).json(roots)
    } catch (error) {
      console.error("Error fetching comments:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }

  if (req.method === "POST") {
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Any authenticated user can comment; will be PENDING until approved

    try {
      const { content, parentId } = req.body

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" })
      }

      const postId = parseInt(id as string)
      const userId = parseInt(session.user.id)

      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          authorId: userId,
          parentId: parentId ? Number(parentId) : null,
          status: "PENDING", // require approval before public
        },
        include: {
          author: true,
        },
      })

      return res.json({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        status: comment.status,
        parentId: comment.parentId,
        likeCount: 0,
        author: {
          id: comment.author.id,
          username: comment.author.username,
          displayName: comment.author.displayName,
          avatarUrl: comment.author.avatarUrl,
        },
      })
    } catch (error) {
      console.error("Error creating comment:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }

  res.setHeader("Allow", ["GET", "POST"]).status(405).end(`Method ${req.method} Not Allowed`)
}