"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 79, mobile: 140 },
    { month: "March", desktop: 203, mobile: 120 },
    { month: "June", desktop: 64, mobile: 140 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "June", desktop: 30, mobile: 90 },
    { month: "July", desktop: 214, mobile: 190 },
    { month: "December", desktop: 24, mobile: 180 },
    { month: "December", desktop: 59, mobile: 118 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#074695",
    },
    mobile: {
        label: "Mobile",
        color: "#0077FF",
    },
} satisfies ChartConfig

export function SumRealTime({ title, description }: { title: string; description: string }) {
    return (
        <Card>
            <CardHeader>
                {/* <CardTitle>Tổng Thời Gian Thực</CardTitle>
                <CardDescription>PG Dự Kiến Của Từng Máy Trong Nhóm</CardDescription> */}
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fontSize: 0 }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
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
