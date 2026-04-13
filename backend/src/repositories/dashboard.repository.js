import { prisma } from "../lib/prisma-client.js"

async function getOrderCount() {
  return prisma.order.count()
}

async function getCountOfOrdersByStatus() {
  return prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
}

async function getOrderAmountsByStatus() {
  return prisma.order.groupBy({
    by: ["status"],
    _sum: {
      totalAmount: true,
    },
  })
}

async function getStockLevelsByProduct() {
  return prisma.stockMovement.groupBy({
    by: ["productId", "type"],
    _sum: {
      quantity: true,
    },
  })
}

export const dashboardRepository = {
  getOrderCount,
  getCountOfOrdersByStatus,
  getOrderAmountsByStatus,
  getStockLevelsByProduct,
}
