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
import { MachineOverview } from "../lib/type"

const chartConfig = {
    pgTime: {
        label: "Thực tế",
        color: "#0077FF",
    },
    pgTimeExpect: {
        label: "Dự kiến",
        color: "#074695",
    },
} satisfies ChartConfig
const legendItems = [
    { name: "Dự kiến", fill: "#074695" },
    { name: "Thực tế", fill: "#0077FF" },
    { name: "Mục tiêu", fill: "red" },
]

export function SumRealTimeMachine({
    title,
    description,
    dataOverview,
}: {
    title: string
    description: string
    dataOverview: MachineOverview[]
}) {
    const groupTarget =
        dataOverview.length > 0 ? dataOverview[0].groupTarget : 0

    const roundedData = dataOverview.map(item => ({
        ...item,
        pgTime: Math.round(item.pgTime),
        pgTimeExpect: Math.round(item.pgTimeExpect),
    }))

    return (
        <Card>
            <CardHeader>
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={roundedData}
                        margin={{
                            left: -30,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="machineName"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tick={{ fontSize: 18 }}
                        />
                        <YAxis tickLine={false} tick={{ fontSize: 0 }} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="pgTime" fill="#0077FF" radius={4}>
                            <LabelList
                                dataKey="pgTime"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                        <Bar dataKey="pgTimeExpect" fill="#074695" radius={4}>
                            <LabelList
                                dataKey="pgTimeExpect"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                        <ReferenceLine
                            y={groupTarget}
                            stroke="red"
                            label={{
                                value: groupTarget.toString(),
                                position: "left",
                                fontSize: 15,
                                fill: "red",
                                offset: 5,
                            }}
                        />
                    </BarChart>
                </ChartContainer>

                {/* Legend */}
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