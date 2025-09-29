import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"
import { CommentStatus } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]) 
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id || !session.user.role || !["ADMIN", "AUTHOR"].includes(session.user.role)) {
    return res.status(403).json({ error: "Forbidden" })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)
  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" })
  }

  const { note } = req.body || {}
  if (!note || typeof note !== "string") {
    return res.status(400).json({ error: "Denial note is required" })
  }

  try {
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { status: CommentStatus.REJECTED, moderationNote: note },
    })

    return res.status(200).json({ id: updated.id, status: updated.status, moderationNote: updated.moderationNote, postId: updated.postId })
  } catch (error) {
    console.error("Deny comment error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
