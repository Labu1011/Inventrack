import { useQuery } from "@tanstack/react-query"
import {
  getStockHistory,
  type StockMovementType,
} from "@/lib/api/stockMovements.api"

export function useStockMovements({
  page,
  limit,
  type,
  startDate,
  endDate,
}: {
  page: number
  limit: number
  type?: StockMovementType
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ["stock-history", { page, limit, type, startDate, endDate }],
    queryFn: () => getStockHistory({ page, limit, type, startDate, endDate }),
  })
}
