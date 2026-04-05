import express from "express"
import {
  cancelOrder,
  getOrderHistory,
  placeOrder,
} from "../controllers/order.controller.js"

const router = express.Router()

router.post("/", placeOrder)
router.patch("/:id/cancel", cancelOrder)
router.get("/", getOrderHistory)

export default router
