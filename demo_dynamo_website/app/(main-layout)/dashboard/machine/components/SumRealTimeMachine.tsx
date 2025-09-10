"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
    { name: "I-01", real: 186, desirable: 80 },
    { name: "I-02", real: 205, desirable: 200 },
    { name: "I-03", real: 209, desirable: 130 },
    { name: "I-04", real: 214, desirable: 140 },
    { name: "I-05", real: 79, desirable: 140 },
    { name: "I-06", real: 203, desirable: 120 },
    { name: "I-07", real: 64, desirable: 140 },
    { name: "I-08", real: 73, desirable: 190 },
    { name: "I-09", real: 30, desirable: 90 },
    { name: "I-10", real: 214, desirable: 190 },
    { name: "I-11", real: 24, desirable: 180 },
    { name: "I-12", real: 59, desirable: 118 },
]

const chartConfig = {
    real: {
        label: "Thực tế",
        color: "#0077FF",
    },
    desirable: {
        label: "Dự kiến",
        color: "#074695",
    },
} satisfies ChartConfig
const legendItems = [
    { name: "Dự kiến", value: 0.6, fill: "#074695" },
    { name: "Thực tế", value: 0.5, fill: "#0077FF" },
    { name: "Mục tiêu", value: 0.5, fill: "red" },
]
export function SumRealTimeMachine({ title, description }: { title: string; description: string }) {
    return (
        <Card>
            <CardHeader>
                {/* <CardTitle>Tổng Thời Gian Thực</CardTitle>
                <CardDescription>PG Dự Kiến Của Từng Máy Trong Nhóm</CardDescription> */}
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart accessibilityLayer data={chartData}
                        margin={{
                            left: -30,
                        }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tick={{ fontSize: 18 }}
                        />
                        <YAxis tickLine={false} tick={{ fontSize: 0 }} />
                        {/* <ChartLegend className="text-lg" content={<ChartLegendContent />} /> */}
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="real" fill="var(--color-real)" radius={4}>
                            <LabelList
                                dataKey="real"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                        <Bar dataKey="desirable" fill="var(--color-desirable)" radius={4} >
                            <LabelList
                                dataKey="desirable"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                        <ReferenceLine
                            y={100}   // 👈 truyền số vào đây
                            stroke="red"           // màu đường
                            label={{
                                value: `${100}`,
                                position: "left",
                                fontSize: 15,
                                fill: "red",
                                offset: 5,
                            }}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="mx-6 flex items-center justify-center gap-6 bg-white p-3 ml-20">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm text-gray-800 font-medium">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
