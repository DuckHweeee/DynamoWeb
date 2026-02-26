"use client"
import { TrendingUp } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { MachineStatisticDetail } from "../lib/type"
import React from "react"
export const description = "A pie chart with a label"
const chartConfig = {
    running: {
        label: "Giờ chạy",
        color: "#1D4AE1",
    },
    stopped: {
        label: "Giờ dừng",
        color: "#F59E0B",
    },
    error: {
        label: "Giờ lỗi",
        color: "#E11D48",
    },
    empty: {
        label: "Giờ trống",
        color: "#3b82f6",
    },
} satisfies ChartConfig
const legendGradient = {
    running: "linear-gradient(45deg, #D0E5A5, #86E3C3)",
    stopped: "linear-gradient(45deg, #fff494, #ffdd94)",
    error: "linear-gradient(45deg, #FDC094, #fa897b)",
    empty: "linear-gradient(45deg, #d1d1d1, #e7e7e7)",
}
type Category = "running" | "stopped" | "error" | "empty";

const mapData = (raw: MachineStatisticDetail) => [
    { category: "running" as Category, hours: raw.totalRunTime },
    { category: "stopped" as Category, hours: raw.totalStopTime },
    { category: "error" as Category, hours: raw.totalErrorTime },
    { category: "empty" as Category, hours: raw.totalEmptyTime },
];
const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18; // đẩy label ra ngoài
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
            fontWeight={500}
        >
            {(percent * 100).toFixed(1)}%
        </text>
    );
};
export function RunningTimePieChart1(
    {
        title,
        description,
        dataRunTime,
    }: {
        title: string;
        description: string;
        dataRunTime: MachineStatisticDetail
    }
) {
    const machineTimeData = mapData(dataRunTime);
    const total = machineTimeData.reduce((sum, item) => sum + item.hours, 0);

    const pieDataWithPercent = machineTimeData.map(item => ({
        ...item,
        percent: total > 0 ? (item.hours / total) : 0,
    }));
    return (
        <Card className="flex flex-col !gap-0 pb-3 bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-white">{title}</CardTitle>
                <CardDescription className="text-white">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[250px] pb-0"
                >
                    <PieChart>
                        <defs>
                            <linearGradient id="runGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#D0E5A5" />
                                <stop offset="100%" stopColor="#86E3C3" />
                            </linearGradient>

                            <linearGradient id="stopGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="50%" stopColor="#fff494" />
                                <stop offset="100%" stopColor="#ffdd94" />
                            </linearGradient>

                            <linearGradient id="errorGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FDC094" />
                                <stop offset="100%" stopColor="#fa897b" />
                            </linearGradient>

                            <linearGradient id="emptyGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#d1d1d1" />
                                <stop offset="100%" stopColor="#e7e7e7" />
                            </linearGradient>
                        </defs>
                        <Pie data={pieDataWithPercent} dataKey="hours"  outerRadius={100}>
                            {machineTimeData.map((entry, index) => {
                                const gradientMap = {
                                    running: "url(#runGradient)",
                                    stopped: "url(#stopGradient)",
                                    error: "url(#errorGradient)",
                                    empty: "url(#emptyGradient)",
                                };

                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={gradientMap[entry.category]}
                                    />
                                );
                            })}
                        </Pie>

                    </PieChart>

                </ChartContainer>
                <div className="grid grid-cols-4 gap-2 text-sm flex justify-between px-6">
                    {pieDataWithPercent.map((item) => {
                        const config = chartConfig[item.category]
                        return (
                            <div key={item.category} className="col-span-1">
                                <div className="flex items-center justify-center gap-2 text-white">
                                    <span
                                        className="h-3 w-3 rounded-xs text-white"
                                        style={{ background: legendGradient[item.category] }}
                                    />
                                    <span className="text-white">{config.label}</span>
                                </div>
                                <div className="text-white pt-2 text-center">
                                    {(item.percent * 100).toFixed(1)} %
                                </div>
                            </div>


                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}