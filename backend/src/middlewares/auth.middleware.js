import { prisma } from "../lib/prisma-client.js"
import { ForbiddenError, UnauthorizedError } from "../utils/apiError.js"
import { verifyAccessToken } from "../utils/tokens.js"

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) throw new UnauthorizedError()
    const payload = verifyAccessToken(token)

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })

    if (!user) throw new UnauthorizedError("User not found")

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      next(new ForbiddenError())
      return
    }

    next()
  }
}
