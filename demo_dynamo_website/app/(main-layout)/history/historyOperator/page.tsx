"use client"

import React, { useState } from "react"
import { 
    ColumnDef, 
    ColumnFiltersState, 
    SortingState, 
    VisibilityState, 
    flexRender, 
    getCoreRowModel, 
    getFilteredRowModel, 
    getPaginationRowModel, 
    getSortedRowModel, 
    useReactTable 
} from "@tanstack/react-table"
import { format } from "date-fns"
import { Search, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { useStaff } from "@/hooks/useStaff"
import { useDrawingCodeProcessHistory } from "@/hooks/useDrawingCodeProcessHistory"
import { DrawingCodeProcessHistory } from "@/lib/type"

const columns: ColumnDef<DrawingCodeProcessHistory>[] = [
    {
        accessorKey: "createdDate",
        header: "Thời Gian Ghi Nhận",
        cell: ({ row }) => {
            const createdDate = row.getValue("createdDate") as string
            return <div className="font-medium">{format(new Date(createdDate), "dd/MM/yyyy HH:mm")}</div>
        },
    },
    {
        accessorKey: "orderDetailDto.orderCode",
        header: "Mã Đơn Hàng",
        cell: ({ row }) => {
            const orderCode = row.original.orderDetailDto?.orderCode
            return <Badge variant="outline">{orderCode}</Badge>
        },
    },
    {
        accessorKey: "processType",
        header: "Loại Quy Trình",
        cell: ({ row }) => {
            const processType = row.getValue("processType") as string
            return <div className="font-mono text-sm">{processType}</div>
        },
    },
    {
        accessorKey: "machineDto.machineName",
        header: "Máy",
        cell: ({ row }) => {
            const machineName = row.original.machineDto?.machineName
            return <div>{machineName}</div>
        },
    },
    {
        accessorKey: "staffDtos",
        header: "Nhân Viên",
        cell: ({ row }) => {
            const staffList = row.original.staffDtos || []
            return (
                <div className="font-medium">
                    {staffList.map((staff: any, index: number) => (
                        <span key={index}>
                            {staff.staffName}
                            {index < staffList.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "stepNumber",
        header: "Bước",
        cell: ({ row }) => {
            const stepNumber = row.getValue("stepNumber") as number
            return <Badge variant="secondary">Bước {stepNumber}</Badge>
        },
    },
    {
        accessorKey: "startTime",
        header: "Thời Gian Bắt Đầu",
        cell: ({ row }) => {
            const startTime = row.getValue("startTime") as string
            return <div>{format(new Date(startTime), "dd/MM/yyyy HH:mm")}</div>
        },
    },
    {
        accessorKey: "endTime",
        header: "Thời Gian Kết Thúc",
        cell: ({ row }) => {
            const endTime = row.getValue("endTime") as string
            return (
                <div>
                    {endTime ? format(new Date(endTime), "dd/MM/yyyy HH:mm") : "Đang thực hiện"}
                </div>
            )
        },
    },
    {
        accessorKey: "processStatus",
        header: "Trạng Thái",
        cell: ({ row }) => {
            const status = row.getValue("processStatus") as number
            return (
                <Badge variant={status === 1 ? "default" : "destructive"}>
                    {status === 1 ? "Hoàn thành" : "Lỗi"}
                </Badge>
            )
        },
    },
]

export default function HistoryOperatorPage() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    
    // Filter states
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)

    // Format dates for API
    const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : null
    const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : null

    // Data hooks
    const { data: staffList, loading: staffLoading, error: staffError } = useStaff()
    const { data: processHistory, loading: processLoading, error: processError } = useDrawingCodeProcessHistory(
        selectedStaffId, 
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
        setSelectedStaffId(null)
        setStartDate(undefined)
        setEndDate(undefined)
    }

    const handleStaffSelect = (value: string) => {
        if (value === "all") {
            setSelectedStaffId(null)
        } else {
            setSelectedStaffId(value)
        }
    }

    const hasFilters = selectedStaffId || startDate || endDate

    if (staffError) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-red-600">Lỗi khi tải danh sách nhân viên</p>
                    <p className="text-gray-500 text-sm mt-1">{staffError}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col p-4 bg-gray-50">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 flex-shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Lịch Sử Quy Trình Nhân Viên</h1>
                    
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
                                    onSelect={(range: any) => {
                                        setStartDate(range?.from)
                                        setEndDate(range?.to)
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Staff Selection */}
                    <div className="w-full xl:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nhân viên</label>
                        <Select value={selectedStaffId || "all"} onValueChange={(value) => handleStaffSelect(value)}>
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                                <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <span className="font-medium">Tất cả nhân viên</span>
                                </SelectItem>
                                {staffLoading ? (
                                    <div className="p-2">
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ) : (
                                    staffList.map((staff: any) => (
                                        <SelectItem key={staff.id} value={staff.id}>
                                            {staff.staffName}
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
                                size="sm"
                                className="h-10 flex-1"
                            >
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Lịch Sử Quy Trình</h2>
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                            {processHistory.length} bản ghi
                        </div>
                    </div>
                    {processHistory.length > 0 && (
                        <div className="text-sm text-gray-500">
                            Hiển thị {table.getFilteredRowModel().rows.length} / {processHistory.length} bản ghi
                        </div>
                    )}
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto">
                    {processLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    ) : processHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Search className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có dữ liệu</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                {selectedStaffId ? 
                                    "Không tìm thấy lịch sử quy trình cho nhân viên này trong khoảng thời gian đã chọn." :
                                    "Vui lòng chọn nhân viên để xem lịch sử quy trình."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                            {headerGroup.headers.map((header) => (
                                                <TableHead 
                                                    key={header.id} 
                                                    className="bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wide py-3 px-4 border-r border-gray-200 last:border-r-0"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow 
                                                key={row.id} 
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell 
                                                        key={cell.id} 
                                                        className="py-3 px-4 border-b border-gray-100 text-sm"
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell 
                                                colSpan={columns.length} 
                                                className="h-24 text-center text-gray-500"
                                            >
                                                Không có kết quả phù hợp với bộ lọc.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
