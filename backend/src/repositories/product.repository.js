import { prisma } from "../lib/prisma-client.js"

async function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
  })
}

async function findActiveProductById(id, tx = prisma) {
  return tx.product.findFirst({
    where: {
      id,
      isActive: true,
    },
  })
}

async function findCategoryById(id) {
  return prisma.category.findUnique({
    where: { id },
  })
}

async function createProduct(data) {
  return prisma.product.create({
    data,
  })
}

async function findManyProducts(where, skip, take) {
  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  })
}

async function countProducts(where) {
  return prisma.product.count({
    where,
  })
}

async function updateProductById(id, data) {
  return prisma.product.update({
    where: { id },
    data,
  })
}

async function deactivateProductById(id) {
  return prisma.product.update({
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
}

async function activateProductById(id) {
  return prisma.product.update({
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
}

export const productRepository = {
  findProductById,
  findActiveProductById,
  findCategoryById,
  createProduct,
  findManyProducts,
  countProducts,
  updateProductById,
  deactivateProductById,
  activateProductById,
}
