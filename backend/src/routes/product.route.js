import express from "express"
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  restoreProduct,
  updateProduct,
} from "../controllers/product.controller.js"

const router = express.Router()

router.post("/", createProduct)
router.get("/", getProducts)
router.get("/:categoryId", getProductsByCategory)
router.patch("/:id", updateProduct)
router.patch("/:id/delete", deleteProduct)
router.patch("/:id/restore", restoreProduct)

export default router
