import express from "express"
import {
  createStockMovement,
  getAllStockMovements,
  getCurrentStockLevel,
  getLowStockProducts,
} from "../controllers/stockMovement.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post(
  "/move",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  createStockMovement,
)
router.get(
  "/history",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  getAllStockMovements,
)
router.get(
  "/low-stock",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  getLowStockProducts,
)
router.get("/:productId", getCurrentStockLevel)

export default router
