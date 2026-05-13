"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CheckIcon,
  CirclePlusIcon,
  FolderTreeIcon,
  PanelLeftIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
} from "lucide-react"
import React from "react"

export function FeaturesSection() {
  const features = [
    {
      title: "Product catalog",
      description: "Create and manage products with pricing and units.",
      Icon: CirclePlusIcon,
    },
    {
      title: "Category management",
      description: "Group products by category for faster browsing.",
      Icon: FolderTreeIcon,
    },
    {
      title: "Stock movements",
      description: "Record stock in and stock out to keep counts accurate.",
      Icon: TrendingUpIcon,
    },
    {
      title: "Orders and checkout",
      description: "Create orders and review order history in one place.",
      Icon: ShoppingCartIcon,
    },
    {
      title: "Role-based access",
      description: "Admin and Manager roles control staff capabilities.",
      Icon: CheckIcon,
    },
    {
      title: "Dashboard overview",
      description: "See inventory and order activity at a glance.",
      Icon: PanelLeftIcon,
    },
  ]

  return (
    <section id="features" className="bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold">Features</h2>
          <p className="text-muted-foreground">
            Everything you need to manage inventory, stock, and orders in one
            place.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, Icon }) => (
            <Card key={title} className="shadow-sm">
              <CardHeader className="gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-5 w-5" />
                  <CardTitle>{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
