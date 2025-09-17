"use client"

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    target: {
        label: "Mục tiêu",
        color: "#00a6fb",
    },
    real: {
        label: "Thực tế",
        color: "#0587ca",
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
    // 👉 Tính trung bình an toàn
    const avgtarget = data.length
        ? data.reduce((s, d) => s + d.target, 0) / data.length
        : 0
    const avgReal = data.length
        ? data.reduce((s, d) => s + d.real, 0) / data.length
        : 0

    // 👉 Thêm record "Trung bình"
    const chartData = [{ name: "TB", target: avgtarget, real: avgReal }, ...data]

    // 👉 Legend
    const legendItems = [
        { name: chartConfig.target.label, fill: chartConfig.target.color },
        { name: chartConfig.real.label, fill: chartConfig.real.color },
        { name: "Thấp hơn mục tiêu", fill: "#ff4d4d" },
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
                <ChartContainer config={chartConfig} className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                fontSize={16}
                            />
                            <XAxis type="number" hide />

                            {/* Thanh target */}
                            <Bar dataKey="target" stackId="a" fill={chartConfig.target.color}>
                                <LabelList
                                    dataKey="target"
                                    position="insideRight"
                                    fill="#fff"
                                    fontSize={14}
                                />
                            </Bar>

                            {/* Thanh real */}
                            <Bar dataKey="real" stackId="a" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            index === 0
                                                ? chartConfig.real.color // luôn xanh cho TB
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
                                    fontSize={14}
                                />
                            </Bar>

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
                                                        background:
                                                            chartConfig[name as keyof typeof chartConfig]
                                                                ?.color ?? "#999",
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
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Legend */}
                <div className="mx-6 grid grid-cols-3 bg-white p-3 justify-items-center">
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
