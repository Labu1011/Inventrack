import express from "express"
import {
  activateCategory,
  createCategory,
  deactivateCategory,
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
router.patch("/:id/deactivate", deactivateCategory)
router.patch("/:id/activate", activateCategory)

export default router
