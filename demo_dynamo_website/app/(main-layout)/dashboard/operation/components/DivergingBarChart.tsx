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
const legendItems = [
    { name: "Mục tiêu", value: 0.6, fill: "#00a6fb" },
    { name: "Thực tế", value: 0.5, fill: "#0587ca" },
    { name: "Thấp hơn mục tiêu", value: 0.5, fill: "#ff4d4d" },
]
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
        { name: "TB", target: avgtarget, real: avgReal },
        ...data,
    ]

    return (
        <Card>
            <CardHeader>
                <div className="items-center">
                    <p className="text-2xl font-bold">{title}</p>
                    <p className="text-xl text-gray-500 capitalize">{description}</p>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className={`!h-[400px] w-full`}>
                    {/* <ResponsiveContainer width="100%" height="30%"> */}
                    <BarChart accessibilityLayer data={chartData} layout="vertical">
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            fontSize={20}
                        />
                        <XAxis type="number" tickLine={false} axisLine={true} hide />

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
                        {/* <ChartLegend className="text-lg" content={<ChartLegendContent />} /> */}
                    </BarChart>
                    {/* </ResponsiveContainer> */}

                </ChartContainer>
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
        </Card >
    )
}
