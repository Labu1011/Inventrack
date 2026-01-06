import express from "express"
import {
  login,
  refresh,
  logout,
  me,
  createUser,
  logoutAll,
} from "../controllers/auth.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.post("/logout-all", logoutAll)
router.get("/me", me)
router.post("/create-user", requireAuth, requireRole("ADMIN"), createUser)

export default router
