"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { toast } from "sonner"

type CartProduct = {
  id: string
  name: string
  sku: string
  unit: string
  sellingPrice: string
  currentStock?: number
}

type CartItem = {
  product: CartProduct
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (product: CartProduct) => void
  updateQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: CartProduct) => {
    if ((product.currentStock ?? 0) <= 0) {
      toast.error("This product is out of stock")
      return
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (!existing) {
        return [...prev, { product, quantity: 1 }]
      }

      const nextQty = existing.quantity + 1
      const maxQty = product.currentStock ?? nextQty
      if (nextQty > maxQty) {
        toast.error("Not enough stock available")
        return prev
      }

      return prev.map((item) =>
        item.product.id === product.id ? { ...item, quantity: nextQty } : item,
      )
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item
          const maxQty = item.product.currentStock ?? item.quantity
          const nextQty = Math.min(Math.max(item.quantity + delta, 1), maxQty)
          return { ...item, quantity: nextQty }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => {
    setItems([])
  }

  const { itemCount, subtotal } = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce(
      (sum, item) => sum + Number(item.product.sellingPrice) * item.quantity,
      0,
    )
    return { itemCount: count, subtotal: total }
  }, [items])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, itemCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
