"use client";

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Tắt"

interface MachineCardProps {
    name: string
    operator: string
    code: string
    machine: string
    status: string
    pg: number
}

const statusColors: Record<string, string> = {
    "Đang Chạy": "bg-green-500",
    "Dừng": "bg-yellow-500",
    "Lỗi": "bg-red-500",
    "Tắt": "bg-neutral-400",
}

export function MachineCard({ name, operator, code, machine, status, pg }: MachineCardProps) {
    return (
        <Card className="p-4 flex flex-col gap-1 text-sm rounded-xl shadow-md min-w-[200px]">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">{name}</h2>
                <span className={cn("w-3 h-3 rounded-full", statusColors[status])} />
            </div>
            {/* <div>Trạng Thái: <span className="font-semibold text-[13px]">{status}</span></div> */}
            <div>Mã Bản Vẽ: <span className="font-bold">{code}</span></div>
            <div>{machine}</div>
            {/* <div>NVVH: <span className="font-bold">{operator}</span></div> */}
            <div>00:00 - PG: {pg}P</div>
        </Card>
    )
}
