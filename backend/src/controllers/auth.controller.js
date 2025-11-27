import { authenticate } from "../services/auth.service.js"

async function login(req, res) {
  const { email, password } = req.body
  const user = await authenticate({ email, password })

  if (!user) res.status(404).json({ message: "User not found." })
}

async function logout(req, res) {}

async function me(req, res) {}

async function createUser(req, res) {}

export { login, logout, me, createUser }
