// lib/authorize.ts
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

export const authorize = async (
  req: NextApiRequest,
  res: NextApiResponse,
  roles: string[] = []
) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ message: "Unauthorized" })
    return null
  }
  if (roles.length && !roles.includes(session.user.role)) {
    res.status(403).json({ message: "Forbidden" })
    return null
  }
  return session
}
