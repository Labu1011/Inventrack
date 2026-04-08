import express from "express"
import {
  cancelOrder,
  getOrderHistory,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", requireAuth, placeOrder)
router.patch("/:id/cancel", requireAuth, cancelOrder)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  updateOrderStatus,
)
router.get("/", requireAuth, getOrderHistory)

export default router
