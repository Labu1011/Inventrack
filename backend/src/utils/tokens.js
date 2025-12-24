import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const ACCESS_EXP = process.env.ACCESS_EXP || "30s"
const REFRESH_EXP = process.env.REFRESH_EXP || "1d"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "12", 10)

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXP })
}

function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXP })
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

async function hashToken(token) {
  return await bcrypt.hash(token, SALT_ROUNDS)
}

async function compareToken(hash, token) {
  return await bcrypt.compare(token, hash)
}

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  compareToken,
  ACCESS_EXP,
  REFRESH_EXP,
}
