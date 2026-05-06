import { productRepository } from "../repositories/product.repository.js"
import { stockMovementRepository } from "../repositories/stockMovement.repository.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/apiError.js"

async function ensureActiveProduct(id) {
  const product = await productRepository.findProductById(id)

  if (!product)
    throw new NotFoundError(`Product with this id: ${id} is not found.`)

  if (!product.isActive)
    throw new BadRequestError(
      "This product has been deleted. Please restore it before proceeding.",
    )
  return product
}

async function createProductService(data) {
  try {
    const category = await productRepository.findCategoryById(data.categoryId)

    if (!category || !category.isActive)
      throw new BadRequestError("Category not found or inactive.")

    const product = await productRepository.createProduct(data)

    return product
  } catch (err) {
    console.log()
    if (
      err.code === "P2002" &&
      err?.meta?.driverAdapterError?.cause?.originalMessage?.includes(
        "Product_sku_key",
      )
    ) {
      throw new ConflictError("SKU must be unique.")
    }

    throw err
  }
}

async function getProductsService(page, limit, search, status = "active") {
  const skip = (page - 1) * limit
  const where = {
    name: { contains: search, mode: "insensitive" },
  }

  if (status === "active") {
    where.isActive = true
  } else if (status === "deleted") {
    where.isActive = false
  }

  const [products, totalCount] = await Promise.all([
    productRepository.findManyProducts(where, skip, limit),
    productRepository.countProducts(where),
  ])

  const productIds = products.map((product) => product.id)
  const stockRows = productIds.length
    ? await stockMovementRepository.getStockLevelByProductIds(productIds)
    : []

  const stockMap = new Map()

  for (const row of stockRows) {
    if (!stockMap.has(row.productId)) {
      stockMap.set(row.productId, { IN: 0, OUT: 0, ADJUST: 0 })
    }

    stockMap.get(row.productId)[row.type] = Number(row._sum.quantity || 0)
  }

  const productsWithStock = products.map((product) => {
    const stock = stockMap.get(product.id) || { IN: 0, OUT: 0, ADJUST: 0 }
    const currentStock = stock.IN + stock.ADJUST - stock.OUT

    return { ...product, currentStock }
  })

  const totalPages = Math.ceil(totalCount / limit)

  return {
    products: productsWithStock,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1 && page <= totalPages,
    },
  }
}

async function getProductDetailsService(id) {
  const product = await productRepository.findProductWithCategoryById(id)

  if (!product)
    throw new NotFoundError(`Product with this id: ${id} is not found.`)

  const stockRows = await stockMovementRepository.groupStockLevelByType(id)
  const totals = stockRows.reduce(
    (acc, curr) => {
      acc[curr.type] = curr._sum.quantity || 0
      return acc
    },
    { IN: 0, OUT: 0, ADJUST: 0 },
  )

  const currentStock = totals.IN + totals.ADJUST - totals.OUT

  return { ...product, currentStock }
}

async function getProductsByCategoryService(id, page, limit, search) {
  const category = await productRepository.findCategoryById(id)

  if (!category || !category.isActive)
    throw new BadRequestError("Category not found or inactive.")

  const skip = (page - 1) * limit
  const where = {
    categoryId: id,
    isActive: true,
    name: { contains: search, mode: "insensitive" },
  }

  const [products, totalCount] = await Promise.all([
    productRepository.findManyProducts(where, skip, limit),
    productRepository.countProducts(where),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    products,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

async function updateProductService(id, data) {
  try {
    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No fields provided to update.")
    }

    const product = await ensureActiveProduct(id)

    if (data.categoryId && data.categoryId !== product.categoryId) {
      const categoryExists = await productRepository.findCategoryById(
        data.categoryId,
      )

      if (!categoryExists) throw new NotFoundError("Category does not exist.")
      if (!categoryExists.isActive)
        throw new BadRequestError(
          "Cannot update category because it is inactive.",
        )
    }

    const updated = await productRepository.updateProductById(id, data)

    return updated
  } catch (err) {
    console.log(err.meta)
    if (
      err.code === "P2002" ||
      (err.meta?.driverAdapterError?.cause?.kind ===
        "UniqueConstraintViolation" &&
        err.meta?.driverAdapterError?.cause?.originalMessage.includes("sku"))
    ) {
      throw new ConflictError("SKU must be unique.")
    }

    throw err
  }
}

async function deleteProductService(id) {
  try {
    const res = await productRepository.deactivateProductById(id)

    return res
  } catch (err) {
    if (err.code === "P2025") {
      throw new BadRequestError(
        `Product with this id: ${id} is not found or already deleted.`,
      )
    }

    throw err
  }
}

async function restoreProductService(id) {
  try {
    const res = await productRepository.activateProductById(id)

    return res
  } catch (err) {
    if (err.code === "P2025") {
      throw new BadRequestError(
        `Product with this id: ${id} is not found or already active.`,
      )
    }

    throw err
  }
}

export {
  createProductService,
  getProductDetailsService,
  getProductsService,
  getProductsByCategoryService,
  updateProductService,
  deleteProductService,
  restoreProductService,
  ensureActiveProduct,
}
