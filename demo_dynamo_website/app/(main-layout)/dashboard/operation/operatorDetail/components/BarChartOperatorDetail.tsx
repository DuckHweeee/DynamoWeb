// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartLegend,
//     ChartLegendContent,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { StaffStatistic } from "../../lib/type"

// export const description = "A multiple bar chart"


// const chartConfig = {
//     real: {
//         label: "Thực tế",
//         color: "#0077FF",
//     },
//     desirable: {
//         label: "Dự kiến",
//         color: "#074695",
//     },
// } satisfies ChartConfig
// const legendItems = [
//     { name: "Thực tế", value: 0.5, fill: "#0077FF" },
//     { name: "Dự kiến", value: 0.6, fill: "#074695" },
// ]
// interface BarChartOperatorDetailProps {
//     title: string
//     description: string
//     dataChart: StaffStatistic
// }
// export function DivergingBarChart({
//     title,
//     description,
//     dataChart,
// }: BarChartOperatorDetailProps) {
//     return (
//         <Card>
//             <CardHeader>
//                 {/* <CardTitle>Tổng Thời Gian Thực</CardTitle>
//                 <CardDescription>PG Dự Kiến Của Từng Máy Trong Nhóm</CardDescription> */}
//                 <p className="text-2xl font-bold">{title}</p>
//                 <p className="text-xl text-gray-500 mb-4">{description}</p>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
//                     <BarChart accessibilityLayer data={dataChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid vertical={false} />
//                         <XAxis
//                             dataKey="name"
//                             tickLine={false}
//                             tickMargin={5}
//                             axisLine={false}
//                             tick={{ fontSize: 18 }}
//                         />
//                         <YAxis hide />
//                         {/* <ChartLegend className="text-lg" content={<ChartLegendContent />} /> */}
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent indicator="dashed" />}
//                         />
//                         <Bar dataKey="real" fill="var(--color-real)" radius={4}>
//                             <LabelList
//                                 dataKey="real"
//                                 position="insideTop"
//                                 offset={8}
//                                 className="fill-white"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                         <Bar dataKey="desirable" fill="var(--color-desirable)" radius={4} >
//                             <LabelList
//                                 dataKey="desirable"
//                                 position="insideTop"
//                                 offset={8}
//                                 className="fill-white"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                         {/*
//                         <ReferenceLine
//                             y={100}   // 👈 truyền số vào đây
//                             stroke="red"           // màu đường
//                             label={{
//                                 value: `${100}`,
//                                 position: "left",
//                                 fontSize: 15,
//                                 fill: "red",
//                                 offset: 5,
//                             }}
//                         /> */}
//                     </BarChart>
//                 </ChartContainer>
//                 <div className="mx-6 flex items-center justify-center gap-6 bg-white p-3 ml-20">
//                     {legendItems.map((item, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                             <div
//                                 className="w-3 h-3 rounded-sm"
//                                 style={{ backgroundColor: item.fill }}
//                             />
//                             <span className="text-sm text-gray-800 font-medium">
//                                 {item.name}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </CardContent>
//         </Card >
//     )
// }

// Bản 2
// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartLegend,
//     ChartLegendContent,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { StaffStatistic } from "../../lib/type"

// export const description = "A multiple bar chart"

// const chartConfig = {
//     real: {
//         label: "Thực tế",
//         color: "#0077FF",
//     },
//     desirable: {
//         label: "Dự kiến",
//         color: "#074695",
//     },
// } satisfies ChartConfig

// const legendItems = [
//     { name: "Thực tế", value: 0.5, fill: "#0077FF" },
//     { name: "Dự kiến", value: 0.6, fill: "#074695" },
// ]

// interface BarChartOperatorDetailProps {
//     title: string
//     description: string
//     dataChart: StaffStatistic
// }

// export function BarChartOperatorDetail({
//     title,
//     description,
//     dataChart,
// }: BarChartOperatorDetailProps) {
//     const chartConfigs = [
//         {
//             title: "ĐGC",
//             targetKey: "manufacturingPointsGoal",
//             realKey: "manufacturingPoints",
//         },
//         {
//             title: "PG",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "pgTime",
//             realKey: "pgTimeGoal",
//         },
//         {
//             title: "Giờ Máy",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "workingHours",
//             realKey: "workingHoursGoal",
//         },
//         {
//             title: "OLE",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "ole",
//             realKey: "oleGoal",
//         },
//         {
//             title: "KPI",
//             description: "Tổng giờ chạy thực so với tổng giờ chạy mục tiêu",
//             targetKey: "kpiGoal",
//             realKey: "kpi",
//         },
//     ];

//     return (
//         <Card>
//             <CardHeader>
//                 <p className="text-2xl font-bold">{title}</p>
//                 <p className="text-xl text-gray-500 mb-4">{description}</p>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                     >
//                         <CartesianGrid vertical={false} />
//                         <XAxis
//                             dataKey="name"
//                             tickLine={false}
//                             tickMargin={5}
//                             axisLine={false}
//                             tick={{ fontSize: 18 }}
//                         />
//                         <YAxis hide />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent indicator="dashed" />}
//                         />
//                         <Bar dataKey="real" fill="var(--color-real)" radius={4}>
//                             <LabelList
//                                 dataKey="real"
//                                 position="insideTop"
//                                 offset={8}
//                                 className="fill-white"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                         <Bar dataKey="desirable" fill="var(--color-desirable)" radius={4} >
//                             <LabelList
//                                 dataKey="desirable"
//                                 position="insideTop"
//                                 offset={8}
//                                 className="fill-white"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                     </BarChart>
//                 </ChartContainer>
//                 <div className="mx-6 flex items-center justify-center gap-6 bg-white p-3 ml-20">
//                     {legendItems.map((item, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                             <div
//                                 className="w-3 h-3 rounded-sm"
//                                 style={{ backgroundColor: item.fill }}
//                             />
//                             <span className="text-sm text-gray-800 font-medium">
//                                 {item.name}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


// Bản 3
// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartLegend,
//     ChartLegendContent,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { StaffStatistic } from "../../lib/type"

// export const description = "A multiple bar chart"

// const chartConfig = {
//     real: {
//         label: "Thực tế",
//         color: "#0077FF",
//     },
//     desirable: {
//         label: "Mục tiêu",
//         color: "#87CEEB",
//     },
// } satisfies ChartConfig

// const legendItems = [
//     { name: "Mục tiêu", fill: "#87CEEB" },
//     { name: "Thực tế", fill: "#0077FF" },
// ]

// interface BarChartOperatorDetailProps {
//     title: string
//     description: string
//     dataChart: StaffStatistic
//     realKey: keyof StaffStatistic
//     goalKey: keyof StaffStatistic
//     metricName: string
// }

// export function BarChartOperatorDetail({
//     title,
//     description,
//     dataChart,
//     realKey,
//     goalKey,
//     metricName,
// }: BarChartOperatorDetailProps) {
//     // Transform single StaffStatistic object to array format for BarChart
//     const chartData = [
//         {
//             name: metricName,
//             real: Number(dataChart[realKey]) || 0,
//             desirable: Number(dataChart[goalKey]) || 0,
//         }
//     ];

//     return (
//         <Card>
//             <CardHeader>
//                 <p className="text-2xl font-bold">{title}</p>
//                 <p className="text-xl text-gray-500 mb-4">{description}</p>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                     >
//                         <CartesianGrid vertical={false} />
//                         <XAxis
//                             dataKey="name"
//                             tickLine={false}
//                             tickMargin={10}
//                             axisLine={false}
//                             tick={{ fontSize: 16 }}
//                         />
//                         <YAxis hide />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent />}
//                         />
//                         {/* Grouped bars - không có stackId */}
//                         <Bar
//                             dataKey="desirable"
//                             fill="var(--color-desirable)"
//                             radius={[4, 4, 0, 0]}
//                             maxBarSize={60}
//                         >
//                             <LabelList
//                                 dataKey="desirable"
//                                 position="top"
//                                 offset={8}
//                                 className="fill-gray-600"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                         <Bar
//                             dataKey="real"
//                             fill="var(--color-real)"
//                             radius={[4, 4, 0, 0]}
//                             maxBarSize={60}
//                         >
//                             <LabelList
//                                 dataKey="real"
//                                 position="top"
//                                 offset={8}
//                                 className="fill-gray-600"
//                                 fontSize={14}
//                             />
//                         </Bar>
//                     </BarChart>
//                 </ChartContainer>
//                 <div className="mx-6 flex items-center justify-center gap-6 bg-white p-3 ml-20">
//                     {legendItems.map((item, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                             <div
//                                 className="w-3 h-3 rounded-sm"
//                                 style={{ backgroundColor: item.fill }}
//                             />
//                             <span className="text-sm text-gray-800 font-medium">
//                                 {item.name}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// Bản 4
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
        <Card>
            <CardHeader>
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    {/* <BarChart
                        data={chartConfigs.map(cfg => ({
                            name: cfg.name,
                            real: Number(dataChart[cfg.realKey as keyof StaffStatistic]) || 0,
                            desirable: Number(dataChart[cfg.goalKey as keyof StaffStatistic]) || 0,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tick={{ fontSize: 16 }}
                        />
                        <YAxis hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="real" fill="var(--color-real)" radius={4}>
                            <LabelList
                                dataKey="real"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                        <Bar dataKey="desirable" fill="var(--color-desirable)" radius={4}>
                            <LabelList
                                dataKey="desirable"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={14}
                            />
                        </Bar>
                    </BarChart> */}
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
