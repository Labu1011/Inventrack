import express from "express"
import {
  getDashboardSummary,
  getInventoryAlerts,
  getSalesTrend,
  getTopProducts,
} from "../controllers/dashboard.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get(
  "/summary",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  getDashboardSummary,
)
router.get(
  "/sales-trend",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  getSalesTrend,
)
router.get("/inventory-alerts", getInventoryAlerts)
router.get("/top-products", getTopProducts)

export default router
