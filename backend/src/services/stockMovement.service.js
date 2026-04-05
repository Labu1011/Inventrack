import { stockMovementRepository } from "../repositories/stockMovement.repository.js"
import { BadRequestError } from "../utils/apiError.js"
import { ensureActiveProduct } from "./product.service.js"

async function getCurrentStockLevelService(productId) {
  await ensureActiveProduct(productId)

  const getStockLevel =
    await stockMovementRepository.groupStockLevelByType(productId)

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
  const page = parseInt(queryParams.page, 10) || 1
  const limit = parseInt(queryParams.limit, 10) || 10

  const skip = (page - 1) * limit

  const where = {}
  if (queryParams.productId) where.productId = queryParams.productId
  if (queryParams.type) where.type = String(queryParams.type).toUpperCase()

  if (queryParams.startDate || queryParams.endDate) {
    const createdAt = {}

    if (queryParams.startDate) {
      const start = new Date(queryParams.startDate)
      if (isNaN(start)) throw new BadRequestError("Invalid startDate.")
      createdAt.gte = start
    }

    if (queryParams.endDate) {
      const end = new Date(queryParams.endDate)
      if (isNaN(end)) throw new BadRequestError("Invalid endDate.")
      createdAt.lte = end
    }

    if (createdAt.gte && createdAt.lte && createdAt.gte > createdAt.lte) {
      throw new BadRequestError(
        "Start date must be earlier than or equal to end date.",
      )
    }

    where.createdAt = createdAt
  }

  const [stockHistory, count] = await Promise.all([
    await stockMovementRepository.findManyStockMovements(where, limit, skip),
    await stockMovementRepository.countStockMovements(where),
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
  createStockMovementService,
  getCurrentStockLevelService,
  getAllStockMovementsService,
}
