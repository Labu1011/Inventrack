import { categorySchema } from "../dtos/category.dto"

async function createCategory(req, res) {
  const parsed = categorySchema.parse(req.body)
}

export { createCategory }
