import { createUserSchema } from "../dtos/user.dto.js"
import { authenticate, createUserService } from "../services/auth.service.js"
import { formatZodError } from "../utils/formatZodError.js"

async function login(req, res) {
  const { email, password } = req.body
  const user = await authenticate({ email, password })

  if (!user) res.status(404).json({ message: "User not found." })
}

async function logout(req, res) {}

async function me(req, res) {}

async function createUser(req, res) {
  try {
    const parsed = createUserSchema.parse(req.body)
    console.log(parsed)

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

export { login, logout, me, createUser }
