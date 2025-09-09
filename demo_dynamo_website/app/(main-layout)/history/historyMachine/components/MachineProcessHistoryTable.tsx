"use client"

import React, { useState } from "react"
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
import { ArrowUpDown, Search, Calendar, X, RefreshCw } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Modal, ModalHeader, ModalContent, ModalTitle } from "@/components/ui/modal"
import { DrawingCodeProcessHistory } from "@/lib/type"
import { useMachineProcessHistory } from "@/hooks/useMachineProcessHistory"

interface MachineProcessHistoryTableProps {
    isOpen: boolean
    onClose: () => void
    machineId: string
    machineName: string
}

function formatTime(timeString: string): string {
    try {
        const date = new Date(timeString)
        return format(date, "dd/MM/yyyy HH:mm")
    } catch {
        return "N/A"
    }
}

const MachineProcessHistoryTable: React.FC<MachineProcessHistoryTableProps> = ({
    isOpen,
    onClose,
    machineId,
    machineName
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    // Format dates for API
    const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : null
    const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : null

    // Fetch machine process history data
    const { data: processHistory, loading, error, refetch } = useMachineProcessHistory(
        machineId,
        startDateString,
        endDateString
    )

    const columns: ColumnDef<DrawingCodeProcessHistory>[] = [
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button 
                    variant="ghost" 
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 hover:bg-transparent text-xs"
                >
                    <span className="font-semibold">Thời Gian</span>
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium text-xs">
                    {formatTime(row.getValue("createdDate"))}
                </div>
            ),
            size: 130,
        },
        {
            accessorKey: "orderDetailDto.orderCode",
            header: () => <div className="font-semibold text-xs">Mã Đơn</div>,
            cell: ({ row }) => (
                <Badge variant="outline" className="text-xs px-2 py-1">
                    {row.original.orderDetailDto?.orderCode || "N/A"}
                </Badge>
            ),
            size: 100,
        },
        {
            accessorKey: "processType",
            header: () => <div className="font-semibold text-xs">Loại QT</div>,
            cell: ({ row }) => (
                <div className="font-medium text-xs">
                    {row.getValue("processType") || "N/A"}
                </div>
            ),
            size: 80,
        },
        {
            accessorKey: "stepNumber",
            header: () => <div className="font-semibold text-xs">Bước</div>,
            cell: ({ row }) => (
                <div className="text-center text-xs">
                    {row.getValue("stepNumber")}
                </div>
            ),
            size: 50,
        },
        {
            accessorKey: "status",
            header: () => <div className="font-semibold text-xs">Trạng Thái</div>,
            cell: ({ row }) => {
                const rawStatus = row.getValue("status")
                console.log("Raw status value:", rawStatus, "Type:", typeof rawStatus)
                
                // Convert to number and handle different data types
                const status = Number(rawStatus)
                console.log("Converted status:", status)
                
                // Determine status text and variant
                let statusText = "Lỗi"
                let variant: "default" | "secondary" | "destructive" = "destructive"
                
                if (status === 1) {
                    statusText = "Hoàn thành"
                    variant = "default"
                } else if (status === 0) {
                    statusText = "Chờ xử lý"
                    variant = "secondary"
                }
                
                return (
                    <Badge variant={variant} className="text-xs px-2 py-1">
                        {statusText}
                    </Badge>
                )
            },
            size: 90,
        },
        {
            accessorKey: "startTime",
            header: () => <div className="font-semibold text-xs">TG Bắt Đầu</div>,
            cell: ({ row }) => (
                <div className="text-xs">
                    {formatTime(row.getValue("startTime"))}
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: "endTime",
            header: () => <div className="font-semibold text-xs">TG Kết Thúc</div>,
            cell: ({ row }) => {
                const endTime = row.getValue("endTime") as string
                return (
                    <div className="text-xs">
                        {endTime ? formatTime(endTime) : "Chưa kết thúc"}
                    </div>
                )
            },
            size: 120,
        },
    ]

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

    const handleRefresh = () => {
        refetch()
    }

    const clearFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
        setGlobalFilter("")
    }

    const hasFilters = startDate || endDate || globalFilter

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>
                    Lịch Sử Quy Trình - {machineName}
                </ModalTitle>
            </ModalHeader>

            <ModalContent>
                <div className="flex-1 flex flex-col gap-4 overflow-hidden px-6 py-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "justify-start text-left font-normal w-[140px]",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "dd/MM/yyyy") : "Từ ngày"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "justify-start text-left font-normal w-[140px]",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "dd/MM/yyyy") : "Đến ngày"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            {hasFilters && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Xóa bộ lọc
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                                Làm mới
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 border rounded-lg overflow-hidden min-h-0">
                        <div className="h-full overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} className="font-semibold text-gray-900 py-3 px-4 whitespace-nowrap">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        // Loading skeleton
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={index}>
                                                {columns.map((_, colIndex) => (
                                                    <TableCell key={colIndex} className="py-3">
                                                        <Skeleton className="h-4 w-full" />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow 
                                                key={row.id} 
                                                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="py-3 px-4 text-sm whitespace-nowrap">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Search className="h-8 w-8 text-gray-400" />
                                                    <p>
                                                        {error ? "Có lỗi xảy ra khi tải dữ liệu" : 
                                                         hasFilters ? "Không tìm thấy dữ liệu phù hợp" : 
                                                         "Chưa có lịch sử quy trình"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {table.getRowModel().rows?.length > 0 && (
                        <div className="flex items-center justify-between flex-shrink-0">
                            <div className="text-sm text-gray-700">
                                Hiển thị {table.getFilteredRowModel().rows.length} / {processHistory.length} bản ghi
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </ModalContent>
        </Modal>
    )
}

export default MachineProcessHistoryTable
