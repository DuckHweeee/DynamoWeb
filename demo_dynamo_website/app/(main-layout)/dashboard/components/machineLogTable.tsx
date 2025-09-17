"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data matching the image
const machineLogData = [
    {
        id: 1,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Dừng",
        statusColor: "yellow"
    },
    {
        id: 2,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Chạy",
        statusColor: "green"
    },
    {
        id: 3,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Dừng",
        statusColor: "yellow"
    },
    {
        id: 4,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Lỗi",
        statusColor: "red"
    },
    {
        id: 5,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Dừng",
        statusColor: "yellow"
    },
    {
        id: 6,
        startTime: "1/1/2025 7:00:00",
        endTime: "1/1/2025 19:00:00",
        productId: "1-1",
        productCode: "#ID238976",
        operator: "1002",
        operatorName: "Văn Thái",
        status: "Chạy",
        statusColor: "green"
    },
]

const getStatusVariant = (statusColor: string) => {
    switch (statusColor) {
        case "green":
            return "default"
        case "yellow":
            return "secondary"
        case "red":
            return "destructive"
        default:
            return "outline"
    }
}

const getStatusBadgeClass = (statusColor: string) => {
    switch (statusColor) {
        case "green":
            return "bg-green-100 text-green-800 hover:bg-green-200"
        case "yellow":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        case "red":
            return "bg-red-100 text-red-800 hover:bg-red-200"
        default:
            return ""
    }
}

const MachineLogTable = () => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Lịch Sử Máy Chạy</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">
                                    Thời Gian
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                    ID Mã Hàng
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                    Người Vận Hành
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-center">
                                    Trạng Thái
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {machineLogData.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50">
                                    <TableCell className="py-3">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{log.startTime}</div>
                                            <div className="text-sm text-gray-500">{log.endTime}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{log.productId}</div>
                                            <div className="text-sm text-gray-500">{log.productCode}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{log.operator}</div>
                                            <div className="text-sm text-gray-500">{log.operatorName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <Badge 
                                            variant={getStatusVariant(log.statusColor)}
                                            className={`px-3 py-1 text-sm font-medium ${getStatusBadgeClass(log.statusColor)}`}
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default MachineLogTable