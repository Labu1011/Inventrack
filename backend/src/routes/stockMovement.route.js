import express from "express"
import {
  createStockMovement,
  getAllStockMovements,
} from "../controllers/stockMovement.controller.js"

const router = express.Router()

router.post("/", createStockMovement)
router.get("/", getAllStockMovements)

export default router
