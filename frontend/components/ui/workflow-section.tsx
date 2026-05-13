"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"

export function WorkflowSection() {
  const steps = [
    {
      title: "Set up your catalog",
      description: "Add products, set units, and assign categories.",
    },
    {
      title: "Track stock changes",
      description: "Record stock movements whenever items move in or out.",
    },
    {
      title: "Process orders",
      description: "Create orders and review order history from the dashboard.",
    },
  ]

  return (
    <section id="workflow" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold">How it works</h2>
          <p className="text-muted-foreground">
            A simple flow designed for daily operations.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="shadow-sm">
              <CardHeader className="gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <CardTitle>{step.title}</CardTitle>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
