import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UnauthorizedError } from "./apiError.js"

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_EXP || "30s",
  })
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired access token")
  }
}

async function hashToken(token) {
  return await bcrypt.hash(token, parseInt(process.env.SALT_ROUNDS || "12", 10))
}

export { signAccessToken, verifyAccessToken, hashToken }
