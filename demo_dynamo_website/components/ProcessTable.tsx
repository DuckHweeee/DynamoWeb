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
import { ArrowUpDown, MoreHorizontal, Plus, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Process } from "@/app/(main-layout)/process/lib/type"
import { ImportButton } from "@/components/ImportButton"
import { toast } from "sonner"

function formatSeconds(seconds: string): string {
    const total = parseInt(seconds)
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    return `${hours}h ${minutes}m`
}

interface ProcessTableProps<T = any> {
    data: T[]
    loading?: boolean
    error?: string | null
    title: string
    showAddButton?: boolean
    showActions?: boolean
    showViewHistory?: boolean
    showImportButton?: boolean
    onImportSuccess?: () => void
    AddComponent?: React.ComponentType<{
        onAdd: (newProcess: T) => void
        onCancel: () => void
    }>
    EditComponent?: React.ComponentType<{
        initialData: T
        onUpdate: (updated: T) => void
        onCancel: () => void
    }>
    DetailComponent?: React.ComponentType<{
        openDetail: boolean
        onClose: () => void
        process: T | null
    }>
    onViewHistory?: (process: T) => void
    customColumns?: ColumnDef<T>[]
}

function getDefaultColumns<T = any>({
    setEditingProcess,
    setShowForm,
    setDetailProcess,
    setOpenDetail,
    showActions = true,
    onViewHistory
}: {
    setEditingProcess: (process: T) => void
    setShowForm: (show: boolean) => void
    setDetailProcess: (process: T) => void
    setOpenDetail: (show: boolean) => void
    showActions?: boolean
    onViewHistory?: (process: T) => void
}): ColumnDef<T>[] {
    const columns: ColumnDef<T>[] = [
        {
            accessorKey: "processType" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Đối tượng gia công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("processType")}</div>,
        },
        {
            accessorKey: "orderDetailDto.orderCode" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã hàng <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{(row.original as any).orderDetailDto?.orderCode ?? "—"}</div>,
        },
        {
            accessorKey: "partNumber" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số nguyên công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("partNumber")}</div>,
        },
        {
            accessorKey: "stepNumber" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Thứ tự nguyên công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("stepNumber")}</div>,
        },
        {
            accessorKey: "manufacturingPoint" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Điểm nguyên công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("manufacturingPoint")}</div>,
        },
        {
            accessorKey: "pgTime" as keyof T,
            header: ({ column }) => (
                <Button className="text-bas e font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Giờ PG <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("pgTime")}</div>,
        },
        {
            accessorKey: "processStatus" as keyof T,
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng Thái <ArrowUpDown />
                </Button>
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>()
                const isWorking = value === 2
                return (
                    <div className="flex justify-center">
                        <div
                            className={`px-4 py-1.5 rounded-sm text-center capitalize
                                ${isWorking ? "bg-[#E7F7EF] text-[#0CAF60]" : "bg-[#FFF7E0] text-[#E6A700]"}`}
                        >
                            {isWorking ? "Đang thực hiện" : "Đang chờ"}
                        </div>
                    </div>
                )
            },
        },
    ]

    // Add actions column if needed
    if (showActions || onViewHistory) {
        columns.push({
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const process = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onViewHistory && (
                                <DropdownMenuItem
                                    className="text-lg cursor-pointer pr-6"
                                    onClick={() => onViewHistory(process)}
                                >
                                    Xem lịch sử
                                </DropdownMenuItem>
                            )}
                            {showActions && (
                                <>
                                    <DropdownMenuItem
                                        className="text-lg cursor-pointer pr-6"
                                        onClick={() => {
                                            setDetailProcess(process)
                                            setOpenDetail(true)
                                        }}
                                    >
                                        Xem chi tiết
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-lg cursor-pointer pr-6"
                                        onClick={() => {
                                            setEditingProcess(process)
                                            setShowForm(true)
                                        }}
                                    >
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        })
    }

    return columns
}

