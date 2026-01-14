import express from "express"
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", requireAuth, requireRole("ADMIN"), createCategory)
router.get("/", getCategories)

export default router
