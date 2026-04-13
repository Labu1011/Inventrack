import {
  createStockMovementSchema,
  getAllStockMovementsSchema,
} from "../dtos/stock.dto.js"
import {
  createStockMovementService,
  getAllStockMovementsService,
  getCurrentStockLevelService,
} from "../services/stockMovement.service.js"
import { successResponse } from "../utils/successResponse.js"

async function getCurrentStockLevel(req, res, next) {
  try {
    const productId = req.params.productId

    const stockLevel = await getCurrentStockLevelService(productId)

    res.status(200).json(successResponse({ stockLevel }))
  } catch (err) {
    next(err)
  }
}

async function createStockMovement(req, res, next) {
  try {
    const parsed = createStockMovementSchema.parse(req.body)

    const stockMovement = await createStockMovementService(parsed)

    res
      .status(201)
      .json(
        successResponse(
          { stockMovement },
          "Stock movement created successfully.",
        ),
      )
  } catch (err) {
    next(err)
  }
}

async function getAllStockMovements(req, res, next) {
  try {
    const queryParams = getAllStockMovementsSchema.parse(req.query)

    const stockHistory = await getAllStockMovementsService(queryParams)

    res.status(200).json(successResponse(stockHistory))
  } catch (err) {
    next(err)
  }
}

export { createStockMovement, getCurrentStockLevel, getAllStockMovements }
