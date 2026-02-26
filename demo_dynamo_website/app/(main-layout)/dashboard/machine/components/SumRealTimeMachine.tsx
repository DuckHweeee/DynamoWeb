"use client"

import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

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
import { MachineOverview } from "../lib/type"

const chartConfig = {
    pgTime: {
        label: "Thực tế",
        color: "url(#realGradient)",
    },
    pgTimeExpect: {
        label: "Dự kiến",
        color: "url(#expectGradient)",
    },
} satisfies ChartConfig
const legendItems = [
    { name: "Dự kiến", gradient: "linear-gradient(to bottom, #08b37a, #397D54)" },
    { name: "Thực tế", gradient: "linear-gradient(to bottom, #73C088, #A8E0B7)" },
    { name: "Mục tiêu", color: "#1b1717" },
]

const CustomRealLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    const TEXT_HEIGHT = 14;     // fontSize
    const PADDING = 6;          // khoảng đệm
    // const canFitInside = height > TEXT_HEIGHT + PADDING;

    return (
        <text
            x={x + width / 2}
            y={y - 6}
            textAnchor="middle"
            fill={"#fff"}
            fontSize={14}
            fontWeight={500}
        >
            {value}
        </text>
    );
};
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
        dataOverview.length > 0 ? dataOverview[0].groupTarget.toFixed(2) : 0
    const roundedData = dataOverview.map(item => ({
        ...item,
        pgTime: item.pgTime.toFixed(2),
        pgTimeExpect: Math.round(item.pgTimeExpect),
    }))

    return (
        <Card className="shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl ">
            <CardHeader>
                <p className="text-base font-semibold text-white">{title}</p>
                <p className="text-sm text-white mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] sm:h-[350px] lg:h-[404px] w-full px-4 sm:px-6">
                    <BarChart
                        accessibilityLayer
                        data={roundedData}
                        margin={{
                            left: -5,
                            top: 100
                        }}
                    >
                        <defs>
                            <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#73C088" />
                                <stop offset="100%" stopColor="#A8E0B7" />
                            </linearGradient>

                            <linearGradient id="expectGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#08b37a" />
                                <stop offset="100%" stopColor="#397D54" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="machineName"
                            tickLine={true}
                            tickMargin={5}
                            axisLine={false}
                            tick={{
                                fontSize: 14, fontWeight: 750, fill: "#fff",
                                style: { fill: "#fff" },
                            }}
                        />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 0 }} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="pgTime" fill="url(#realGradient)" radius={4}>
                            <LabelList
                                dataKey="pgTime"
                                content={<CustomRealLabel />}
                                offset={8}
                                className="fill-white"
                                fontSize={14}

                            />
                        </Bar>
                        <Bar dataKey="pgTimeExpect" fill="url(#expectGradient)" radius={4}>
                            <LabelList
                                dataKey="pgTimeExpect"
                                content={<CustomRealLabel />}
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                                fontWeight={750}
                            />
                        </Bar>
                        <ReferenceLine
                            y={groupTarget} // 👈 chỉ lấy 1 giá trị
                            stroke="#1b1717"
                            label={{
                                value: groupTarget.toString(),
                                position: "left",
                                fontSize: 12,
                                fill: "red",
                                offset: 5,
                            }}
                        />
                    </BarChart>
                </ChartContainer>

                {/* Legend */}
                <div className="mx-6 flex items-center justify-center gap-6  p-3 ml-20">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={
                                    item.gradient
                                        ? { backgroundImage: item.gradient }
                                        : { backgroundColor: item.color }
                                }
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
