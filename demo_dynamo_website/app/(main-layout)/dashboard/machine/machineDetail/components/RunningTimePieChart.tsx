"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MachineStatisticDetail } from "../lib/type"

// const machineTimeData = [
//   { category: "running", hours: 40, fill: "var(--color-running)" },
//   { category: "stopped", hours: 120, fill: "var(--color-stopped)" },
//   { category: "error", hours: 80, fill: "var(--color-error)" },
//   { category: "pg", hours: 60, fill: "var(--color-pg)" },
// ]

const chartConfig = {
  hours: {
    label: "Giờ",
    color: "#1F3EB4",
  },
  running: {
    label: "Tổng số giờ chạy",
    color: "#1D4AE1",
  },
  stopped: {
    label: "Tổng số giờ dừng",
    color: "#F59E0B",
  },
  error: {
    label: "Tổng giờ lỗi",
    color: "#E11D48",
  },
  pg: {
    label: "Tổng giờ PG",
    color: "#3b82f6",
  },
  process: {
    label: "Tổng gia công",
    color: "#023e8a",
  },
} satisfies ChartConfig

const mapData = (raw: MachineStatisticDetail) => [
  { category: "running", hours: Math.round(raw.totalRunTime), fill: "#1D4AE1" },
  { category: "stopped", hours: Math.round(raw.totalStopTime), fill: "#F59E0B" },
  { category: "error", hours: Math.round(raw.totalErrorTime), fill: "#E11D48" },
  { category: "pg", hours: Math.round(raw.totalPgTime), fill: "#3b82f6" },
  { category: "process", hours: Math.round(raw.numberOfProcesses), fill: "#023e8a" },
];

export function RunningTimePieChart({
  title,
  description,
  dataRunTime,
}: {
  title: string;
  description: string;
  dataRunTime: MachineStatisticDetail
}) {
  const id = "running-time-pie"
  const machineTimeData = mapData(dataRunTime);

  const [activeCategory, setActiveCategory] = React.useState(machineTimeData[0].category)

  const activeIndex = React.useMemo(
    () => machineTimeData.findIndex((item) => item.category === activeCategory),
    [activeCategory]
  )
  const categories = React.useMemo(() => machineTimeData.map((item) => item.category), [])

  // Calculate total hours
  const totalHours = React.useMemo(
    () => machineTimeData.reduce((sum, item) => sum + item.hours, 0),
    []
  )

  return (
    <Card data-chart={id} className="flex flex-col h-full border border-green-200 shadow-md shadow-green-200 rounded-lg">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="font-bold text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className="ml-auto h-7 w-[200px] rounded-lg pl-2.5"
            aria-label="Chọn loại thời gian"
          >
            <SelectValue placeholder="Chọn loại thời gian" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categories.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={machineTimeData}
              dataKey="hours"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeData = machineTimeData[activeIndex]
                    const percentage = ((activeData.hours / totalHours) * 100).toFixed(1)

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeData.hours.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Giờ ({percentage}%)
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
