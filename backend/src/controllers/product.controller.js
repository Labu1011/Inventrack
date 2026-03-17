import {
  createProductSchema,
  productPaginationSchema,
} from "../dtos/product.dto.js"
import {
  createProductService,
  getProductsByCategoryService,
  getProductsService,
} from "../services/product.service.js"
import { successResponse } from "../utils/successResponse.js"

async function createProduct(req, res, next) {
  try {
    const parsed = createProductSchema.parse(req.body)

    const product = await createProductService(parsed)

    res
      .status(201)
      .json(successResponse({ product }, "Product created successfully"))
  } catch (err) {
    next(err)
  }
}

async function getProducts(req, res, next) {
  try {
    const { page, limit, search } = productPaginationSchema.parse(req.query)
    const products = await getProductsService(page, limit, search)

    res.status(200).json(successResponse(products))
  } catch (err) {
    next(err)
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const { page, limit, search } = productPaginationSchema.parse(req.query)
    const categoryId = req.params.categoryId

    const products = await getProductsByCategoryService(
      categoryId,
      page,
      limit,
      search,
    )

    res.status(200).json(successResponse(products))
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res) {}

async function deactivateProduct(req, res) {
  try {
    const id = req.params?.id
    await deactivateProduct()
  } catch (err) {}
}

export {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deactivateProduct,
}
