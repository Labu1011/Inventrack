import { prisma } from "../lib/prisma-client.js"

async function getCurrentStockService(productId) {
  const getStockLevel = await prisma.stockMovement.groupBy({
    by: "type",
    where: {
      productId,
    },
    _sum: {
      quantity: true,
    },
  })

  const totals = getStockLevel.reduce(
    (acc, curr) => {
      acc[curr.type] = curr._sum.quantity || 0
      return acc
    },
    { IN: 0, OUT: 0, ADJUST: 0 },
  )

  const currentStock = totals.IN + totals.ADJUST - totals.OUT
  return currentStock
}

async function createStockMovementService(data) {}

export { createStockMovementService }
