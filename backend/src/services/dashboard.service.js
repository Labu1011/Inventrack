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

  let pendingOrders = 0
  let confirmedOrders = 0
  let shippedOrders = 0
  let deliveredOrders = 0
  let cancelledOrders = 0

  ordersByStatus.forEach((data) => {
    if (data.status === "PENDING") pendingOrders += data._count._all
    if (data.status === "CONFIRMED") confirmedOrders += data._count._all
    if (data.status === "SHIPPED") shippedOrders += data._count._all
    if (data.status === "DELIVERED") deliveredOrders += data._count._all
    if (data.status === "CANCELLED") cancelledOrders += data._count._all
  })

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
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    grossSale,
    cancelledValue,
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

export { getDashboardSummaryService }
