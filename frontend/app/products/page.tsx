"use client"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/auth/useLogout"

export default function page() {
  const { mutate } = useLogout()

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-center text-5xl">Browse products</h1>
      <Button variant="outline" onClick={() => mutate()}>
        Logout
      </Button>
    </div>
  )
}
