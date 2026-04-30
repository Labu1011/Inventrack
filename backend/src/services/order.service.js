import { prisma } from "../lib/prisma-client.js"
import { authRepository } from "../repositories/auth.repository.js"
import { orderRepository } from "../repositories/order.repository.js"
import { productRepository } from "../repositories/product.repository.js"
import { stockMovementRepository } from "../repositories/stockMovement.repository.js"
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apiError.js"
import { calculateCurrentStock } from "./stockMovement.service.js"

function aggregateItemsByProduct(items) {
  const map = new Map()

  for (const item of items) {
    map.set(item.productId, (map.get(item.productId) || 0) + item.quantity)
  }

  return Array.from(map.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }))
}

async function placeOrderTx(userId, items, tx) {
  const normalizedItems = aggregateItemsByProduct(items)

  const preparedItems = []
  let totalAmount = 0

  for (const item of normalizedItems) {
    const product = await productRepository.findProductById(item.productId, tx)
    if (!product)
      throw new NotFoundError(
        "One or more items are unavailable. Please refresh your cart.",
      )

    if (!product.isActive) {
      throw new BadRequestError(
        `The product ${product.name} is currently unavailable for purchase.`,
      )
    }

    const aggregation = await stockMovementRepository.groupStockLevelByType(
      item.productId,
      tx,
    )

    const currentStock = calculateCurrentStock(aggregation)

    if (currentStock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for product: ${product.name}. Available: ${currentStock}, requested: ${item.quantity}`,
      )
    }

    preparedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
    })

    totalAmount += Number(product.sellingPrice) * item.quantity
  }

  const order = await orderRepository.createOrder(
    {
      userId,
      totalAmount,
      status: "PENDING",
    },
    tx,
  )

  await orderRepository.createOrderItems(order.id, preparedItems, tx)

  for (const item of preparedItems) {
    await stockMovementRepository.createStockMovement(
      {
        productId: item.productId,
        orderId: order.id,
        type: "OUT",
        quantity: item.quantity,
        note: `Order #${order.orderNumber}`,
      },
      tx,
    )
  }

  return orderRepository.findOrderById(order.id, tx)
}

async function placeOrderService(userId, items) {
  if (!userId) throw new BadRequestError("User is required.")
  if (!Array.isArray(items) || items.length === 0)
    throw new BadRequestError("Order must contain at least one item.")

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        (tx) => placeOrderTx(userId, items, tx),
        { isolationLevel: "Serializable" },
      )
    } catch (err) {
      if (err?.code !== "P2034" || attempt === 3) {
        throw err
      }
    }
  }
}

async function cancelOrderService(id, userId) {
  if (!userId) throw new BadRequestError("User is required.")

  try {
    return await prisma.$transaction(async (tx) => {
      const order = await orderRepository.findOrderById(id, tx)

      if (!order) throw new NotFoundError("This order is not found.")

      if (order.userId !== userId) {
        throw new ForbiddenError("You are not allowed to cancel this order.")
      }

      const updated = await orderRepository.updateOrderStatusIfCancellable(
        order.id,
        userId,
        tx,
      )

      if (updated.count === 0) {
        const latest = await orderRepository.findOrderById(order.id, tx)

        if (!latest) throw new NotFoundError("This order is not found.")
        if (latest.status === "CANCELLED") {
          throw new BadRequestError("Order is already cancelled.")
        }

        throw new BadRequestError(
          `This order #${order.orderNumber} is ${order.status.toLowerCase()}. You cannot cancel this order.`,
        )
      }

      const stockMovements =
        await stockMovementRepository.findStockOutMovementsByOrderId(
          order.id,
          tx,
        )

      for (const stockMovement of stockMovements) {
        const data = {
          orderId: stockMovement.orderId,
          productId: stockMovement.productId,
          type: "IN",
          quantity: stockMovement.quantity,
          note: `Order #${order.orderNumber} cancelled.`,
        }

        await stockMovementRepository.createStockMovement(data, tx)
      }

      return orderRepository.findOrderDetailById(order.id, tx)
    })
  } catch (err) {
    if (err?.code === "P2034") {
      throw new BadRequestError("Order update conflict. Please try again.")
    }
    throw err
  }
}

function isValidStatusTransition(from, to) {
  const allowed = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  }

  return allowed[from]?.includes(to) || false
}

async function updateOrderStatusService(orderId, nextStatus) {
  const order = await orderRepository.findOrderById(orderId)

  if (!order) throw new NotFoundError("Order not found.")
  if (order.status === nextStatus) {
    throw new BadRequestError(`Order is already ${nextStatus}`)
  }

  if (!isValidStatusTransition(order.status, nextStatus)) {
    throw new BadRequestError(
      `Cannot change order status from ${order.status} to ${nextStatus}.`,
    )
  }

  const updated = await orderRepository.updateOrderStatus(order.id, nextStatus)
  return updated
}

async function getOrderHistoryService(queryParams, user) {
  if (!user) throw new UnauthorizedError("Please login and try again.")

  const where = {
    status: queryParams.status,
    createdAt: { gte: queryParams.startDate, lte: queryParams.endDate },
  }
  const take = queryParams.limit
  const skip = (queryParams.page - 1) * take

  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    where.userId = user.id
  }
  const [orders, totalCount] = await Promise.all([
    orderRepository.getOrderHistory(where, take, skip),
    orderRepository.countOrders(where),
  ])

  const totalPages = Math.ceil(totalCount / queryParams.limit)

  return {
    orders,
    meta: {
      totalCount,
      totalPages,
      currentPage: queryParams.page,
      limit: queryParams.limit,
      hasNextPage: queryParams.page >= 1 && queryParams.page < totalPages,
      hasPrevPage: queryParams.page > 1 && queryParams.page <= totalPages,
    },
  }
}

async function getOrderDetailsService(id, user) {
  const order = await orderRepository.getSingleOrder(id)

  if (user?.role === "USER" && order.userId !== user?.id) {
    throw new ForbiddenError("You are not allowed to view this order.")
  }

  return order
}

export {
  placeOrderService,
  cancelOrderService,
  updateOrderStatusService,
  getOrderHistoryService,
  getOrderDetailsService,
}
