import { prisma } from "../lib/prisma-client.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import {
  hashToken,
  signAccessToken,
  verifyAccessToken,
} from "../utils/tokens.js"
import {
  ApiError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js"

async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new UnauthorizedError("Invalid email or password")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new UnauthorizedError("Invalid email or password")

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

async function getMe(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid token")
  }

  const token = authHeader.split(" ")[1]
  const payload = verifyAccessToken(token)

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  if (!user) {
    throw new NotFoundError("User not found")
  }

  return user
}

async function logoutByToken(refreshToken) {
  const token = await prisma.refreshToken.findFirst({
    where: { hashedToken: refreshToken },
  })

  if (!token) {
    throw new ApiError("Logged out", 200)
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

async function logoutAllSessions(token) {
  const stored = await prisma.refreshToken.findFirst({
    where: { hashedToken: token },
  })

  if (stored) {
    await prisma.refreshToken.deleteMany({
      where: { userId: stored.userId },
    })
  }
}

async function rotateRefreshToken(oldToken) {
  const stored = await prisma.refreshToken.findFirst({
    where: { hashedToken: oldToken },
  })

  if (!stored) throw new UnauthorizedError("Invalid refresh token")

  if (stored.revoked) {
    throw new UnauthorizedError("Refresh token has been revoked")
  }

  if (stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired")
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  })

  const user = await prisma.user.findUnique({ where: { id: stored.userId } })

  if (!user) {
    throw new NotFoundError("User not found")
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
    throw new ConflictError("User with this email already exists")
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

async function registerUserService(data) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (userExists) {
    throw new ConflictError("User with this email already exists")
  }

  const hashedPassword = await hashToken(data.password)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
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

export {
  authenticate,
  getMe,
  rotateRefreshToken,
  logoutByToken,
  logoutAllSessions,
  createUserService,
  registerUserService,
}
