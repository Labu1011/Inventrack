import { prisma } from "../lib/prisma-client.js"

async function placeOrder(userId, items, totalAmount) {
  return
}

async function createOrder(data, tx = prisma) {
  return tx.order.create({
    data,
  })
}

async function createOrderItems(orderId, items, tx = prisma) {
  return tx.orderItem.createMany({
    data: items.map((item) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  })
}

async function findOrderById(orderId, tx = prisma) {
  return tx.order.findUnique({
    where: {
      id: orderId,
    },
  })
}

export const orderRepository = {
  placeOrder,
  createOrder,
  createOrderItems,
  findOrderById,
}
