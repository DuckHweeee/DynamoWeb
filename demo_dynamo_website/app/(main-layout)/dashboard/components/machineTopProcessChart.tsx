"use client"

import { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export const description = "A horizontal bar chart"

const chartData = [
    { name: "I-01", number: 256 },
    { name: "I-02", number: 257 },
    { name: "I-03", number: 237 },
    { name: "I-04", number: 285 },
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

export function MachineTopProcessChart({ title, description }: { title: string; description: string }) {
    const [sortOrder, setSortOrder] = useState<string>("")

    // Sort chart data based on selected sort order
    const sortedChartData = useMemo(() => {
        if (!sortOrder) return chartData
        
        const sorted = [...chartData].sort((a, b) => {
            if (sortOrder === "ascending") {
                return a.number - b.number // Low to high
            } else if (sortOrder === "descending") {
                return b.number - a.number // High to low
            }
            return 0
        })
        
        return sorted
    }, [sortOrder])

    return (
        <Card className="!w-full">

            <CardHeader>
                <div className="flex justify-between">
                    <div className="items-center">
                        <p className="text-2xl font-bold">{title}</p>
                        <p className="text-xl text-gray-500">{description}</p>
                    </div>
                    <div className="flex items-center">
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="descending">Cao nhất</SelectItem>
                                    <SelectItem value="ascending">Thấp nhất</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={sortedChartData}
                        layout="vertical"
                        margin={{
                            left: -60,
                        }}
                    >
                        <XAxis type="number"
                            dataKey="number"
                            hide
                        />
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            width={110}
                            tick={{ fontSize: 18 }}
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
