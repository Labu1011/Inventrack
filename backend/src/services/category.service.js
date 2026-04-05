import { categoryRepository } from "../repositories/category.repository.js"
import { ConflictError, NotFoundError } from "../utils/apiError.js"

async function createCategoryService(data) {
  const categoryExists = await categoryRepository.findCategoryByName(data?.name)

  if (categoryExists) {
    throw new ConflictError("This category already exists.")
  }

  const category = await categoryRepository.createCategory(data)

  return category
}

async function getCategoriesService() {
  const categories = await categoryRepository.findActiveCategories()

  return categories
}

async function getCategoryService(id) {
  const category = await categoryRepository.findCategoryById(id)

  if (!category)
    throw new NotFoundError(`Category with this id: ${id} is not found.`)

  return category
}

async function updateCategoryService(id, data) {
  try {
    const updated = await categoryRepository.updateCategoryById(id, data)

    return updated
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found.`)
    }

    throw err
  }
}

async function deactivateCategoryService(id) {
  try {
    const res = await categoryRepository.deactivateCategoryById(id)

    return res
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found.`)
    }

    throw err
  }
}

async function activateCategoryService(id) {
  try {
    const res = await categoryRepository.activateCategoryById(id)

    return res
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError(`Category with this id: ${id} is not found.`)
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
