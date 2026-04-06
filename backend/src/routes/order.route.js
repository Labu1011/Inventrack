import express from "express"
import {
  cancelOrder,
  getOrderHistory,
  placeOrder,
} from "../controllers/order.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", requireAuth, placeOrder)
router.patch("/:id/cancel", cancelOrder)
router.get("/", getOrderHistory)

export default router
