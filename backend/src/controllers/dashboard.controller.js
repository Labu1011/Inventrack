import { getDashboardSummaryService } from "../services/dashboard.service.js"
import { successResponse } from "../utils/successResponse.js"

async function getDashboardSummary(req, res, next) {
  try {
    const result = await getDashboardSummaryService()

    return res.status(200).json(successResponse(result))
  } catch (err) {
    next(err)
  }
}

async function getSalesTrend(req, res, next) {}
async function getInventoryAlerts(req, res, next) {}
async function getTopProducts(req, res, next) {}

export {
  getDashboardSummary,
  getSalesTrend,
  getInventoryAlerts,
  getTopProducts,
}
