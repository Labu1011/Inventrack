"use client"

import React from "react"

export function FAQSection() {
  const faqs = [
    {
      question: "Where do I add products and categories?",
      answer:
        "Use the Products and Categories pages in the dashboard to create and organize items.",
    },
    {
      question: "How do I update stock levels?",
      answer:
        "Record stock changes in the Stock Movements section. Each movement updates product stock.",
    },
    {
      question: "Who can manage staff roles?",
      answer:
        "Admins can create staff accounts and update roles from the dashboard.",
    },
    {
      question: "Where can I view orders?",
      answer:
        "Orders are available in the Orders section, and customers can see their order history.",
    },
  ]

  return (
    <section id="faq" className="bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-bold">FAQ</h2>
          <p className="text-muted-foreground">
            Quick answers to common tasks.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="rounded-lg border border-border/70 bg-card p-4"
            >
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
