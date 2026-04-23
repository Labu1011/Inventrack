import { dashboardRepository } from "../repositories/dashboard.repository.js"
import { productRepository } from "../repositories/product.repository.js"

async function getDashboardSummaryService() {
  const [orderCount, ordersByStatus, ordersByAmount, lowStockCount] =
    await Promise.all([
      dashboardRepository.getOrderCount(),
      dashboardRepository.getCountOfOrdersByStatus(),
      dashboardRepository.getOrderAmountsByStatus(),
      getLowStockProductsCount(),
    ])

  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  }

  for (const row of ordersByStatus) {
    statusCounts[row.status] = Number(row._count._all || 0)
  }

  let grossSale = 0
  let cancelledValue = 0
  let realizedRevenue = 0

  ordersByAmount.forEach((data) => {
    grossSale += Number(data._sum.totalAmount)
    if (data.status === "CANCELLED")
      cancelledValue += Number(data._sum.totalAmount)
    if (data.status === "DELIVERED")
      realizedRevenue += Number(data._sum.totalAmount)
  })

  return {
    orderCount,
    pendingOrders: statusCounts.PENDING,
    confirmedOrders: statusCounts.CONFIRMED,
    shippedOrders: statusCounts.SHIPPED,
    deliveredOrders: statusCounts.DELIVERED,
    cancelledOrders: statusCounts.CANCELLED,
    grossSale,
    cancelledValue,
    netSale: grossSale - cancelledValue,
    realizedRevenue,
    lowStockCount,
  }
}

async function getLowStockProductsCount() {
  const [products, stockRows] = await Promise.all([
    await productRepository.findAllActiveProductsForDashboard(),
    await dashboardRepository.getStockLevelsByProduct(),
  ])

  const stockMap = new Map()

  for (const row of stockRows) {
    if (!stockMap.has(row.productId)) {
      stockMap.set(row.productId, { IN: 0, OUT: 0, ADJUST: 0 })
    }

    stockMap.get(row.productId)[row.type] = Number(row._sum.quantity || 0)
  }

  let count = 0

  for (const product of products) {
    const stock = stockMap.get(product.id) || { IN: 0, OUT: 0, ADJUST: 0 }
    const currentStock = stock.IN + stock.ADJUST - stock.OUT

    if (currentStock <= product.reorderLevel) count += 1
  }

  return count
}

function getPeriodKey(date, groupBy) {
  const d = new Date(date)

  if (groupBy === "month") {
    return `${d.getFullYear()}-${d.getMonth() + 1}`
  }

  if (groupBy === "day") {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }
}

async function getSalesTrendService(groupBy) {
  const where = {}

  let currentDate = new Date()
  let startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  if (groupBy === "month") {
    startDate.setDate(1)
    startDate.setMonth(startDate.getMonth() - 5)

    where.createdAt = {
      gte: startDate,
      lte: currentDate,
    }
  }

  if (groupBy === "day") {
    startDate.setDate(startDate.getDate() - 29)

    where.createdAt = {
      gte: startDate,
      lte: currentDate,
    }
  }

  const orders = await dashboardRepository.getOrdersForSalesTrend(where)

  const trendMap = new Map()

  for (const order of orders) {
    const key = getPeriodKey(order.createdAt, groupBy)

    if (!trendMap.has(key)) {
      trendMap.set(key, { period: key, orderCount: 0, totalAmount: 0 })
    }

    const item = trendMap.get(key)
    item.orderCount += 1
    item.totalAmount += Number(order.totalAmount)
  }

  return Array.from(trendMap.values())
}

export { getDashboardSummaryService, getSalesTrendService }
