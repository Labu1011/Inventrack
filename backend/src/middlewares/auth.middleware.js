import { prisma } from "../lib/prisma-client.js"
import { verifyAccessToken } from "../utils/tokens.js"

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).json({ error: "Unauthorized" })
    const payload = verifyAccessToken(token)

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })

    if (!user) return res.status(401).json({ error: "User not found" })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid token: please login" })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" })
    }

    next()
  }
}
