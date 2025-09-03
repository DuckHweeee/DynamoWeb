"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

const legendItems = [
    { name: "Rerun Machine", value: 0.6, color: "#0033A0" },
    { name: "Main Product Run", value: 0.5, color: "#F3BC32" },
    { name: "Captive Product Stop", value: 0.79, color: "#00E676" },
    { name: "Error Machine", value: 0.11, color: "#FF0000" },
    { name: "Off Machine", value: 0.18, color: "#BDBDBD" },
]

const data = [
    { name: "Rerun Machine", value: 0.6, fill: "#0033A0" },
    { name: "Main Product Run", value: 0.5, fill: "#F3BC32" },
    { name: "Captive Product Stop", value: 0.79, fill: "#00E676" },
    { name: "Error Machine", value: 0.11, fill: "#FF0000" },
    { name: "Run Machine 5", value: 1.18, fill: "#D9D9D9" },
    { name: "Off Machine 5", value: 1.26, fill: "#ABCAFB" },
    { name: "Machine 6", value: 1.8, fill: "#6BF2E5" },
    { name: "Off Machine 6", value: 0.9, fill: "#00EAFF" },
    { name: "Machine 7", value: 2.18, fill: "#0077FF" },
    { name: "Off Machine 7", value: 1.18, fill: "#5069E7" },
    { name: "Machine 8", value: 0.59, fill: "#4400E4" },
    { name: "Off Machine 8", value: 0.56, fill: "#E4DC00" },
    { name: "Off Machine 9", value: 0.89, fill: "#E47A00" },
    { name: "Machine 9", value: 0.3, fill: "#BDBDBD" },
]

export default function MachineRunBarChart() {
    return (
        <Card className="relative !flex-1/2">
            <CardHeader>
                <CardTitle className="text-xl">Tổng Giờ Chạy Trong Tháng Nhóm 1</CardTitle>
                <p className="text-sm text-muted-foreground">Tổng thời gian hoạt động của nhóm này</p>
            </CardHeader>

            <CardContent>
                {/* Floating Legend */}
                <div className="absolute top-28 left-30 z-10 bg-white shadow-lg rounded-xl p-4 w-[250px]">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* Biểu đồ Recharts */}
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 0 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
