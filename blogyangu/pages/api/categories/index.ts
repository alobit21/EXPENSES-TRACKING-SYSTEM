import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

// Generate slug
function makeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const role = session?.user?.role

  if (req.method === "GET") {
    // Public: return all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    return res.json(categories)
  }

  // Only ADMIN can create/update/delete
  if (!session || role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" })
  }

  if (req.method === "POST") {
    const { name, description } = req.body
    if (!name) return res.status(400).json({ message: "Name is required" })

    try {
      const category = await prisma.category.create({
        data: { name, slug: makeSlug(name), description },
      })
      return res.status(201).json(category)
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === "P2002") {
        return res.status(400).json({ message: "Category already exists" })
      }
      console.error(error)
      return res.status(500).json({ message: "Server error" })
    }
  }

  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
