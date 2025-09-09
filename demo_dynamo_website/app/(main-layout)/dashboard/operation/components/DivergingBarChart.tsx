"use client"

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    target: {
        label: "Mục tiêu",
        color: "#92c7ff",
    },
    real: {
        label: "Thực tế",
        color: "#3483ff",
    },
} satisfies ChartConfig

interface DivergingBarChartProps {
    title: string
    description: string
    data: { name: string; target: number; real: number }[]
}

export function DivergingBarChart({
    title,
    description,
    data,
}: DivergingBarChartProps) {
    // 👉 Tính trung bình
    const avgtarget =
        data.reduce((sum, d) => sum + d.target, 0) / data.length
    const avgReal =
        data.reduce((sum, d) => sum + d.real, 0) / data.length

    // 👉 Thêm record "Trung bình" vào đầu
    const chartData = [
        { name: "Trung bình", target: avgtarget, real: avgReal },
        ...data,
    ]

    return (
        <Card>
            <CardHeader>
                <div className="items-center">
                    <p className="text-2xl font-bold">{title}</p>
                    <p className="text-xl text-gray-500">{description}</p>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} layout="vertical">
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            fontSize={20}
                        />
                        <XAxis type="number" tickLine={false} axisLine={false} />

                        {/* Thanh target */}
                        <Bar
                            dataKey="target"
                            stackId="a"
                            fill={chartConfig.target.color}
                            radius={[0, 0, 0, 0]}
                        >
                            <LabelList
                                dataKey="target"
                                position="insideRight"
                                fill="#fff"
                                fontSize={16}
                            />
                        </Bar>

                        {/* Thanh real (so sánh màu) */}
                        <Bar dataKey="real" stackId="a" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        index === 0
                                            ? chartConfig.real.color // luôn xanh cho "Trung bình"
                                            : entry.real < entry.target
                                                ? "#ff4d4d"
                                                : chartConfig.real.color
                                    }
                                />
                            ))}
                            <LabelList
                                dataKey="real"
                                position="insideRight"
                                fill="#fff"
                                fontSize={16}
                            />
                        </Bar>
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    className="w-[180px]"
                                    formatter={(value, name) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                style={{
                                                    background: `var(--color-${name})`,
                                                }}
                                            />
                                            {chartConfig[name as keyof typeof chartConfig]?.label ||
                                                name}
                                            <div className="ml-auto font-mono font-medium">
                                                {value}
                                            </div>
                                        </>
                                    )}
                                />
                            }
                            cursor={false}
                            defaultIndex={0}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
