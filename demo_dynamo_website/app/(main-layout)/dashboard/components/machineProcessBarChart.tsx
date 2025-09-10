"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
    { name: "I-01", number: 186 },
    { name: "I-02", number: 305 },
    { name: "I-03", number: 237 },
    { name: "I-04", number: 73 },
    { name: "I-05", number: 200 },
    { name: "I-05", number: 200 },

]

const chartConfig = {
    name: {
        color: "#074695",
    },
    number: {
        label: "Tổng số",
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
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl text-gray-500">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -60,
                        }}
                    >
                        <XAxis type="number"
                            dataKey="number"
                            // tick={{ fontSize: 15 }}
                            // tickLine={false}
                            // tickMargin={10}
                            // axisLine={true}
                            hide
                        />
                        {/* <CartesianGrid horizontal={false} /> */}
                        <YAxis
                            dataKey="name"
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
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="number" fill="var(--color-name)" radius={5}>
                            <LabelList
                                dataKey="number"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={16}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}
