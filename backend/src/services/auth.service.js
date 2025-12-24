import { prisma } from "../lib/prisma-client.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js"

async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("Invalid email or password")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Invalid email or password")

  const payload = { sub: user.id, role: user.role }
  const accessToken = signAccessToken(payload)

  // Random refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex")

  // storing refreshToken in DB
  await prisma.refreshToken.create({
    data: {
      hashedToken: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  return { accessToken, refreshToken, user }
}

async function logoutByToken(refreshToken) {
  const token = await prisma.refreshToken.findUnique({
    where: { hashedToken: refreshToken },
  })

  if (!token) {
    return res.status(200).json({ message: "Logged out" })
  }

  const userId = token.userId

  await prisma.refreshToken.delete({ where: { id: token.id } })

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      revoked: true,
    },
  })
}

async function rotateRefreshToken(oldToken) {
  const stored = await prisma.refreshToken.findUnique({
    where: { hashedToken: oldToken },
  })

  if (!stored) return res.status(403).json({ error: "Invalid refresh token" })

  if (stored.revoked) {
    return res.status(403).json({ error: "Refresh token has been revoked" })
  }

  if (stored.expiresAt < new Date()) {
    return res.status(403).json({ error: "Refresh token expired" })
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  })

  const user = await prisma.user.findUnique({ where: { id: stored.userId } })

  if (!user) {
    return res.status(403).json({ error: "User not found" })
  }

  const payload = { sub: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  // Random refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex")

  await prisma.refreshToken.create({
    data: {
      hashedToken: refreshToken,
      userId: payload.sub,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  return { accessToken, refreshToken }
}

async function createUserService(data) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (userExists) {
    throw new Error("User with this email already exists")
  }

  const hashedPassword = await hashToken(data.password)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "MANAGER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return user
}

export { authenticate, rotateRefreshToken, logoutByToken, createUserService }
