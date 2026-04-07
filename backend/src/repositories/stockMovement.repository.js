import { prisma } from "../lib/prisma-client.js"

async function groupStockLevelByType(productId, tx = prisma) {
  return tx.stockMovement.groupBy({
    by: "type",
    where: {
      productId,
    },
    _sum: {
      quantity: true,
    },
  })
}

async function createStockMovement(data, tx = prisma) {
  return tx.stockMovement.create({
    data: {
      productId: data.productId,
      orderId: data.orderId ?? undefined,
      type: data.type,
      quantity: data.quantity,
      note: data.note ?? undefined,
    },
  })
}

async function findManyStockMovements(where, limit, skip) {
  return prisma.stockMovement.findMany({
    where,
    include: {
      product: {
        select: {
          name: true,
          sku: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    take: limit,
    skip,
    orderBy: { createdAt: "desc" },
  })
}

async function countStockMovements(where) {
  return prisma.stockMovement.count({ where })
}

async function findStockOutMovementsByOrderId(orderId, tx = prisma) {
  return tx.stockMovement.findMany({
    where: {
      orderId,
      type: "OUT",
    },
  })
}

export const stockMovementRepository = {
  groupStockLevelByType,
  createStockMovement,
  findManyStockMovements,
  findStockOutMovementsByOrderId,
  countStockMovements,
}
