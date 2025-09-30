"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useCompletedProcess } from "@/hooks/useCompletedProcess"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProcessTable from "@/components/ProcessTable"

// Custom columns for DrawingCodeProcessHistory
const getHistoryProcessColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: "orderDetailDto.orderCode",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 hover:bg-transparent cursor-pointer">
                <span className="font-bold">Mã Đơn Hàng</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-blue-600">
                {row.original.orderDetailDto?.orderCode}
            </div>
        ),
    },
    {
        accessorKey: "partNumber",
        header: () => <div className="font-bold">Số Phần</div>,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.getValue("partNumber")}
            </div>
        ),
    },
    {
        accessorKey: "stepNumber",
        header: () => <div className="font-bold">Bước</div>,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                Bước {row.getValue("stepNumber")}
            </div>
        ),
    },
    {
        accessorKey: "processType",
        header: () => <div className="font-bold">Loại Quy Trình</div>,
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.getValue("processType")}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="font-bold">Trạng Thái</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as number
            return (
                <Badge variant={status === 1 ? "finshed" : status === 0 ? "inProgress" : "canceled"}>
                    {status === 1 ? "Hoàn thành" : status === 0 ? "Chờ xử lý" : "Lỗi"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "machineDto.machineName",
        header: () => <div className="font-bold">Máy</div>,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.machineDto?.machineName || "Chưa gán"}
            </div>
        ),
    },
    {
        accessorKey: "staffDtos",
        header: () => <div className="font-bold">Nhân viên</div>,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.staffDtos?.map((staff: any) => staff.staffName).join(", ") || "Chưa gán"}
            </div>
        ),
    },
    {
        accessorKey: "pgTime",
        header: () => <div className="font-bold">Thời Gian PG</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("pgTime")} phút
            </div>
        ),
    },
    {
        accessorKey: "startTime",
        header: () => <div className="font-bold">Thời Gian Bắt Đầu</div>,
        cell: ({ row }) => {
            const startTime = row.getValue("startTime") as string
            return (
                <div className="text-center text-sm">
                    {startTime ? new Date(startTime).toLocaleString("vi-VN") : "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "endTime",
        header: () => <div className="font-bold">Thời Gian Kết Thúc</div>,
        cell: ({ row }) => {
            const endTime = row.getValue("endTime") as string
            return (
                <div className="text-center text-sm">
                    {endTime ? new Date(endTime).toLocaleString("vi-VN") : "Chưa kết thúc"}
                </div>
            )
        },
    },
]

export default function HistoryProcessPage() {
    const [date, setDate] = useState<DateRange | undefined>()
    const [selectedProcessType, setSelectedProcessType] = useState<string>("all")
    const [selectedMachine, setSelectedMachine] = useState<string>("all")
    const [selectedStaff, setSelectedStaff] = useState<string>("all")

    // Fetch data using useCompletedProcess hook
    const { data: processData, loading, error, refetch } = useCompletedProcess()

    // Extract unique values for filters from the data
    const processTypes = React.useMemo(() => {
        if (!processData) return []
        const types = [...new Set(processData.map(item => item.processType).filter(Boolean))]
        return types.sort()
    }, [processData])

    const machines = React.useMemo(() => {
        if (!processData) return []
        const machineNames = [...new Set(processData.map(item => item.machineDto?.machineName).filter(Boolean))]
        return machineNames.sort()
    }, [processData])

    const staffMembers = React.useMemo(() => {
        if (!processData) return []
        const staffNames: string[] = []
        processData.forEach(item => {
            item.staffDtos?.forEach(staff => {
                if (staff.staffName) {
                    staffNames.push(staff.staffName)
                }
            })
        })
        return [...new Set(staffNames)].sort()
    }, [processData])

    const clearFilters = () => {
        setDate(undefined)
        setSelectedProcessType("all")
        setSelectedMachine("all")
        setSelectedStaff("all")
    }

    const hasFilters = date || (selectedProcessType !== "all") || (selectedMachine !== "all") || (selectedStaff !== "all")

    // Filter the data based on selected filters
    const filteredData = React.useMemo(() => {
        if (!processData) return []

        return processData.filter(item => {
            // Date filter
            if (date?.from || date?.to) {
                const startTime = item.startTime ? new Date(item.startTime) : null
                const endTime = item.endTime ? new Date(item.endTime) : null

                if (date.from && startTime && startTime < date.from) return false
                if (date.to && endTime && endTime > date.to) return false
            }

            // Process type filter
            if (selectedProcessType !== "all" && item.processType !== selectedProcessType) return false

            // Machine filter
            if (selectedMachine !== "all" && item.machineDto?.machineName !== selectedMachine) return false

            // Staff filter
            if (selectedStaff !== "all" && !item.staffDtos?.some(staff => staff.staffName === selectedStaff)) return false

            return true
        })
    }, [processData, date, selectedProcessType, selectedMachine, selectedStaff])

    return (
        <div className="m-2 py-3 bg-white rounded-[10px] shadow h-screen">
            {/* <div className="h-screen flex flex-col p-4 bg-gray-50"> */}
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 mx-4 flex-shrink-0">
                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                    {/* Date Range Picker */}
                    <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center justify-between gap-2 w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md hover:border-gray-400 transition-colors min-w-[280px]"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">
                                            {date?.from ? format(date.from, "dd/MM/yyyy") : "Ngày bắt đầu"} -{" "}
                                            {date?.to ? format(date.to, "dd/MM/yyyy") : "Ngày kết thúc"}
                                        </span>
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <DatePicker
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Process Type Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại quy trình</label>
                        <Select value={selectedProcessType} onValueChange={setSelectedProcessType}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10 cursor-pointer">
                                <SelectValue className="cursor-pointer" placeholder="Chọn loại quy trình" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả loại</SelectItem>
                                {processTypes.map((type) => (
                                    <SelectItem className="cursor-pointer" key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Machine Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Máy</label>
                        <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10 cursor-pointer">
                                <SelectValue className="cursor-pointer" placeholder="Chọn máy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả máy</SelectItem>
                                {machines.map((machine) => (
                                    <SelectItem className="cursor-pointer" key={machine} value={machine}>
                                        {machine}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Staff Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nhân viên</label>
                        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10 cursor-pointer">
                                <SelectValue className="cursor-pointer" placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                                {staffMembers.map((staff) => (
                                    <SelectItem className="cursor-pointer" key={staff} value={staff}>
                                        {staff}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-transparent mb-2">Actions</label>
                        <div className="flex gap-2">
                            {hasFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    size="sm"
                                    className="h-10 flex-1 cursor-pointer"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                className="h-10 flex-1 cursor-pointer"
                                onClick={() => refetch()}
                                disabled={loading}
                            >
                                {loading ? "Đang tải..." : "Làm mới"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section using Global ProcessTable */}
            <div className="flex-1 min-h-0">
                <ProcessTable
                    data={filteredData || []}
                    loading={loading}
                    error={error}
                    title="Lịch Sử Quy Trình"
                    showAddButton={false}
                    showActions={false}
                    showViewHistory={false}
                    customColumns={getHistoryProcessColumns()}
                />
            </div>
        </div>
    )
}
