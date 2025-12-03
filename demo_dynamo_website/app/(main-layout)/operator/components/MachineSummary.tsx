"use client";

import { Card } from "@/components/ui/card"
import { UserIcon, AlertTriangleIcon, PauseCircleIcon, PowerOffIcon } from "lucide-react"

const summaryItems = [
    { title: "Tổng Số Máy Đang Chạy", value: 50, total: 100, color: "text-green-600", icon: UserIcon },
    { title: "Tổng Số Máy Dừng", value: 20, total: 100, color: "text-yellow-500", icon: PauseCircleIcon },
    { title: "Tổng Số Máy Lỗi", value: 28, total: 100, color: "text-red-500", icon: AlertTriangleIcon },
    { title: "Tổng Số Máy Tắt", value: 2, total: 100, color: "text-muted-foreground", icon: PowerOffIcon },
]

export function MachineSummary() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {summaryItems.map((item, idx) => (
                <Card key={idx} className="p-4 flex flex-col items-center text-center gap-2 shadow-md">
                    {/* <item.icon className={item.color} size={32} /> */}
                    <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.value}/{item.total}</div>
                </Card>
            ))}
        </div>
    )
}
