// pages/api/comments/[id]/like.ts
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]) 
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)
  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" })
  }

  try {
    const userId = parseInt(session.user.id)

    // Toggle like: delete if exists, else create
    const existing = await prisma.like.findFirst({ where: { userId, commentId } })
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
    } else {
      await prisma.like.create({ data: { userId, commentId } })
    }

    const count = await prisma.like.count({ where: { commentId } })
    return res.status(200).json({ liked: !existing, likeCount: count })
  } catch (error) {
    console.error("Comment like error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
