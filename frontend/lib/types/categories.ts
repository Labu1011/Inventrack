export type CategoryWithCount = {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  _count: {
    products: number
  }
}
