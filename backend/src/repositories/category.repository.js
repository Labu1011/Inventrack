import { prisma } from "../lib/prisma-client.js"

async function findCategoryByName(name) {
  return prisma.category.findUnique({
    where: { name },
  })
}

async function createCategory(data) {
  return prisma.category.create({
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
}

async function findActiveCategories() {
  return prisma.category.findMany({
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
}

async function findAllCategories() {
  return prisma.category.findMany({
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
}

async function findCategoryById(id) {
  return prisma.category.findFirst({
    where: { id },
  })
}

async function updateCategoryById(id, data) {
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
    },
  })
}

async function deactivateCategoryById(id) {
  return prisma.category.update({
    where: { id },
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

async function activateCategoryById(id) {
  return prisma.category.update({
    where: { id },
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

export const categoryRepository = {
  findCategoryByName,
  createCategory,
  findActiveCategories,
  findAllCategories,
  findCategoryById,
  updateCategoryById,
  deactivateCategoryById,
  activateCategoryById,
}
