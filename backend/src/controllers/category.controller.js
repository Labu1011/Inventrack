import { categorySchema } from "../dtos/category.dto.js"
import {
  activateCategoryService,
  createCategoryService,
  deactivateCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
} from "../services/category.service.js"

async function createCategory(req, res, next) {
  try {
    const parsed = categorySchema.parse(req.body)

    const category = await createCategoryService(parsed)

    res.status(201).json({
      message: "Category is created successfully",
      category,
    })
  } catch (err) {
    next(err)
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await getCategoriesService()

    res.status(200).json({
      categories,
    })
  } catch (err) {
    next(err)
  }
}

async function getCategory(req, res, next) {
  try {
    const id = req.params.id
    const category = await getCategoryService(id)

    res.status(200).json({ category })
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const id = req.params.id
    const parsed = categorySchema.parse(req.body)

    const updated = await updateCategoryService(id, parsed)

    res
      .status(200)
      .json({ message: "Updated category successfully", category: updated })
  } catch (err) {
    next(err)
  }
}

async function deactivateCategory(req, res, next) {
  try {
    const id = req.params.id
    await deactivateCategoryService(id)

    res.status(200).json({ message: "Category is deactivated successfully" })
  } catch (err) {
    next(err)
  }
}

async function activateCategory(req, res, next) {
  try {
    const id = req.params.id

    await activateCategoryService(id)

    res.status(200).json({ message: "Category is activated successfully" })
  } catch (err) {
    next(err)
  }
}

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deactivateCategory,
  activateCategory,
}
