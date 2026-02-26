import { useSidebar } from "@/components/ui/sidebar";
import {
    BarChart,
    Bar,
    YAxis,
    Tooltip,
    LabelList,
    XAxis,
} from "recharts"
import { TotalRunTime } from "../lib/type";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const mapData = (raw: TotalRunTime) => [
    { name: "Giờ chạy chính PG", value: Number(raw.totalPgTime), fill: "#2dd4bf" },
    { name: "Giờ chạy Offset", value: Number(raw.totalOffsetTime), fill: "#16a34a" },
    { name: "Giờ chạy SP_Chính", value: Number(raw.runTimeOfMainProduct), fill: "#15803d" },
    { name: "Giờ chạy NG_Chạy lại", value: Number(raw.runTimeOfRerun), fill: "#4ade80" },
    { name: "Giờ chạy LK_Đồ giá", value: Number(raw.runTimeOfLK), fill: "#86efac" },
    { name: "Giờ chạy điện cực", value: Number(raw.runTimeOfElectric), fill: "#bbf7d0" },
    { name: "Giờ chạy Dự bị", value: Number(raw.totalRunTimeOfPreparation), fill: "#dcfce7" },
    { name: "Giờ dừng", value: Number(raw.totalStopTime), fill: "#fde047" },
    { name: "Giờ lỗi", value: Number(raw.totalErrorTime), fill: "#ce1212" },
]
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
    let persent = open ? 300 : 350
    const data = mapData(dataRunTime);

    // Calculate auto-scaling for Y-axis
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    // Calculate appropriate domain with padding
    const padding = maxValue * 0.1; // 10% padding
    const yAxisMax = maxValue + padding;
    const yAxisMin = Math.max(0, minValue - padding); // Don't go below 0

    // Determine the best tick format based on value range
    const formatYAxisTick = (value: number) => {
        if (value < 1) {
            return `${(value * 60).toFixed(0)}m`; // Show in minutes for small values
        } else if (value < 10) {
            return `${value.toFixed(1)}`; // Show 1 decimal for values < 10
        } else {
            return `${Math.round(value)}`; // Show whole numbers for large values
        }
    };

    return (
        < Card className="h-full shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl ">
            <CardHeader>
                <p className="text-base font-semibold mb-1 text-white">{title}</p>
                {/* <p className="text-lg text-gray-500 mb-4">{description}</p> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className={`w-full h-[${persent}px] `}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: -30,
                            bottom: -10
                        }}
                    >
                        <YAxis
                            domain={[yAxisMin, yAxisMax]}
                            tickFormatter={formatYAxisTick}
                            width={80}
                            fontSize={12}
                            fontWeight={500}
                            tick={{
                                fill: "#fff",
                                style: { fill: "#fff" },
                            }}
                        />
                        <XAxis tick={false} />
                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="rounded-md border bg-white p-2 shadow-md">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-sm"
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                                <span className="text-[14px] text-gray-800 font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-gray-600 pl-6">
                                                {typeof item.value === 'number' ? item.value.toFixed(2) : item.value} giờ
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                            <LabelList
                                dataKey="value"
                                position="top"
                                offset={8}
                                className="fill-white"
                                fontSize={12}
                                fontWeight={750}
                                formatter={(value: number) =>
                                    value < 1 ?
                                        `${(value * 60).toFixed(0)}m` :
                                        `${value.toFixed(2)}`
                                }
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>

                {/* Legend */}
                {/* <div className="ml-10 grid grid-cols-3 gap-4 bg-white p-3">
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
                </div> */}
            </CardContent>
        </ Card>
    )
}
