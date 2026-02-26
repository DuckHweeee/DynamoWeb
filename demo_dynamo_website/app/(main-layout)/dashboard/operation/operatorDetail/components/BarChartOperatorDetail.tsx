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
    {
        name: "Thực tế (Đạt)",
        gradient: "linear-gradient(90deg, #D0E5A5, #86E3C3)",
    },
    {
        name: "Thực tế (Không đạt)",
        gradient: "linear-gradient(90deg, #df7f53, #f10a16)",
    },
    {
        name: "Dự kiến",
        gradient: "linear-gradient(90deg, #4adede, #1ca7ec)",
    },
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
            name: "Điểm gia công",
            realKey: "manufacturingPoints",
            goalKey: "manufacturingPointsGoal",
        },
        {
            name: "PG",
            realKey: "pgTime",
            goalKey: "pgTimeGoal",
        },
        {
            name: "Giờ máy",
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
        <Card className="w-full my-2 rounded-[20px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl shadow-md w-full">
            <CardHeader>
                <p className="text-base font-bold text-white">{title}</p>
                <p className="text-sm text-white">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[480px] w-full">
                    <BarChart
                        data={chartConfigs.map(cfg => ({
                            name: cfg.name,
                            real: Number(dataChart[cfg.realKey as keyof StaffStatistic]) || 0,
                            desirable: Number(dataChart[cfg.goalKey as keyof StaffStatistic]) || 0,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={5} axisLine={false} tick={{
                            fontSize: 16, fill: "#ffffff",
                            style: { fill: "#fff" },
                        }} />
                        <defs>
                            <linearGradient id="desireGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4adede" />
                                <stop offset="100%" stopColor=" #1ca7ec" />
                            </linearGradient>
                            <linearGradient id="realGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#D0E5A5" />
                                <stop offset="100%" stopColor=" #86E3C3" />
                            </linearGradient>
                            <linearGradient id="NGGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#df7f53" />
                                <stop offset="100%" stopColor=" #f10a16" />
                            </linearGradient>

                        </defs>
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
                                        fill={real < goal ? "url(#NGGradient)" : "url(#realGradient)"}
                                    />
                                )
                            })}
                            <LabelList dataKey="real" position="top" offset={8} className="fill-white" fontSize={14} />
                        </Bar>

                        {/* Bar desirable giữ nguyên màu xanh */}
                        <Bar dataKey="desirable" fill="url(#desireGradient)" radius={4}>
                            <LabelList
                                dataKey="desirable"
                                position="top"
                                offset={8}
                                className="fill-white"
                                fontSize={14}

                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>

                {/* Legend */}
                <div className="mx-6 flex items-center justify-center gap-6 p-3">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm "
                                style={{ background: item.gradient }}
                            />
                            <span className="text-sm text-white font-medium">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
