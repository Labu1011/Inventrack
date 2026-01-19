import { prisma } from "../lib/prisma-client.js"
import ApiError from "../utils/apiError.js"

async function createProductService(data) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })

    if (!category || !category.isActive)
      throw new ApiError("Category not found or inactive", 400)

    const product = await prisma.product.create({
      data,
    })

    return product
  } catch (err) {
    console.log()
    if (
      err.code === "P2002" &&
      err?.meta?.driverAdapterError?.cause?.originalMessage?.includes(
        "Product_sku_key",
      )
    ) {
      throw new ApiError("SKU must be unique", 409)
    }

    throw err
  }
}

async function getProductsService() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  })

  return products
}

async function getProductsByCategoryService(id) {
  const category = await prisma.category.findUnique({
    where: { id: id },
  })

  if (!category || !category.isActive)
    throw new ApiError("Category not found or inactive", 400)

  const products = await prisma.product.findMany({
    where: { categoryId: id, isActive: true },
  })

  return products
}

async function updateProductService(id, data) {}

export {
  createProductService,
  getProductsService,
  getProductsByCategoryService,
  updateProductService,
}
