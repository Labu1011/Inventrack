import { stockMovementRepository } from "../repositories/stockMovement.repository.js"
import { BadRequestError } from "../utils/apiError.js"
import { ensureActiveProduct } from "./product.service.js"

function calculateCurrentStock(aggregation) {
  const totals = aggregation.reduce(
    (acc, curr) => {
      acc[curr.type] = curr._sum.quantity || 0
      return acc
    },
    { IN: 0, OUT: 0, ADJUST: 0 },
  )

  return totals.IN + totals.ADJUST - totals.OUT
}

async function getCurrentStockLevelService(productId) {
  await ensureActiveProduct(productId)

  const getStockLevel =
    await stockMovementRepository.groupStockLevelByType(productId)

  const currentStock = calculateCurrentStock(getStockLevel)
  return currentStock
}

async function createStockMovementService(data) {
  try {
    await ensureActiveProduct(data.productId)

    if (data.type === "OUT" || (data.type === "ADJUST" && data.quantity < 0)) {
      const currentStock = await getCurrentStockLevelService(data.productId)

      if (currentStock < Math.abs(data.quantity))
        throw new BadRequestError(
          `Insufficient stock level. Available: ${currentStock}, Requested: ${Math.abs(data.quantity)}.`,
        )
    }

    const stockMovement =
      await stockMovementRepository.createStockMovement(data)

    return stockMovement
  } catch (err) {
    throw err
  }
}

async function getAllStockMovementsService(queryParams) {
  const page = queryParams.page
  const limit = queryParams.limit

  const skip = (page - 1) * limit

  const where = {}

  if (queryParams.type) where.type = String(queryParams.type).toUpperCase()

  if (queryParams.startDate || queryParams.endDate) {
    const createdAt = { gte: queryParams.startDate, lte: queryParams.endDate }
    where.createdAt = createdAt
  }

  const [stockHistory, count] = await Promise.all([
    stockMovementRepository.findManyStockMovements(where, limit, skip),
    stockMovementRepository.countStockMovements(where),
  ])

  const totalPages = Math.ceil(count / limit)

  return {
    stockHistory,
    meta: {
      totalCount: count,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1 && page <= totalPages,
    },
  }
}

export {
  calculateCurrentStock,
  createStockMovementService,
  getCurrentStockLevelService,
  getAllStockMovementsService,
}
