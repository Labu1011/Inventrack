import { prisma } from "../lib/prisma-client.js"
import bcrypt from "bcrypt"
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.js"

async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("Invalid email or password")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Invalid email or password")

  const payload = { sub: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

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

export { authenticate, createUserService }
