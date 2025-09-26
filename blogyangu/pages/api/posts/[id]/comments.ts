// pages/api/posts/[id]/comments.ts
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "POST") {
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const { content } = req.body
      
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
        },
        include: {
          author: true,
        },
      })

      res.json({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: comment.author.id,
          username: comment.author.username,
          displayName: comment.author.displayName,
          avatarUrl: comment.author.avatarUrl,
        },
      })
    } catch (error) {
      console.error("Error creating comment:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}