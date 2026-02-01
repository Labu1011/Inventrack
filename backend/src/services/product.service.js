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

async function getProductsService(page, limit, search) {
  const skip = (page - 1) * limit

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        name: { contains: search, mode: "insensitive" },
      },
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        name: { contains: search, mode: "insensitive" },
      },
    }),
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

async function getProductsByCategoryService(id, page, limit, search) {
  const category = await prisma.category.findUnique({
    where: { id: id },
  })

  if (!category || !category.isActive)
    throw new ApiError("Category not found or inactive", 400)

  const skip = (page - 1) * limit

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: id,
        isActive: true,
        name: { contains: search, mode: "insensitive" },
      },
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({
      where: {
        categoryId: id,
        isActive: true,
        name: { contains: search, mode: "insensitive" },
      },
    }),
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

async function updateProductService(id, data) {}

export {
  createProductService,
  getProductsService,
  getProductsByCategoryService,
  updateProductService,
}
