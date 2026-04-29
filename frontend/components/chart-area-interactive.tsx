"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSalesTrend } from "@/hooks/dashboard/useSalesTrend"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [groupBy, setGroupBy] = React.useState<"day" | "month">("day")

  const dayTrend = useSalesTrend("day")
  const monthTrend = useSalesTrend("month")

  const activeTrend = groupBy === "day" ? dayTrend.data : monthTrend.data

  console.log(activeTrend)
  const chartData = activeTrend?.data?.map((item: any) => ({
    period: item.period,
    grossSales: Number(item.totalAmount),
    orders: Number(item.orderCount),
  }))

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {groupBy === "day"
              ? "Daily sales for the last 30 days"
              : "Monthly sales for the last 6 months"}
          </span>
          <span className="@[540px]/card:hidden">
            {groupBy === "day" ? "Last 30 days" : "Last 6 months"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={groupBy}
            onValueChange={(value) => {
              if (value === "day" || value === "month") {
                setGroupBy(value)
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="month">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="day">Last 30 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={groupBy}
            onValueChange={(value) => {
              if (value === "day" || value === "month") {
                setGroupBy(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="month" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="day" className="rounded-lg">
                Last 30 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} />

            <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
            <YAxis
              yAxisId="right"
              orientation="right"
              allowDecimals={false}
              tickFormatter={(value) => Math.round(value).toString()}
            />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              yAxisId="left"
              dataKey="grossSales"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
            />
            <Area
              yAxisId="right"
              dataKey="orders"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
