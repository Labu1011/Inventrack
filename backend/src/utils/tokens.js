import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_EXP = process.env.ACCESS_EXP || "15m"
const REFRESH_EXP = process.env.REFRESH_EXP || "30d"
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "12", 10)

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXP })
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

async function hashToken(token) {
  return await bcrypt.hash(token, SALT_ROUNDS)
}

async function compareToken(hash, token) {
  return await bcrypt.compare(token, hash)
}

export {
  signAccessToken,
  verifyAccessToken,
  hashToken,
  compareToken,
  ACCESS_EXP,
  REFRESH_EXP,
}
