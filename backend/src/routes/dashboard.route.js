import express from "express"
import {
  getDashboardSummary,
  getInventoryAlerts,
  getSalesTrend,
  getTopProducts,
} from "../controllers/dashboard.controller.js"

const router = express.Router()

router.get("/summary", getDashboardSummary)
router.get("/sales-trend", getSalesTrend)
router.get("/inventory-alerts", getInventoryAlerts)
router.get("/top-products", getTopProducts)

export default router
