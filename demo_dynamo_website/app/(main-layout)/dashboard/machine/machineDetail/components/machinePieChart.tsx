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
import { GroupEfficiency } from "../../lib/type";

const mapData = (raw: GroupEfficiency) => [
    { name: "Hiệu suất khai thác máy", value: raw.operationalEfficiency },
    { name: "Hiệu suất PG", value: raw.pgEfficiency },
    { name: "Hiệu suất giá trị", value: raw.valueEfficiency },
    { name: "OEE", value: raw.oee },
    { name: "Tổn thất Offset", value: raw.offsetLoss },
    { name: "Tổn thất NG/khác", value: raw.otherLoss }
];
export function MachinePieChart({
    dataRunTime,
}: {
    dataRunTime: GroupEfficiency;
}) {
    const data = mapData(dataRunTime);
    return (
        <div className="grid grid-cols-3 gap-4">
            {data.map((item, index) => {
                const chartData = [{ name: item.name, number: item.value, fill: "#2563eb" }];
                const startAngle = 90;
                const endAngle = startAngle - (item.value / 100) * 360;
                const chartConfig = {
                    [item.name]: {
                        label: item.name,
                    },
                } satisfies ChartConfig
                return (
                    <Card key={index} className="flex flex-col h-fit w-auto py-1">
                        <CardContent className="flex-1 pb-0 px-1">
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square !w-full"
                            >
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

                                                    const lines = wrapText(item.name, 15) // chỉnh số ký tự tối đa 1 dòng ở đây

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
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
