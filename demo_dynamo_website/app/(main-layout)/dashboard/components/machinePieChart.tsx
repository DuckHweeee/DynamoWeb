"use client"

import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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


    // const chartData = [
    //     { browser: data.label, number: data.value, fill: "#074695" },
    // ]
    // const chartConfig = {
    //     number: {
    //         label: "number",
    //     },
    //     safari: {
    //         label: "Safari",
    //         color: "var(--chart-2)",
    //     },
    // } satisfies ChartConfig

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
                    // innerRadius="80%"
                    // outerRadius="110%"
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
                            {/* <Label
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
                                                    // className="fill-foreground text-4xl font-bold"
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {chartData[0].number.toLocaleString()}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    // className="fill-muted-foreground"
                                                    className="fill-muted-foreground text-lg"
                                                >
                                                    {data.label}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            /> */}
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



// Đang test

// "use client"

// import { TrendingUp } from "lucide-react"
// import {
//     Label,
//     PolarGrid,
//     PolarRadiusAxis,
//     RadialBar,
//     RadialBarChart,
// } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { ChartConfig, ChartContainer } from "@/components/ui/chart"
// interface PieChartProps {
//     data: {
//         label: string
//         value: number
//     }
// }

// export function MachinePieChart({ data }: PieChartProps) {
//     const chartData = [
//         { browser: data.label, visitors: data.value, fill: "#074695" },
//     ]

//     const chartConfig = {
//         // visitors: {
//         //     label: "Visitors",
//         // },
//         // safari: {
//         //     label: "Safari",
//         //     color: "var(--chart-2)",
//         // },
//     } satisfies ChartConfig

//     const startAngle = 90
//     const endAngle = (startAngle - (data.value / 100) * 360)
//     return (
//         <Card className="flex flex-col">
//             <CardContent className="flex-1 pb-0">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <RadialBarChart
//                         data={chartData}
//                         startAngle={startAngle}
//                         endAngle={endAngle}
//                         innerRadius={80}
//                         outerRadius={120}
//                     // innerRadius="80%"
//                     // outerRadius="110%"
//                     >
//                         <PolarGrid
//                             gridType="circle"
//                             radialLines={false}
//                             stroke="none"
//                             className="first:fill-muted last:fill-background"
//                             polarRadius={[86, 74]}
//                         />
//                         <RadialBar dataKey="visitors" background cornerRadius={10} />
//                         <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-4xl font-bold"
//                                                 >
//                                                     {chartData[0].visitors.toLocaleString()}
//                                                 </tspan>
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground text-xl"
//                                                 >
//                                                     {data.label}
//                                                 </tspan>
//                                             </text>
//                                         )
//                                     }
//                                 }}
//                             />
//                         </PolarRadiusAxis>
//                     </RadialBarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }




























// Phiên bản chạy toàn bộ vòng tròn
// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { ChartConfig, ChartContainer } from "@/components/ui/chart"
// import { RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, Label } from "recharts"

// interface PieChartProps {
//     data: {
//         label: string
//         value: number
//         fill: string
//     }
// }

// export function MachinePieChart({ data }: PieChartProps) {
//     const chartData = [
//         { name: data.label, value: data.value, fill: data.fill },
//     ]

//     const chartConfig = {
//         [data.label]: {
//             label: data.label,
//             color: data.fill,
//         },
//     } satisfies ChartConfig

//     return (
//         <Card className="flex flex-col items-center justify-center p-4">
//             <CardContent className="flex items-center justify-center p-0">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <RadialBarChart
//                         data={chartData}
//                         startAngle={90}
//                         endAngle={-270}
//                         innerRadius={80}
//                         outerRadius={100}
//                     >
//                         <PolarGrid
//                             gridType="circle"
//                             radialLines={false}
//                             stroke="none"
//                             polarRadius={[86, 74]}
//                         />
//                         <RadialBar
//                             dataKey="value"
//                             cornerRadius={10}
//                             background
//                         />
//                         <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-4xl font-bold"
//                                                 >
//                                                     {data.value}%
//                                                 </tspan>
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground text-base"
//                                                 >
//                                                     {data.label}
//                                                 </tspan>
//                                             </text>
//                                         )
//                                     }
//                                 }}
//                             />
//                         </PolarRadiusAxis>
//                     </RadialBarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }

// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { ChartContainer } from "@/components/ui/chart"
// import { RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, Label } from "recharts"

// interface PieChartProps {
//     data: {
//         label: string
//         value: number
//         fill: string
//     }
// }

// export function MachinePieChart({ data }: PieChartProps) {
//     // Chỉ cần 1 data duy nhất
//     const chartData = [
//         { name: data.label, value: data.value, fill: data.fill },
//     ]

//     // Góc kết thúc dựa vào %
//     const startAngle = 90
//     const endAngle = 90 - (data.value / 100) * 360

//     return (
//         <Card className="flex flex-col items-center justify-center p-4 shadow-md">
//             <CardContent className="flex items-center justify-center p-0">
//                 <ChartContainer
//                     config={{}}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <RadialBarChart
//                         data={chartData}
//                         startAngle={startAngle}
//                         endAngle={endAngle}
//                         innerRadius={80}
//                         outerRadius={100}
//                     >
//                         <PolarGrid
//                             gridType="circle"
//                             radialLines={false}
//                             stroke="none"
//                             polarRadius={[86, 74]}
//                         />
//                         <RadialBar
//                             dataKey="value"
//                             cornerRadius={10}
//                             background={{ fill: "#e5e7eb" }} // nền xám nhạt
//                         />
//                         <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 {/* Giá trị phần trăm */}
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-4xl font-bold"
//                                                 >
//                                                     {data.value}%
//                                                 </tspan>
//                                                 {/* Nhãn phía dưới */}
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground text-base"
//                                                 >
//                                                     {data.label}
//                                                 </tspan>
//                                             </text>
//                                         )
//                                     }
//                                 }}
//                             />
//                         </PolarRadiusAxis>
//                     </RadialBarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }
