import { loginSchema } from "../dtos/auth.dto.js"
import { createUserSchema } from "../dtos/user.dto.js"
import { authenticate, createUserService } from "../services/auth.service.js"
import { formatZodError } from "../utils/formatZodError.js"

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
