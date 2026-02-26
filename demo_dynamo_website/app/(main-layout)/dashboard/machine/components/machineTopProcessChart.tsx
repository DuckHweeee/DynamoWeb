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
import { TopMachine } from "../lib/type";

const chartConfig = {
    machineName: {
        label: "Máy",
    },
    number: {
        label: "Tổng số",
        color: "#22c55e",
    },
} satisfies ChartConfig

export function MachineTopProcessChart({
    title,
    description,
    dataTopHighMachine,
    dataTopLowMachine,
}: {
    title: string
    description: string
    dataTopHighMachine: TopMachine[]
    dataTopLowMachine: TopMachine[]
}) {
    const [topProcess, setTopProcess] = useState<string>("high")

    const chartData = useMemo(() => {
        const rawData =
            topProcess === "high" ? dataTopHighMachine : dataTopLowMachine

        return rawData.map((item) => ({
            name: `${item.machineName}`,
            number: item.totalRunTime.toFixed(2),
        }))
    }, [topProcess, dataTopHighMachine, dataTopLowMachine])

    return (
        <Card className="!w-full shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl ">
            <CardHeader>
                <div className="flex justify-between">
                    <div className="items-center">
                        <p className="text-base font-semibold text-white ">{title}</p>
                        <p className="text-sm text-gray-700 text-white">{description}</p>
                    </div>
                    <div className="flex items-center">
                        <Select value={topProcess} onValueChange={setTopProcess}>
                            <SelectTrigger className="cursor-pointer text-sm w-[120px] bg-linear-to-r from-[#D0E5A5] to-[#86E3C3] px-4 !py-4 !text-white rounded-sm hover:bg-[#15803d] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem className="cursor-pointer text-sm" value="high">Cao nhất</SelectItem>
                                    <SelectItem className="cursor-pointer text-sm" value="low">Thấp nhất</SelectItem>
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
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -50,
                            right: 180
                        }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#D0E5A5" />
                                <stop offset="100%" stopColor=" #86E3C3" />
                            </linearGradient>
                        </defs>
                        <XAxis type="number" dataKey="number" hide />
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={true}
                            tickMargin={5}
                            axisLine={false}
                            width={110}
                            tick={{
                                fontSize: 14, fontWeight: 700, fill: "#ffffff", 
                                style: { fill: "#fff" },
                            }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="number" fill="url(#barGradient)" radius={5}>
                            <LabelList
                                dataKey="number"
                                position="right"
                                offset={1}
                                className="fill-white"
                                fontSize={12}
                                fontWeight={750}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}



// "use client"

// import { useState, useMemo } from "react"
// import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Card,
//     CardContent,
//     CardHeader,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"
// import { TopHighMachine, TopLowMachine } from "../lib/type";

// export const description = "A horizontal bar chart"

// const chartConfig = {
//     machineName: {
//         label: "Máy",
//     },
//     numberOfProcesses: {
//         label: "Tổng số",
//         color: "#074695",
//     },
// } satisfies ChartConfig

// export function MachineTopProcessChart({
//     title,
//     description,
//     dataTopHighMachine,
//     dataTopLowMachine,
// }: {
//     title: string
//     description: string
//     dataTopHighMachine: TopHighMachine[]
//     dataTopLowMachine: TopLowMachine[]
// }) {
//     const [topProcess, setTopProcess] = useState<string>("")


//     return (
//         <Card className="!w-full">

//             <CardHeader>
//                 <div className="flex justify-between">
//                     <div className="items-center">
//                         <p className="text-2xl font-bold">{title}</p>
//                         <p className="text-xl text-gray-500">{description}</p>
//                     </div>
//                     <div className="flex items-center">
//                         <Select value={topProcess} onValueChange={setTopProcess}>
//                             <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
//                                 <SelectValue placeholder="Sắp xếp" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="high">Cao nhất</SelectItem>
//                                     <SelectItem value="ascending">Thấp nhất</SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig}>
//                     <BarChart
//                         accessibilityLayer
//                         data={sortedChartData}
//                         layout="vertical"
//                         margin={{
//                             left: -60,
//                         }}
//                     >
//                         <XAxis type="number"
//                             dataKey="number"
//                             hide
//                         />
//                         <CartesianGrid horizontal={false} />
//                         <YAxis
//                             dataKey="name"
//                             type="category"
//                             tickLine={false}
//                             tickMargin={5}
//                             axisLine={false}
//                             width={110}
//                             tick={{ fontSize: 18 }}
//                         />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent indicator="line" />}
//                         />
//                         <Bar dataKey="number" fill="var(--color-name)" radius={5}>
//                             <LabelList
//                                 dataKey="number"
//                                 position="right"
//                                 offset={8}
//                                 className="fill-foreground"
//                                 fontSize={16}
//                             />
//                         </Bar>
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card >
//     )
// }


