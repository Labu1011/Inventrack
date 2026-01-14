import { prisma } from "../lib/prisma-client.js"
import ApiError from "../utils/apiError.js"

async function createCategoryService(data) {
  const categoryExists = await prisma.category.findUnique({
    where: { name: data?.name },
  })

  if (categoryExists) {
    throw new ApiError("This category already exists", 409)
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

export { createCategoryService, getCategoriesService }
