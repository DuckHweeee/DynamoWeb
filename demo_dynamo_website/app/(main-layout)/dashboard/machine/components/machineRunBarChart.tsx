import { useSidebar } from "@/components/ui/sidebar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
} from "recharts"
import { TotalRunTime } from "../lib/type";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const mapData = (raw: TotalRunTime) => [
    { name: "Giờ chạy chính PG", value: Math.round(raw.totalPgTime), fill: "#2563EB" },
    { name: "Giờ chạy Offset", value: Math.round(raw.totalOffsetTime), fill: "#F59E0B" },
    { name: "Giờ chạy SP_Chính", value: Math.round(raw.runTimeOfMainProduct), fill: "#10B981" },
    { name: "Giờ chạy NG_Chạy lại", value: Math.round(raw.runTimeOfRerun), fill: "#EF4444" },
    { name: "Giờ chạy LK_Đồ giá", value: Math.round(raw.runTimeOfLK), fill: "#8B5CF6" },
    { name: "Giờ chạy điện cực", value: Math.round(raw.runTimeOfElectric), fill: "#0EA5E9" },
    { name: "Giờ chạy Dự bị", value: Math.round(raw.totalRunTimeOfPreparation), fill: "#14B8A6" },
    { name: "Giờ dừng", value: Math.round(raw.totalStopTime), fill: "#6B7280" },
    { name: "Giờ lỗi", value: Math.round(raw.totalErrorTime), fill: "#E11D48" },
];
const chartConfig = {
    value: {
        label: "Giờ",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export default function MachineRunBarChart({
    title,
    description,
    dataRunTime,
}: {
    title: string;
    description: string;
    dataRunTime: TotalRunTime;
}) {
    const { open } = useSidebar()
    let persent = open ? 250 : 320
    const data = mapData(dataRunTime);

    return (
        < Card className="h-full">
            <CardHeader>
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-lg text-gray-500 mb-4">{description}</p>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className={`w-full h-[${persent}px] `}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: -30,
                        }}
                    >
                        {/* <CartesianGrid vertical={false} /> */}
                        <YAxis />
                        {/* <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} /> */}
                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="rounded-md border bg-white p-2 shadow-md">
                                            {/* <p className="font-medium">{item.name}</p> */}
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-sm"
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-gray-600 pl-6">{item.value} giờ</p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                            <LabelList
                                dataKey="value"
                                position="insideTop"
                                offset={8}
                                className="fill-white"
                                fontSize={16}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>

                {/* Legend */}
                <div className="ml-10 grid grid-cols-3 gap-4 bg-white p-3">
                    {data.map((item, index) => (
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
        </ Card>
    )
}
