import express from "express"
import {
  login,
  refresh,
  logout,
  me,
  createUser,
  logoutAll,
  registerUser,
  updateUserRole,
  getAllStaffAccounts,
} from "../controllers/auth.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", registerUser)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.post("/logout-all", logoutAll)
router.get("/me", me)
router.get(
  "/staff-accounts",
  requireAuth,
  requireRole(["ADMIN"]),
  getAllStaffAccounts,
)
router.post("/create-user", requireAuth, requireRole("ADMIN"), createUser)
router.patch("/role/:id", requireAuth, requireRole(["ADMIN"]), updateUserRole)

export default router
