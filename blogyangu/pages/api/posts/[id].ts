import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = parseInt(req.query.id as string)
  if (isNaN(postId)) return res.status(400).json({ message: "Invalid post ID" })

  if (req.method === "GET") {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        coverImage: true,
        author: { select: { id: true, displayName: true, username: true, avatarUrl: true } },
        publishedAt: true,
        allowComments: true, // ✅ Add this line
      },
    })
    if (!post) return res.status(404).json({ message: "Post not found" })
    return res.json(post)
  }

  // Protected: PUT / DELETE
  const session = await getServerSession(req, res, authOptions)
  const role = session?.user?.role
  if (!session || !["ADMIN", "AUTHOR"].includes(role ?? "")) {
    return res.status(403).json({ message: "Forbidden" })
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) return res.status(404).json({ message: "Post not found" })

  if (role === "AUTHOR" && post.authorId !== parseInt(session.user.id)) {
    return res.status(403).json({ message: "Forbidden" })
  }

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
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
