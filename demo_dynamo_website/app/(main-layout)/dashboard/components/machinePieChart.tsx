"use client"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface PieChartProps {
    data: {
        label: string
        value: number
    }
}

export const description = "A radial chart with text"



export function MachinePieChart({ data }: PieChartProps) {
    const chartData = [
        { name: data.label, number: data.value, fill: "#074695" },
    ]

    const chartConfig = {
        [data.label]: {
            label: data.label,
        },
    } satisfies ChartConfig

    const startAngle = 90
    const endAngle = (startAngle - (data.value / 100) * 360)
    return (
        <Card className="flex flex-col h-fit w-auto py-1">
            <CardContent className="flex-1 pb-0 px-1">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square !w-full"
                >
                    {/* <ResponsiveContainer width="100%" height="100%"> */}
                    <RadialBarChart
                        data={chartData}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        innerRadius={100}
                        outerRadius={135}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[106, 93]}
                        />
                        <RadialBar dataKey="number" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        // Hàm chia text thành nhiều dòng
                                        const wrapText = (text: string, maxChars: number) => {
                                            const words = text.split(" ")
                                            const lines: string[] = []
                                            let currentLine = ""

                                            words.forEach((word) => {
                                                if ((currentLine + word).length > maxChars) {
                                                    lines.push(currentLine)
                                                    currentLine = word + " "
                                                } else {
                                                    currentLine += word + " "
                                                }
                                            })
                                            lines.push(currentLine.trim())
                                            return lines
                                        }

                                        const lines = wrapText(data.label, 15) // chỉnh số ký tự tối đa 1 dòng ở đây

                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {chartData[0].number.toLocaleString()}%
                                                </tspan>

                                                {lines.map((line, i) => (
                                                    <tspan
                                                        key={i}
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24 + i * 16} // cách nhau 16px
                                                        className=" fill-muted-foreground text-lg"
                                                    >
                                                        {line}
                                                    </tspan>
                                                ))}
                                            </text>
                                        )
                                    }
                                }}
                            />

                        </PolarRadiusAxis>
                    </RadialBarChart>
                    {/* </ResponsiveContainer> */}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
