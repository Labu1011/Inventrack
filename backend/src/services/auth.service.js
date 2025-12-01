import { prisma } from "../lib/prisma-client.js"
import bcrypt from "bcrypt"
import { hashToken } from "../utils/tokens.js"

async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
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
