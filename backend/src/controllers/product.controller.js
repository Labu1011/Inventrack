import { createProductSchema } from "../dtos/product.dto.js"
import {
  createProductService,
  getProductsService,
} from "../services/product.service.js"
import { formatZodError } from "../utils/formatZodError.js"

async function createProduct(req, res) {
  try {
    const parsed = createProductSchema.parse(req.body)

    const product = await createProductService(parsed)

    res
      .status(201)
      .json({ message: "Product created successfully", data: product })
  } catch (err) {
    const zodError = formatZodError(err)

    if (zodError) {
      return res.status(400).json(zodError)
    }

    return res
      .status(err.status || 400)
      .json({ message: err.message || "Failed to create the category" })
  }
}

async function getProducts(req, res) {
  try {
    const products = await getProductsService()

    res.status(200).json({ products })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    })
  }
}

export { createProduct, getProducts }
