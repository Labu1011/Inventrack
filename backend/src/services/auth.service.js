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
import { authRepository } from "../repositories/auth.repository.js"

async function authenticate({ email, password }) {
  const user = await authRepository.findUserByEmail(email)
  if (!user) throw new UnauthorizedError("Invalid email or password")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new UnauthorizedError("Invalid email or password")

  console.log(user)
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

  await authRepository.createRefreshToken(refreshToken, payload.sub)

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

export {
  authenticate,
  getMe,
  rotateRefreshToken,
  logoutByToken,
  logoutAllSessions,
  createUserService,
  registerUserService,
}
