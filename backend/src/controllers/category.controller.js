import { categorySchema } from "../dtos/category.dto.js"
import {
  createCategoryService,
  disableCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
} from "../services/category.service.js"
import { formatZodError } from "../utils/formatZodError.js"

async function createCategory(req, res) {
  try {
    const parsed = categorySchema.parse(req.body)

    const category = await createCategoryService(parsed)

    res.status(201).json({
      message: "Category is created successfully",
      category,
    })
  } catch (err) {
    const zodError = formatZodError(err)

    if (zodError) {
      return res.status(400).json(zodError)
    }

    return res
      .status(err.status || 400)
      .json({ message: err.message || "Failed to create the category" })
  }
}

async function getCategories(req, res) {
  try {
    const categories = await getCategoriesService()

    res.status(200).json({
      categories,
    })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    })
  }
}

async function getCategory(req, res) {
  try {
    const id = req.params.id
    const category = await getCategoryService(id)

    res.status(200).json({ category })
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" })
  }
}

async function updateCategory(req, res) {
  try {
    const id = req.params.id
    const parsed = categorySchema.parse(req.body)

    const updated = await updateCategoryService(id, parsed)

    res
      .status(200)
      .json({ message: "Updated category successfully", category: updated })
  } catch (err) {
    const zodError = formatZodError(err)

    if (zodError) {
      return res.status(400).json(zodError)
    }

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    })
  }
}

async function disableCategory(req, res) {
  try {
    const id = req.params.id
    await disableCategoryService(id)

    res.status(200).json({ message: "Category is disabled successfully" })
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    })
  }
}

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  disableCategory,
}
