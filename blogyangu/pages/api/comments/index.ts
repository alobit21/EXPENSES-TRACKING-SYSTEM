import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const comments = await prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          status: true,
          moderationNote: true,
          createdAt: true,
          postId: true,
          authorId: true,
          author: { select: { id: true, username: true, displayName: true } },
          post: { select: { id: true, title: true, authorId: true } },
        },
      })
      return res.status(200).json(comments)
    }
    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (e) {
    console.error("/api/comments error:", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
