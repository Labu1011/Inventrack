"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export function CTASection() {
  return (
    <section id="get-started" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold">Get started today</h2>
          <p className="mb-6 text-muted-foreground">
            Create an account or browse products to see how Inventrack works.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Create account</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                Browse products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
