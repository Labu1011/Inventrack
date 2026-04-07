import { cancelOrderSchema, placeOrderSchema } from "../dtos/order.dto.js"
import {
  cancelOrderService,
  placeOrderService,
} from "../services/order.service.js"
import { successResponse } from "../utils/successResponse.js"

async function placeOrder(req, res, next) {
  try {
    const { items } = placeOrderSchema.parse(req.body)
    const userId = req.user?.id

    const order = await placeOrderService(userId, items)

    return res
      .status(201)
      .json(successResponse({ order }, "Order placed successfully."))
  } catch (err) {
    next(err)
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { id } = cancelOrderSchema.parse({ id: req.params.id })
    const userId = req.user?.id

    const order = await cancelOrderService(id, userId)

    res
      .status(200)
      .json(successResponse({ order }, "Order cancelled successfully."))
  } catch (err) {
    next(err)
  }
}

async function getOrderHistory(req, res, next) {}

export { placeOrder, cancelOrder, getOrderHistory }
