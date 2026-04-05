import express from "express"
import authRoutes from "./auth.route.js"
import productRoutes from "./product.route.js"
import categoryRoutes from "./category.route.js"
import stockMovementRoutes from "./stockMovement.route.js"
import orderRoutes from "./order.route.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/products", productRoutes)
router.use("/categories", categoryRoutes)
router.use("/stock", stockMovementRoutes)
router.use("/orders", orderRoutes)

export default router
