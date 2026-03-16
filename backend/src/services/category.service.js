import { prisma } from "../lib/prisma-client.js"
import { ApiError, ConflictError, NotFoundError } from "../utils/apiError.js"

async function createCategoryService(data) {
  const categoryExists = await prisma.category.findUnique({
    where: { name: data?.name },
  })

  if (categoryExists) {
    throw new ConflictError("This category already exists")
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
    },
  })

  return category
}

async function getCategoriesService() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { products: true },
      },
    },
  })

  return categories
}

async function getCategoryService(id) {
  const category = await prisma.category.findFirst({
    where: { id: id },
  })

  if (!category)
    throw new NotFoundError(`Category with this id: ${id} is not found`)

  return category
}

async function updateCategoryService(id, data) {
  try {
    const updated = await prisma.category.update({
      where: { id: id },
      data: {
        name: data.name,
      },
    })

    return updated
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found`)
    }

    throw err
  }
}

async function deactivateCategoryService(id) {
  try {
    await prisma.category.update({
      where: { id: id },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found`)
    }

    throw err
  }
}

async function activateCategoryService(id) {
  try {
    await prisma.category.update({
      where: { id: id },
      data: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found`)
    }

    throw err
  }
}

export {
  createCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deactivateCategoryService,
  activateCategoryService,
}