export default function ProcessTable<T = any>({
    data,
    loading = false,
    error = null,
    title,
    showAddButton = true,
    showActions = true,
    showViewHistory = false,
    showImportButton = true,
    onImportSuccess,
    AddComponent,
    EditComponent,
    DetailComponent,
    onViewHistory,
    customColumns
}: ProcessTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [editingProcess, setEditingProcess] = useState<T | null>(null)

    // Detail
    const [detailProcess, setDetailProcess] = useState<T | null>(null)
    const [openDetail, setOpenDetail] = useState(false)

    const handleImportSuccess = () => {
        if (onImportSuccess) {
            toast.success("Import thành công!")
            onImportSuccess()
        }
    }

    const columns = customColumns || getDefaultColumns({
        setEditingProcess,
        setShowForm,
        setDetailProcess,
        setOpenDetail,
        showActions,
        onViewHistory
    })

    const table = useReactTable({
        data: data || [],
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

    if (loading) {
        return (
            <div className="m-1 bg-white rounded-[10px] p-8">
                <div className="text-center">Đang tải...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="m-1 bg-white rounded-[10px] p-8">
                <div className="text-center text-red-500">Lỗi: {error}</div>
            </div>
        )
    }

    return (
        <div className="m-1 bg-white rounded-[10px]">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">{title}</p>
                </div>
                <div className="w-1/3 flex flex-row justify-end-safe items-center gap-1">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10 py-5"
                        />
                    </div>

                    {showImportButton && (
                        <ImportButton
                            endpoint="process/upload"
                            title="Import Quy Trình"
                            description="Chọn file Excel để import quy trình"
                            onImportSuccess={handleImportSuccess}
                            variant="outline"
                            size="lg"
                            className="px-4 py-6 bg-green-600 hover:bg-green-700 cursor-pointer text-white hover:text-white"
                        />
                    )}

                    {showAddButton && (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="px-10 py-6 bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={60} strokeWidth={5} color="white" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-xl font-bold">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center py-2">
                                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center font-medium text-[16px] text-[#888888] py-5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Form Dialog for Add/Edit */}
            {(AddComponent || EditComponent) && (
                <Dialog
                    open={showForm}
                    onOpenChange={(open) => {
                        setShowForm(open)
                        if (!open) setEditingProcess(null)
                    }}
                >
                    <DialogContent className="!max-w-5xl">
                        <DialogHeader>
                            <DialogTitle className="text-4xl">
                                {editingProcess ? "Chỉnh sửa quy trình" : "Thêm quy trình mới"}
                            </DialogTitle>
                        </DialogHeader>

                        {editingProcess && EditComponent ? (
                            <EditComponent
                                initialData={editingProcess}
                                onUpdate={(updated) => {
                                    const index = data.findIndex((p: any) => p.processId === (updated as any).processId)
                                    if (index !== -1) {
                                        const newData = [...data]
                                        newData[index] = updated
                                        table.setOptions((prev) => ({ ...prev, data: newData }))
                                    }
                                    setShowForm(false)
                                    setEditingProcess(null)
                                }}
                                onCancel={() => {
                                    setShowForm(false)
                                    setEditingProcess(null)
                                }}
                            />
                        ) : AddComponent ? (
                            <AddComponent
                                onAdd={(newProcess) => {
                                    const newData = [...data, newProcess]
                                    table.setOptions((prev) => ({ ...prev, data: newData }))
                                    setShowForm(false)
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        ) : null}
                    </DialogContent>
                </Dialog>
            )}

            {/* Detail Dialog */}
            {DetailComponent && (
                <DetailComponent
                    openDetail={openDetail}
                    onClose={() => setOpenDetail(false)}
                    process={detailProcess}
                />
            )}

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Trước
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Tiếp
                    </Button>
                </div>
            </div>
        </div>
    )
}
