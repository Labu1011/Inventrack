import express from "express"
import {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product.controller.js"

const router = express.Router()

router.post("/", createProduct)
router.get("/", getProducts)
router.get("/:categoryId", getProductsByCategory)
router.patch("/:id", updateProduct)

export default router
