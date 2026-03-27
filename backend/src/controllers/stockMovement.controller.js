import { createStockMovementSchema } from "../dtos/stock.dto.js"
import { createStockMovementService } from "../services/stockMovement.service.js"
import { successResponse } from "../utils/successResponse.js"

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

async function getAllStockMovements(req, res) {}

export { createStockMovement, getAllStockMovements }
