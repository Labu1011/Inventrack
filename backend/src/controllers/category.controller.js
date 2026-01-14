import { categorySchema } from "../dtos/category.dto.js"
import {
  createCategoryService,
  getCategoriesService,
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

export { createCategory, getCategories }
