import express from "express"
import {
  login,
  logout,
  me,
  createUser,
} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/logout", logout)
router.get("/me", me)
router.post("/create-user", createUser)

export default router
