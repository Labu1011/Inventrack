import express from "express"
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProducts,
  getProductsByCategory,
  restoreProduct,
  updateProduct,
} from "../controllers/product.controller.js"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", requireAuth, requireRole("ADMIN"), createProduct)
router.get("/", getProducts)
router.get("/detail/:id", getProductDetails)
router.get("/:categoryId", getProductsByCategory)
router.patch(
  "/:id",
  requireAuth,
  requireRole(["ADMIN", "MANAGER"]),
  updateProduct,
)
router.patch("/:id/delete", requireAuth, requireRole("ADMIN"), deleteProduct)
router.patch("/:id/restore", requireAuth, requireRole("ADMIN"), restoreProduct)

export default router
