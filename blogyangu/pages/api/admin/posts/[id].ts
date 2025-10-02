import { authorize } from "@/lib/authorize"
import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await authorize(req, res, ["ADMIN", "AUTHOR"])
  if (!session) return

  const postId = parseInt(req.query.id as string)
  const post = await prisma.post.findUnique({ where: { id: postId } })

  if (!post) return res.status(404).json({ message: "Post not found" })

  // AUTHOR can only manage their own posts
  if (session.user.role === "AUTHOR" && post.authorId !== parseInt(session.user.id)) {
    return res.status(403).json({ message: "Forbidden" })
  }

  if (req.method === "GET") return res.json(post)

  if (req.method === "PUT") {
    const { title, content, coverImage, categoryId, status } = req.body
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content, coverImage, categoryId, status },
    })
    return res.json(updatedPost)
  }

  if (req.method === "DELETE") {
    await prisma.post.delete({ where: { id: postId } })
    return res.status(204).end()
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
