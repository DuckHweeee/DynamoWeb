"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
    { name: "I-01", real: 186, target: 80 },
    { name: "I-02", real: 305, target: 200 },
    { name: "I-03", real: 209, target: 130 },
    { name: "I-04", real: 214, target: 140 },
    { name: "I-05", real: 79, target: 140 },
    { name: "I-06", real: 203, target: 120 },
    { name: "I-07", real: 64, target: 140 },
    { name: "I-08", real: 73, target: 190 },
    { name: "I-09", real: 30, target: 90 },
    { name: "I-10", real: 214, target: 190 },
    { name: "I-11", real: 24, target: 180 },
    { name: "I-12", real: 59, target: 118 },
]

const chartConfig = {
    real: {
        label: "Thực tế",
        color: "#074695",
    },
    target: {
        label: "Mục tiêu",
        color: "#0077FF",
    },
} satisfies ChartConfig

export function SumRealTime({ title, description }: { title: string; description: string }) {
    return (
        <Card>
            <CardHeader>
                {/* <CardTitle>Tổng Thời Gian Thực</CardTitle>
                <CardDescription>PG Dự Kiến Của Từng Máy Trong Nhóm</CardDescription> */}
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fontSize: 18 }}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="real" fill="var(--color-real)" radius={4} />
                        <Bar dataKey="target" fill="var(--color-target)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter> */}
        </Card>
    )
}
