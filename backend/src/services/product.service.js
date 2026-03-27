import { prisma } from "../lib/prisma-client.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/apiError.js"

async function createProductService(data) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })

    if (!category || !category.isActive)
      throw new BadRequestError("Category not found or inactive.")

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
      throw new ConflictError("SKU must be unique.")
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
    throw new BadRequestError("Category not found or inactive.")

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

async function updateProductService(id, data) {
  try {
    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No fields provided to update.")
    }

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product)
      throw new NotFoundError(`Product with this id: ${id} is not found.`)

    if (!product.isActive)
      throw new BadRequestError(
        "This product has been deleted. Please restore it before making updates.",
      )

    if (data.categoryId && data.categoryId !== product.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      })

      if (!categoryExists) throw new NotFoundError("Category does not exist.")
      if (!categoryExists.isActive)
        throw new BadRequestError(
          "Cannot update category because it is inactive.",
        )
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    })

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
    const res = await prisma.product.update({
      where: { id, isActive: true },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })

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
    const res = await prisma.product.update({
      where: { id, isActive: false },
      data: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })

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
  getProductsService,
  getProductsByCategoryService,
  updateProductService,
  deleteProductService,
  restoreProductService,
}
