// pages/api/comments/[id]/approve.ts
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]) 
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id || !session.user.role || !["ADMIN", "AUTHOR"].includes(session.user.role)) {
    return res.status(403).json({ error: "Only Admin or Author can approve comments" })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)
  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" })
  }

  try {
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { status: "APPROVED" },
      include: { post: true },
    })

    return res.status(200).json({ id: updated.id, status: updated.status, postId: updated.postId })
  } catch (error) {
    console.error("Approve comment error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
