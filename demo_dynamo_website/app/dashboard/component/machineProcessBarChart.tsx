"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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

export const description = "A horizontal bar chart"

const chartData = [
    { month: "Thứ 2", desktop: 186 },
    { month: "Thứ 3", desktop: 305 },
    { month: "Thú 4", desktop: 237 },
    { month: "Thứ 5", desktop: 73 },
    { month: "Thứ 6", desktop: 200 },
    { month: "Thứ 7", desktop: 214 },
    { month: "Chủ nhật", desktop: 156 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#074695",
    },
} satisfies ChartConfig

export function MachineProcessBarChart({ title, description }: { title: string; description: string }) {
    return (
        <Card className="!w-full">
            <CardHeader>
                {/* <CardTitle>Bar Chart - Horizontal</CardTitle>
                <CardDescription>January - June 2024</CardDescription> */}
                {/* <p className="text-xl font-bold">Tổng số process từng máy trong nhóm đã chạy xong</p>
                <p className="text-sm text-gray-500 mb-4">Tổng thời gian hoạt động của nhóm này</p> */}
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                    >
                        <XAxis type="number" dataKey="desktop" hide />
                        <YAxis
                            dataKey="month"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            width={110}
                            tick={{ fontSize: 18 }}

                        // tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
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
