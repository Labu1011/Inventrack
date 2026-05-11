import { prisma } from "../lib/prisma-client.js"

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

async function createStaffAccount(data, hashedPassword) {
  return prisma.user.create({
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
}

async function getAllStaffAccounts() {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "MANAGER"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}

async function createCustomerUser(data, hashedPassword) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}

async function createRefreshToken(refreshToken, user) {
  return prisma.refreshToken.create({
    data: {
      hashedToken: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

async function countAdmins() {
  return prisma.user.count({
    where: {
      role: "ADMIN",
    },
  })
}

async function updateUserRole(id, role) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}

async function findRefreshToken(refreshToken) {
  return prisma.refreshToken.findFirst({
    where: { hashedToken: refreshToken },
  })
}

async function revokeRefreshTokenById(id) {
  return prisma.refreshToken.update({
    where: { id },
    data: { revoked: true },
  })
}

async function deleteRefreshToken(id) {
  return prisma.refreshToken.delete({ where: { id } })
}

async function deleteAllRefreshToken(userId) {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  })
}

async function deleteAllRevokedRefreshToken(userId) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
      revoked: true,
    },
  })
}

export const authRepository = {
  findUserByEmail,
  createStaffAccount,
  createCustomerUser,
  createRefreshToken,
  findUserById,
  countAdmins,
  getAllStaffAccounts,
  updateUserRole,
  findRefreshToken,
  revokeRefreshTokenById,
  deleteRefreshToken,
  deleteAllRefreshToken,
  deleteAllRevokedRefreshToken,
}
