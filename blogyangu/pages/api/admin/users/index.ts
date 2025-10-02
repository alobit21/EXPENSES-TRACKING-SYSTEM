import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authorize } from "../../../../lib/authorize"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await authorize(req, res, ["ADMIN"])
  if (!session) return

  if (req.method === "GET") {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
    return res.json(users)
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
