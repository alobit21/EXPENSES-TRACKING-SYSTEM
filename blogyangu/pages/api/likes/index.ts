import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const likes = await prisma.like.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          userId: true,
          postId: true,
          commentId: true,
          user: { select: { id: true, username: true, displayName: true } },
          post: { select: { id: true, title: true, authorId: true, category: { select: { name: true } } } },
          comment: { select: { id: true, content: true, authorId: true } },
        },
      })
      return res.status(200).json(likes)
    }
    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (e) {
    console.error("/api/likes error:", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
