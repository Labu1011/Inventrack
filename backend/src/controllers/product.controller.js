import {
  createProductSchema,
  productPaginationSchema,
  updateProductSchema,
} from "../dtos/product.dto.js"
import {
  createProductService,
  deleteProductService,
  getProductsByCategoryService,
  getProductsService,
  restoreProductService,
  updateProductService,
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

async function updateProduct(req, res, next) {
  try {
    const id = req.params.id
    const parsed = updateProductSchema.parse(req.body)

    const updated = await updateProductService(id, parsed)

    res
      .status(200)
      .json(
        successResponse({ category: updated }, "Updated product successfully"),
      )
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = req.params.id
    const result = await deleteProductService(id)

    return res
      .status(200)
      .json(
        successResponse(
          { product: result },
          "Product is deleted successfully.",
        ),
      )
  } catch (err) {
    next(err)
  }
}

async function restoreProduct(req, res, next) {
  try {
    const id = req.params.id
    const result = await restoreProductService(id)

    return res
      .status(200)
      .json(
        successResponse(
          { product: result },
          "Product has been restored successfully.",
        ),
      )
  } catch (err) {
    next(err)
  }
}

export {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  restoreProduct,
}
