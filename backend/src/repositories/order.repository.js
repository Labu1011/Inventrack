import { prisma } from "../lib/prisma-client.js"

async function placeOrder(userId, items, totalAmount) {
  return
}

async function createOrder(data, tx = prisma) {
  return tx.order.create({
    data: {
      user: {
        connect: { id: data.userId },
      },
      status: data.status,
      totalAmount: data.totalAmount,
    },
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

async function updateOrderStatus(orderId, status, tx = prisma) {
  return tx.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  })
}

async function updateOrderStatusIfCancellable(orderId, userId, tx = prisma) {
  return tx.order.updateMany({
    where: {
      id: orderId,
      userId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    data: {
      status: "CANCELLED",
    },
  })
}

async function findOrderDetailById(orderId, tx = prisma) {
  return tx.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      },
    },
  })
}

async function getOrderHistory(where, take, skip) {
  return prisma.order.findMany({
    where,
    take,
    skip,
  })
}

async function countOrders(where) {
  return prisma.order.count({
    where,
  })
}

export const orderRepository = {
  placeOrder,
  createOrder,
  createOrderItems,
  findOrderById,
  findOrderDetailById,
  getOrderHistory,
  countOrders,
  updateOrderStatus,
  updateOrderStatusIfCancellable,
}
