import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/prisma"
import { CommentStatus } from "@prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)
  if (isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment id" })
  }

  const userId = parseInt(session.user.id)
  const isPrivileged = !!session.user.role && ["ADMIN", "AUTHOR"].includes(session.user.role)

  if (req.method === "PATCH") {
    const { content } = req.body || {}
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content is required" })
    }

    // fetch to ensure ownership if not privileged
    const existing = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true } })
    if (!existing) return res.status(404).json({ error: "Not found" })
    const isOwner = existing.authorId === userId
    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        // if owner edits, re-queue for moderation
        status: isOwner && !isPrivileged ? CommentStatus.PENDING : undefined,
      },
    })

    return res.status(200).json({ id: updated.id, content: updated.content, status: updated.status, postId: updated.postId })
  }

  if (req.method === "DELETE") {
    // fetch to ensure ownership if not privileged
    const existing = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true } })
    if (!existing) return res.status(404).json({ error: "Not found" })
    const isOwner = existing.authorId === userId
    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const deleted = await prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date() } })
    return res.status(200).json({ id: deleted.id, deleted: true, postId: deleted.postId })
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]).status(405).end(`Method ${req.method} Not Allowed`)
}
