"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { StaffStatistic } from "../../lib/type"

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
    { name: "Thực tế", fill: "#0077FF" },
    { name: "Dự kiến", fill: "#074695" },
]

interface BarChartOperatorDetailProps {
    title: string
    description: string
    dataChart: StaffStatistic
}

export function BarChartOperatorDetail({
    title,
    description,
    dataChart,
}: BarChartOperatorDetailProps) {
    const chartConfigs = [
        {
            name: "ĐGC",
            realKey: "manufacturingPoints",
            goalKey: "manufacturingPointsGoal",
        },
        {
            name: "PG",
            realKey: "pgTime",
            goalKey: "pgTimeGoal",
        },
        {
            name: "Giờ Máy",
            realKey: "workingHours",
            goalKey: "workingHoursGoal",
        },
        {
            name: "OLE",
            realKey: "ole",
            goalKey: "oleGoal",
        },
        {
            name: "KPI",
            realKey: "kpi",
            goalKey: "kpiGoal",
        },
    ]

    return (
        <Card className="w-full border border-blue-200 shadow-md shadow-blue-200 mb-4">
            <CardHeader>
                <p className="text-xl font-bold">{title}</p>
                <p className="text-lg text-gray-400 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart
                        data={chartConfigs.map(cfg => ({
                            name: cfg.name,
                            real: Number(dataChart[cfg.realKey as keyof StaffStatistic]) || 0,
                            desirable: Number(dataChart[cfg.goalKey as keyof StaffStatistic]) || 0,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={5} axisLine={false} tick={{ fontSize: 16 }} />
                        <YAxis hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />

                        {/* Bar real với màu động */}
                        <Bar dataKey="real" radius={4}>
                            {chartConfigs.map((cfg, index) => {
                                const real = Number(dataChart[cfg.realKey as keyof StaffStatistic]) || 0
                                const goal = Number(dataChart[cfg.goalKey as keyof StaffStatistic]) || 0
                                return (
                                    <Cell
                                        key={`cell-real-${index}`}
                                        fill={real < goal ? "#EF4444" : "var(--color-real)"}
                                    />
                                )
                            })}
                            <LabelList dataKey="real" position="insideTop" offset={8} className="fill-white" fontSize={14} />
                        </Bar>

                        {/* Bar desirable giữ nguyên màu xanh */}
                        <Bar dataKey="desirable" fill="var(--color-desirable)" radius={4}>
                            <LabelList
                                dataKey="desirable"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                    </BarChart>

                </ChartContainer>

                {/* Legend */}
                <div className="mx-6 flex items-center justify-center gap-6 bg-white p-3">
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
