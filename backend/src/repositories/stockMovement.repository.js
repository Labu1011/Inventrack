import { prisma } from "../lib/prisma-client.js"

async function groupStockLevelByType(productId) {
  return prisma.stockMovement.groupBy({
    by: "type",
    where: {
      productId,
    },
    _sum: {
      quantity: true,
    },
  })
}

async function createStockMovement(data) {
  return prisma.stockMovement.create({
    data: {
      productId: data.productId,
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

export const stockMovementRepository = {
  groupStockLevelByType,
  createStockMovement,
  findManyStockMovements,
  countStockMovements,
}
