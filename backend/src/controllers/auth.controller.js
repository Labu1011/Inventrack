import { loginSchema } from "../dtos/auth.dto.js"
import { createUserSchema } from "../dtos/user.dto.js"
import {
  authenticate,
  createUserService,
  getMe,
  logoutAllSessions,
  logoutByToken,
  rotateRefreshToken,
} from "../services/auth.service.js"
import { formatZodError } from "../utils/formatZodError.js"
import { verifyAccessToken } from "../utils/tokens.js"

async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const { accessToken, refreshToken, user } = await authenticate({
      email,
      password,
    })

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      })
  } catch (err) {
    const zodError = formatZodError(err)
    if (zodError) {
      return res.status(400).json(zodError)
    }

    return res.status(400).json({
      message: err.message || "Failed to login",
    })
  }
}

async function refresh(req, res) {
  try {
    const oldToken = req.cookies?.refreshToken

    if (!oldToken)
      return res.status(401).json({ message: "Refresh token missing" })

    const { accessToken, refreshToken } = await rotateRefreshToken(oldToken)

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ accessToken })
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }
}

async function logout(req, res) {
  const token = req.cookies?.refreshToken

  if (token) await logoutByToken(token)
  res.clearCookie("refreshToken").status(200).json({ message: "Logged out" })
}

async function logoutAll(req, res) {
  const token = req.cookies?.refreshToken
  if (!token) {
    res.clearCookie("refreshToken")
    return res.status(200).json({ message: "Logged out from all devices" })
  }

  await logoutAllSessions(token)
  res.clearCookie("refreshToken")

  return res.status(200).json({ message: "Logged out from all devices" })
}

async function me(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyAccessToken(token)

    const user = await getMe(payload)

    return res.json({ user })
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

async function createUser(req, res) {
  try {
    const parsed = createUserSchema.parse(req.body)

    const user = await createUserService(parsed)

    return res.status(200).json({
      message: "User created successfully",
      user,
    })
  } catch (err) {
    const zodError = formatZodError(err)
    if (zodError) {
      return res.status(400).json(zodError)
    }

    return res.status(400).json({
      message: err.message || "Failed to create user",
    })
  }
}

export { login, refresh, logout, logoutAll, me, createUser }
