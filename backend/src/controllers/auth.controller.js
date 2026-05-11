import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../dtos/auth.dto.js"
import {
  createUserSchema,
  registerUserSchema,
  updateUserRoleSchema,
} from "../dtos/user.dto.js"
import {
  authenticate,
  createUserService,
  forgotPasswordService,
  getAllStaffAccountsService,
  getMe,
  getUserByIdService,
  logoutAllSessions,
  logoutByToken,
  registerUserService,
  resetPasswordService,
  rotateRefreshToken,
  updateUserRoleService,
} from "../services/auth.service.js"
import { successResponse } from "../utils/successResponse.js"

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const { accessToken, refreshToken, user } = await authenticate({
      email,
      password,
    })

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(
        successResponse(
          {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            accessToken,
          },
          "Login successful",
        ),
      )
  } catch (err) {
    next(err)
  }
}

async function refresh(req, res, next) {
  try {
    const oldToken = req.cookies?.refreshToken

    if (!oldToken)
      return res.status(401).json({ message: "Refresh token missing" })

    const { accessToken, refreshToken } = await rotateRefreshToken(oldToken)

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(successResponse({ accessToken }))
  } catch (err) {
    next(err)
  }
}

async function logout(req, res) {
  const token = req.cookies?.refreshToken

  if (token) await logoutByToken(token)
  res
    .clearCookie("refreshToken")
    .status(200)
    .json(successResponse(null, "Logged out"))
}

async function logoutAll(req, res) {
  const token = req.cookies?.refreshToken
  if (!token) {
    res.clearCookie("refreshToken")
    return res
      .status(200)
      .json(successResponse(null, "Logged out from all devices"))
  }

  await logoutAllSessions(token)
  res.clearCookie("refreshToken")

  return res
    .status(200)
    .json(successResponse(null, "Logged out from all devices"))
}

async function me(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    const user = await getMe(authHeader)

    return res.json(successResponse({ user }))
  } catch (err) {
    next(err)
  }
}

async function getUserById(req, res, next) {
  try {
    const id = req.params.id
    const user = await getUserByIdService(id)

    return res.status(200).json(successResponse({ user }))
  } catch (err) {
    next(err)
  }
}

async function createUser(req, res, next) {
  try {
    const parsed = createUserSchema.parse(req.body)

    const user = await createUserService(parsed)

    return res
      .status(200)
      .json(successResponse({ user }, "User created successfully"))
  } catch (err) {
    next(err)
  }
}

async function registerUser(req, res, next) {
  try {
    const parsed = registerUserSchema.parse(req.body)

    const user = await registerUserService(parsed)

    return res
      .status(200)
      .json(successResponse({ user }, "User created successfully"))
  } catch (err) {
    next(err)
  }
}

async function getAllStaffAccounts(req, res, next) {
  try {
    const staffUsers = await getAllStaffAccountsService()

    return res.status(200).json(successResponse(staffUsers))
  } catch (err) {
    next(err)
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = updateUserRoleSchema.parse(req.body)
    const id = req.params.id

    const updatedUser = await updateUserRoleService(id, role)

    return res.status(200).json(successResponse({ user: updatedUser }))
  } catch (err) {
    next(err)
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body)
    await forgotPasswordService(email)

    return res
      .status(200)
      .json(successResponse(null, "A reset link was sent to your email"))
  } catch (err) {
    next(err)
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body)
    await resetPasswordService(token, newPassword)
    return res
      .status(200)
      .json(successResponse(null, "Password reset successful"))
  } catch (err) {
    next(err)
  }
}

export {
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  me,
  getUserById,
  getAllStaffAccounts,
  createUser,
  registerUser,
  updateUserRole,
}
