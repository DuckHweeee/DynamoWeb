"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    return (
        <Card className="!w-full">

            <CardHeader>
                <div className="flex justify-between">
                    <div className="items-center">
                        <p className="text-2xl font-bold">{title}</p>
                        <p className="text-xl text-gray-500">{description}</p>
                    </div>
                    <div className="flex items-center">
                        <Select>
                            <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Fruits</SelectLabel> */}
                                    <SelectItem value="apple">Cao nhất</SelectItem>
                                    <SelectItem value="banana">Thấp nhất</SelectItem>
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
                            left: -60,
                        }}
                    >
                        <XAxis type="number"
                            dataKey="number"
                            // tick={{ fontSize: 15 }}
                            // tickLine={true}
                            // tickMargin={10}
                            // axisLine={true}
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
                        // tickFormatter={(value) => value.slice(0, 7)}
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
