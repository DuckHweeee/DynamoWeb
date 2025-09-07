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
import { ArrowUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useState } from "react"
import { Process2 } from "@/lib/type"
import { useProcess } from "@/hooks/useProcess"
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
function formatSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

const columns: ColumnDef<Process2>[] = [
    {
        accessorKey: "orderDetailDto.orderCode",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-auto p-0 hover:bg-transparent">
                <span className="font-semibold">Mã Đơn Hàng</span>
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
        accessorKey: "stepNumber",
        header: () => <div className="font-semibold">Bước</div>,
        cell: ({ row }) => (
            <div className="text-center font-medium">
                Bước {row.getValue("stepNumber")}
            </div>
        ),
    },
    {
        accessorKey: "processType",
        header: () => <div className="font-semibold">Loại Quy Trình</div>,
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.getValue("processType")}
            </Badge>
        ),
    },
    {
        accessorKey: "processStatus",
        header: () => <div className="font-semibold">Trạng Thái</div>,
        cell: ({ row }) => {
            const status = row.getValue("processStatus") as number
            return (
                <Badge variant={status === 1 ? "default" : status === 0 ? "secondary" : "destructive"}>
                    {status === 1 ? "Hoàn thành" : status === 0 ? "Chờ xử lý" : "Lỗi"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "machineDto.machineName",
        header: () => <div className="font-semibold">Máy</div>,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.machineDto?.machineName || "Chưa gán"}
            </div>
        ),
    },
    {
        accessorKey: "pgTime",
        header: () => <div className="font-semibold">Thời Gian PG</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {formatSeconds(row.getValue("pgTime") as number)}
            </div>
        ),
    },
]

export default function HistoryProcessPage() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [date, setDate] = useState<DateRange | undefined>()
    const [selectedGroup, setSelectedGroup] = useState<string>("")
    const [selectedDrawing, setSelectedDrawing] = useState<string>("")

    // Fetch data using useProcess hook
    const { data: processData, loading, error, refetch } = useProcess()

    const table = useReactTable({
        data: processData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    const clearFilters = () => {
        setDate(undefined)
        setSelectedGroup("")
        setSelectedDrawing("")
        setGlobalFilter("")
    }

    const hasFilters = date || selectedGroup || selectedDrawing || globalFilter
    return (
        <div className="h-screen flex flex-col p-4 bg-gray-50">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 flex-shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Lịch Sử Quy Trình</h1>
                    
                    {/* Search Input */}
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
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

                    {/* Group Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm</label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                                <SelectValue placeholder="Chọn nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả nhóm</SelectItem>
                                <SelectItem value="group1">Nhóm 1</SelectItem>
                                <SelectItem value="group2">Nhóm 2</SelectItem>
                                <SelectItem value="group3">Nhóm 3</SelectItem>
                                <SelectItem value="group4">Nhóm 4</SelectItem>
                                <SelectItem value="group5">Nhóm 5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Drawing History Filter */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử bản vẽ</label>
                        <Select value={selectedDrawing} onValueChange={setSelectedDrawing}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                                <SelectValue placeholder="Chọn bản vẽ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả bản vẽ</SelectItem>
                                <SelectItem value="ac001">AC001</SelectItem>
                                <SelectItem value="ac002">AC002</SelectItem>
                                <SelectItem value="ac003">AC003</SelectItem>
                                <SelectItem value="ac004">AC004</SelectItem>
                                <SelectItem value="ac005">AC005</SelectItem>
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
                                size="sm"
                                className="h-10 flex-1"
                                onClick={() => refetch()}
                                disabled={loading}
                            >
                                {loading ? "Đang tải..." : "Làm mới"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
                <div className="h-full flex flex-col">
                    {/* Table Header with Status */}
                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">Lịch Sử Quy Trình</h3>
                                <Badge variant="outline" className="text-sm">
                                    {loading ? "Đang tải..." : `${table.getFilteredRowModel().rows.length} bản ghi`}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Cập nhật lần cuối: {format(new Date(), "HH:mm:ss")}</span>
                            </div>
                        </div>
                    </div>

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
                                {loading ? (
                                    // Loading skeleton rows
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {columns.map((_, colIndex) => (
                                                <TableCell key={colIndex} className="text-center py-3 px-4">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : error ? (
                                    // Error state
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center text-red-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                    <Search className="w-6 h-6 text-red-400" />
                                                </div>
                                                <p className="font-medium">Lỗi tải dữ liệu</p>
                                                <p className="text-sm">{error}</p>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => refetch()}
                                                    className="mt-2"
                                                >
                                                    Thử lại
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
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
