import { prisma } from "../lib/prisma-client.js"
import { orderRepository } from "../repositories/order.repository.js"
import { productRepository } from "../repositories/product.repository.js"
import { stockMovementRepository } from "../repositories/stockMovement.repository.js"
import { BadRequestError, NotFoundError } from "../utils/apiError.js"
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
    const product = await productRepository.findActiveProductById(
      item.productId,
      tx,
    )
    if (!product)
      throw new NotFoundError(
        `Product not found or inactive: ${item.productId}`,
      )

    const aggregation = await stockMovementRepository.groupStockLevelByType(
      item.productId,
      tx,
    )

    const currentStock = calculateCurrentStock(aggregation)

    if (currentStock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for product ${item.productId}. Available: ${currentStock}, requested: ${item.quantity}`,
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

export { placeOrderService }
