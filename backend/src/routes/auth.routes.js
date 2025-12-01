import express from "express"
import {
  login,
  logout,
  me,
  createUser,
} from "../controllers/auth.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/login", login)
router.post("/logout", logout)
router.get("/me", me)
router.post("/create-user", requireAuth, requireRole("ADMIN"), createUser)

export default router
