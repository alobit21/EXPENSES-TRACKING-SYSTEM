import { authorize } from "@/lib/authorize"
import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await authorize(req, res, ["ADMIN", "AUTHOR"])
  if (!session) return

  if (req.method === "GET") {
    const posts =
      session.user.role === "ADMIN"
        ? await prisma.post.findMany({ orderBy: { createdAt: "desc" } })
        : await prisma.post.findMany({
            where: { authorId: parseInt(session.user.id) },
            orderBy: { createdAt: "desc" },
          })
    return res.json(posts)
  }

  if (req.method === "POST") {
    const { title, content, coverImage, categoryId, status } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        categoryId,
        status,
        authorId: parseInt(session.user.id),
      },
    })
    return res.status(201).json(newPost)
  }

  res.setHeader("Allow", ["GET", "POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
