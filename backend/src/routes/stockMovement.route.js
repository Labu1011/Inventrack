import express from "express"
import {
  createStockMovement,
  getAllStockMovements,
  getCurrentStockLevel,
} from "../controllers/stockMovement.controller.js"

const router = express.Router()

router.post("/move", createStockMovement)
router.get("/history", getAllStockMovements)
router.get("/:productId", getCurrentStockLevel)

export default router
