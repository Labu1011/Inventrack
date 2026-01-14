import express from "express"
import {
  createCategory,
  disableCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", requireAuth, requireRole("ADMIN"), createCategory)
router.get("/", getCategories)
router.get("/:id", getCategory)
router.patch("/:id", requireAuth, requireRole("ADMIN"), updateCategory)
router.delete("/:id", disableCategory)

export default router
