import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, Label } from "recharts"

interface PieChartProps {
    data: {
        label: string
        value: number
        fill: string
    }
}

export function MachinePieChart({ data }: PieChartProps) {
    const chartData = [
        { browser: data.label, visitors: data.value, fill: data.fill },
    ]

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        [data.label]: {
            label: data.label,
            color: data.fill,
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={300}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {data.value.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {data.label}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.25% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total {data.label.toLowerCase()} for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
