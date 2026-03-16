import express from "express"
import {
  createProduct,
  deactivateProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product.controller.js"

const router = express.Router()

router.post("/", createProduct)
router.get("/", getProducts)
router.get("/:categoryId", getProductsByCategory)
router.patch("/:id", updateProduct)
router.patch("/:id/deactivate", deactivateProduct)

export default router
