import bcrypt from "bcrypt"
import crypto, { hash } from "crypto"
import {
  hashToken,
  signAccessToken,
  verifyAccessToken,
} from "../utils/tokens.js"
import {
  ApiError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js"
import { authRepository } from "../repositories/auth.repository.js"
import { sendPasswordResetEmail } from "../utils/mailer.js"

async function authenticate({ email, password }) {
  const user = await authRepository.findUserByEmail(email)
  if (!user) throw new UnauthorizedError("Incorrect email or password")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new UnauthorizedError("Incorrect email or password")

  const payload = { sub: user.id, role: user.role }
  const accessToken = signAccessToken(payload)

  // Random refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex")

  // storing refreshToken in DB
  await authRepository.createRefreshToken(refreshToken, user)

  return { accessToken, refreshToken, user }
}

async function getMe(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid token")
  }

  const token = authHeader.split(" ")[1]
  const payload = verifyAccessToken(token)

  const user = await authRepository.findUserById(payload.sub)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  return user
}

async function getUserByIdService(userId) {
  const user = await authRepository.findUserById(userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  return user
}

async function logoutByToken(refreshToken) {
  const token = await authRepository.findRefreshToken(refreshToken)

  if (!token) {
    throw new ApiError("Logged out", 200)
  }

  const userId = token.userId

  await authRepository.deleteRefreshToken(token.id)

  await authRepository.deleteAllRevokedRefreshToken(userId)
}

async function logoutAllSessions(token) {
  const stored = await authRepository.findRefreshToken(token)

  if (stored) {
    await authRepository.deleteAllRefreshToken(stored.userId)
  }
}

async function rotateRefreshToken(oldToken) {
  const stored = await authRepository.findRefreshToken(oldToken)

  if (!stored) throw new UnauthorizedError("Invalid refresh token")

  if (stored.revoked) {
    throw new UnauthorizedError("Refresh token has been revoked")
  }

  if (stored.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired")
  }

  await authRepository.revokeRefreshTokenById(stored.id)

  const user = await authRepository.findUserById(stored.userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  const payload = { sub: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  // Random refresh token
  const refreshToken = crypto.randomBytes(40).toString("hex")

  await authRepository.createRefreshToken(refreshToken, user)

  return { accessToken, refreshToken }
}

async function createUserService(data) {
  const userExists = await authRepository.findUserByEmail(data.email)

  if (userExists) {
    throw new ConflictError("User with this email already exists")
  }

  const hashedPassword = await hashToken(data.password)

  const user = await authRepository.createStaffAccount(data, hashedPassword)

  return user
}

async function registerUserService(data) {
  const userExists = await authRepository.findUserByEmail(data.email)

  if (userExists) {
    throw new ConflictError("User with this email already exists")
  }

  const hashedPassword = await hashToken(data.password)

  const user = await authRepository.createCustomerUser(data, hashedPassword)

  return user
}

async function getAllStaffAccountsService() {
  const staffUsers = await authRepository.getAllStaffAccounts()

  return staffUsers
}

async function updateUserRoleService(userId, role) {
  const user = await authRepository.findUserById(userId)
  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (user?.role === "USER") {
    throw new BadRequestError(
      "A customer user cannot be promoted to a staff role.",
    )
  }

  if (user.role === "ADMIN" && role === "MANAGER") {
    const adminCount = await authRepository.countAdmins()

    if (adminCount <= 1) {
      throw new BadRequestError(
        "At least one admin is required. Assign another admin before changing this role.",
      )
    }
  }

  const updatedUser = await authRepository.updateUserRole(userId, role)

  return updatedUser
}

async function forgotPasswordService(email) {
  const user = await authRepository.findUserByEmail(email)
  if (!user) return

  const rawToken = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  await authRepository.setPasswordReset(user.id, tokenHash, expiresAt)

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`

  await sendPasswordResetEmail(user.email, resetLink)
}

async function resetPasswordService(token, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const user = await authRepository.findUserByResetToken(tokenHash)

  if (
    !user ||
    !user.passwordResetExpires ||
    user.passwordResetExpires < new Date()
  ) {
    throw new BadRequestError("Invalid or expired reset token")
  }

  const hashedPassword = await hashToken(newPassword)
  await authRepository.updatePasswordAndClearReset(user.id, hashedPassword)

  await authRepository.deleteAllRefreshToken(user.id)
}

export {
  authenticate,
  getMe,
  getUserByIdService,
  rotateRefreshToken,
  logoutByToken,
  logoutAllSessions,
  createUserService,
  registerUserService,
  getAllStaffAccountsService,
  updateUserRoleService,
  forgotPasswordService,
  resetPasswordService,
}
