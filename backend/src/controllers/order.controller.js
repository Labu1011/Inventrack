import {
  cancelOrderSchema,
  orderHistoryQuerySchema,
  placeOrderSchema,
  updateOrderStatusSchema,
} from "../dtos/order.dto.js"
import {
  cancelOrderService,
  getMyOrdersService,
  getOrderDetailsService,
  getOrderHistoryService,
  placeOrderService,
  updateOrderStatusService,
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

async function updateOrderStatus(req, res, next) {
  try {
    const parsed = updateOrderStatusSchema.parse({
      id: req.params.id,
      status: req.body.status,
    })

    const updatedOrder = await updateOrderStatusService(
      parsed.id,
      parsed.status,
    )

    return res
      .status(200)
      .json(
        successResponse(
          { order: updatedOrder },
          "Order status updated successfully.",
        ),
      )
  } catch (err) {
    next(err)
  }
}

async function getOrderHistory(req, res, next) {
  try {
    const queryParams = orderHistoryQuerySchema.parse(req.query)
    const user = req.user

    const orders = await getOrderHistoryService(queryParams, user)

    return res.status(200).json(successResponse(orders))
  } catch (err) {
    next(err)
  }
}

async function getOrderDetails(req, res, next) {
  try {
    const id = req.params.id
    const user = req.user

    const order = await getOrderDetailsService(id, user)

    return res.status(200).json(successResponse(order))
  } catch (err) {
    next(err)
  }
}

async function getMyOrders(req, res, next) {
  try {
    const user = req.user

    const orders = await getMyOrdersService(user)

    return res.status(200).json(successResponse({ orders }))
  } catch (err) {
    next(err)
  }
}

export {
  placeOrder,
  cancelOrder,
  getOrderHistory,
  updateOrderStatus,
  getOrderDetails,
  getMyOrders,
}
