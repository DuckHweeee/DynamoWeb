"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Search, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useState } from "react"
import { DrawingCodeProcessHistory, Machine2 } from "@/lib/type"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMachine } from "@/hooks/useMachine"
import { useMachineProcessHistory } from "@/hooks/useMachineProcessHistory"
import { DateRange } from "react-day-picker"

function formatTime(timeString: string): string {
    try {
        const date = new Date(timeString)
        return format(date, "dd/MM/yyyy HH:mm")
    } catch {
        return timeString
    }
}

function formatDuration(pgTime: number): string {
    const hours = Math.floor(pgTime / 60)
    const minutes = pgTime % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function getProcessStatusBadge(status: number) {
    switch (status) {
        case 0:
            return <Badge variant="secondary">Chờ xử lý</Badge>
        case 1:
            return <Badge variant="outline">Đang xử lý</Badge>
        case 2:
            return <Badge variant="default">Hoàn thành</Badge>
        case 3:
            return <Badge variant="destructive">Dừng</Badge>
        default:
            return <Badge variant="secondary">Không xác định</Badge>
    }
}

const columns: ColumnDef<DrawingCodeProcessHistory>[] = [
    {
        accessorKey: "orderDetailDto.orderCode",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <span className="font-semibold">Mã Đơn Hàng</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="min-w-0">
                <div className="font-semibold text-blue-600 truncate">
                    {row.original.orderDetailDto?.orderCode || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    ID: {row.original.orderDetailDto?.orderDetailId?.substring(0, 8) || 'N/A'}...
                </div>
            </div>
        ),
    },
    {
        accessorKey: "machineDto.machineName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <span className="font-semibold">Máy</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.machineDto?.machineName || 'N/A'}
            </div>
        ),
    },
    {
        accessorKey: "processType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <span className="font-semibold">Loại Quy Trình</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <Badge variant="outline" className="font-medium">
                {row.getValue("processType")}
            </Badge>
        ),
    },
    {
        accessorKey: "processStatus",
        header: "Trạng Thái",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {getProcessStatusBadge(row.getValue("processStatus"))}
            </div>
        ),
    },
    {
        accessorKey: "startTime",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <span className="font-semibold">Thời Gian</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="min-w-0">
                <div className="text-sm font-medium">
                    Bắt đầu: <span className="font-mono text-xs">{formatTime(row.getValue("startTime"))}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                    Kết thúc: <span className="font-mono">{formatTime(row.original.endTime)}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "pgTime",
        header: "Thời Gian PG",
        cell: ({ row }) => (
            <div className="text-center font-mono text-sm font-medium">
                {formatDuration(row.getValue("pgTime"))}
            </div>
        ),
    },
    {
        accessorKey: "manufacturingPoint",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <span className="font-semibold">Điểm SX</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center font-semibold text-green-600">
                {row.getValue("manufacturingPoint")}
            </div>
        ),
    },
    {
        accessorKey: "staffDtos",
        header: "Nhân Viên",
        cell: ({ row }) => {
            const staffList = row.original.staffDtos || []
            return (
                <div className="min-w-0 max-w-xs">
                    {staffList.length > 0 ? (
                        <div className="space-y-1">
                            {staffList.slice(0, 2).map((staff, index) => (
                                <div key={index} className="text-sm">
                                    <div className="font-medium truncate">{staff.staffName}</div>
                                    <div className="text-muted-foreground text-xs truncate">
                                        {staff.staffSection}
                                    </div>
                                </div>
                            ))}
                            {staffList.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                    +{staffList.length - 2} nhân viên khác
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">Không có</span>
                    )}
                </div>
            )
        },
    },
]

export default function HistoryMachineProcessPage() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    
    // Filter states
    const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)

    // Format dates for API
    const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : null
    const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : null

    // Data hooks
    const { data: machineList, loading: machineLoading, error: machineError } = useMachine()
    const { data: processHistory, loading: historyLoading, error: historyError, refetch } = useMachineProcessHistory(
        selectedMachineId, 
        startDateString, 
        endDateString
    )

    const table = useReactTable({
        data: processHistory,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const clearFilters = () => {
        setSelectedMachineId(null)
        setStartDate(undefined)
        setEndDate(undefined)
    }

    const handleMachineSelect = (value: string) => {
        if (value === "all") {
            setSelectedMachineId(null)
        } else {
            setSelectedMachineId(value)
        }
    }

    const hasFilters = selectedMachineId || startDate || endDate

    if (machineError) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-red-600">
                            Lỗi khi tải danh sách máy: {machineError}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col p-4 bg-gray-50">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 flex-shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Lịch Sử Quy Trình Máy</h1>
                    
                    {/* Search Input */}
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm..."
                            value={(table.getColumn("orderDetailDto_orderCode")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("orderDetailDto_orderCode")?.setFilterValue(event.target.value)
                            }
                            className="pl-10 h-10"
                        />
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 flex-shrink-0">
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
                                            {startDate ? format(startDate, "dd/MM/yyyy") : "Ngày bắt đầu"} -{" "}
                                            {endDate ? format(endDate, "dd/MM/yyyy") : "Ngày kết thúc"}
                                        </span>
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <DatePicker
                                    mode="range"
                                    selected={{ from: startDate, to: endDate }}
                                    onSelect={(range) => {
                                        setStartDate(range?.from)
                                        setEndDate(range?.to)
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Machine Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Máy</label>
                        <Select value={selectedMachineId || "all"} onValueChange={(value) => handleMachineSelect(value)}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                                <SelectValue placeholder="Chọn máy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <span className="font-medium">Tất cả máy</span>
                                </SelectItem>
                                {machineLoading ? (
                                    <div className="p-2">
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ) : (
                                    machineList.map((machine) => (
                                        <SelectItem key={machine.machineId} value={machine.machineId.toString()}>
                                            {machine.machineName}
                                        </SelectItem>
                                    ))
                                )}
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
                                    className="h-10 flex-1"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                            <Button 
                                variant="default" 
                                onClick={() => refetch()}
                                size="sm"
                                className="h-10 flex-1"
                            >
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {historyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex-shrink-0">
                    <div className="text-center text-red-600">
                        Lỗi khi tải dữ liệu: {historyError}
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center font-semibold text-gray-900 py-4 px-4 text-sm">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {historyLoading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {columns.map((_, colIndex) => (
                                                <TableCell key={colIndex} className="py-3 px-4">
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow 
                                            key={row.id} 
                                            data-state={row.getIsSelected() && "selected"}
                                            className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="text-center font-medium text-sm text-gray-700 py-3 px-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Search className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p>Không có dữ liệu</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-700">
                                Đã chọn {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} dòng
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => table.previousPage()} 
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 px-3"
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-gray-700 px-2">
                                    Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => table.nextPage()} 
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 px-3"
                                >
                                    Tiếp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
