"use client"

import { LandingNavbar } from "@/components/landing-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"
import { usePlaceOrder } from "@/hooks/orders/usePlaceOrder"
import { useMe } from "@/hooks/auth/useMe"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/formatters"

export default function Page() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const placeOrderMutation = usePlaceOrder()
  const { data } = useMe()
  const router = useRouter()

  const handlePlaceOrder = () => {
    if (!data?.data?.user) {
      toast.error("Please sign in to place an order")
      router.push("/login?next=/checkout")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    const payload = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }))

    placeOrderMutation.mutate(payload, {
      onSuccess: () => {
        clearCart()
        router.replace("/my-orders")
      },
    })
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your cart is empty. Add products before checking out.
                  </p>
                  <Link href="/products">
                    <Button variant="outline">Browse products</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            SKU: {item.product.sku}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Unit: {formatCurrency(item.product.sellingPrice)}
                        </div>
                        <div className="text-sm font-semibold">
                          {formatCurrency(
                            String(
                              Number(item.product.sellingPrice) * item.quantity,
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-muted/40 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{itemCount}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(String(subtotal))}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending
                      ? "Placing order..."
                      : "Place order"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
