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
import { Machine2 } from "@/lib/type"
import { ImportDialog } from "@/components/ImportDialog"
import { toast } from "sonner"

interface MachineTableProps {
    data: Machine2[]
    loading?: boolean
    error?: string | null
    showAddButton?: boolean
    showActions?: boolean
    title?: string
    onAdd?: () => void
    onEdit?: (machine: Machine2) => void
    onDetail?: (machine: Machine2) => void
    onViewHistory?: (machineId: string, machineName: string) => void
    showViewHistory?: boolean
    onImportSuccess?: () => void
    showImportButton?: boolean
    AddComponent?: React.ComponentType<{
        onAdd: (machine: Machine2) => void
        onCancel: () => void
    }>
    EditComponent?: React.ComponentType<{
        machineId: number
        onUpdate: (machine: Machine2) => void
        onCancel: () => void
    }>
    DetailComponent?: React.ComponentType<{
        machine: Machine2
        onCancel: () => void
    }>
}

function getColumns({
    setEditingMachine,
    setShowForm,
    setDetailMachine,
    setShowDetail,
    showActions = true,
    showViewHistory = false,
    onDetail,
    onEdit,
    onViewHistory,
}: {
    setEditingMachine: (machine: Machine2) => void
    setDetailMachine: (machine: Machine2) => void
    setShowForm: (show: boolean) => void
    setShowDetail: (show: boolean) => void
    showActions?: boolean
    showViewHistory?: boolean
    onDetail?: (machine: Machine2) => void
    onEdit?: (machine: Machine2) => void
    onViewHistory?: (machineId: string, machineName: string) => void
}): ColumnDef<Machine2>[] {
    const baseColumns: ColumnDef<Machine2>[] = [
        {
            id: "stt",
            header: () => (<span className="text-lg font-bold ">STT</span>),
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "machineName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên Máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineName")}</div>,
        },
        {
            accessorKey: "machineType",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Loại Máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineType")}</div>,
        },
        {
            accessorKey: "machineWork",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Công Việc <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineWork")}</div>,
        },
        {
            accessorKey: "machineOffice",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Phòng quản lý <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineOffice")}</div>,
        },
        {
            accessorKey: "machineKpiDtos.groupName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.original.machineKpiDtos?.groupName ?? "Chưa Có Nhóm"}</div>,
        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ngày thêm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = row.getValue("createdDate") as string
                const date = value ? new Date(value) : null
                const formatted = date
                    ? date.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : ""
                return <div>{formatted}</div>
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng thái <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.getValue("status") as number
                const isRunning = status === 1

                return (
                    <div
                        className={`w-full px-4 py-1 rounded-sm text-center capitalize
                  ${isRunning
                                ? "bg-[#E7F7EF] text-[#0CAF60]"
                                : "bg-gray-300 text-white"}`}
                    >
                        {isRunning ? "Đang chạy" : "Đang dừng"}
                    </div>
                )
            },
        },
    ]

    // Add actions column if needed
    if (showActions || showViewHistory) {
        baseColumns.push({
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const machine = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {showViewHistory && onViewHistory && (
                                <DropdownMenuItem
                                    className="text-lg cursor-pointer pr-6"
                                    onClick={() => onViewHistory(machine.machineId.toString(), machine.machineName)}
                                >
                                    Xem lịch sử
                                </DropdownMenuItem>
                            )}
                            {showActions && (
                                <>
                                    <DropdownMenuItem
                                        className="text-lg cursor-pointer pr-6"
                                        onClick={() => {
                                            if (onDetail) {
                                                onDetail(machine)
                                            } else {
                                                setDetailMachine(machine)
                                                setShowDetail(true)
                                            }
                                        }}
                                    >
                                        Thông tin chi tiết
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-lg cursor-pointer pr-6"
                                        onClick={() => {
                                            if (onEdit) {
                                                onEdit(machine)
                                            } else {
                                                setEditingMachine(machine)
                                                setShowForm(true)
                                            }
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

    return baseColumns
}

export function MachineTable({
    data,
    loading = false,
    error = null,
    showAddButton = true,
    showActions = true,
    showViewHistory = false,
    showImportButton = true,
    title = "Hiện Trạng Máy Móc",
    onAdd,
    onEdit,
    onDetail,
    onViewHistory,
    onImportSuccess,
    AddComponent,
    EditComponent,
    DetailComponent,
}: MachineTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [editingMachine, setEditingMachine] = useState<Machine2 | null>(null)
    const [detailMachine, setDetailMachine] = useState<Machine2 | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)

    const columns = getColumns({
        setEditingMachine,
        setShowForm,
        setDetailMachine,
        setShowDetail,
        showActions,
        showViewHistory,
        onDetail,
        onEdit,
        onViewHistory,
    })

    const table = useReactTable({
        data,
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

    const handleAdd = () => {
        if (onAdd) {
            onAdd()
        } else {
            setShowForm(true)
        }
    }

    const handleImportSuccess = () => {
        if (onImportSuccess) {
            toast.success("Thêm mới thành công!");
            onImportSuccess()
        }
    }

    return (
        <div className="bg-white rounded-[10px] px-6 mx-2 h-screen">
            <div className="flex flex-row items-center justify-between py-4 bg-white">
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

                    {showAddButton && (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="px-10 py-6 bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
                            onClick={handleAdd}
                        >
                            <Plus size={60} strokeWidth={5} color="white" />
                        </Button>
                    )}

                    {showImportButton && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-4 py-6 bg-green-600 hover:bg-green-700 cursor-pointer text-white hover:text-white"
                            onClick={() => setShowImportDialog(true)}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Tải Excel
                        </Button>
                    )}

                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-lg font-bold">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
                                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
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
                                        <TableCell key={colIndex} className="text-center py-3 px-4">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : error ? (
                            // Error state
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p className="font-medium">Lỗi tải dữ liệu</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center font-medium text-[16px] text-[#393939]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog for Add/Edit with custom components */}
            {(AddComponent || EditComponent) && (
                <Dialog
                    open={showForm}
                    onOpenChange={(open) => {
                        setShowForm(open)
                        if (!open) setEditingMachine(null)
                    }}
                >
                    <DialogContent className="w-full max-[1550px]:!max-w-6xl min-[1550px]:!max-w-6xl !gap-5 pb-3">
                        <DialogHeader>
                            <DialogTitle className="text-3xl text-[#084188] font-semibold">
                                {editingMachine ? "Chỉnh sửa máy" : "Thêm máy mới"}
                            </DialogTitle>
                        </DialogHeader>

                        {editingMachine && EditComponent ? (
                            <EditComponent
                                machineId={editingMachine.machineId}
                                onUpdate={(updated) => {
                                    // This would be handled by parent component
                                    setShowForm(false)
                                    setEditingMachine(null)
                                }}
                                onCancel={() => {
                                    setShowForm(false)
                                    setEditingMachine(null)
                                }}
                            />
                        ) : AddComponent ? (
                            <AddComponent
                                onAdd={(newMachine) => {
                                    // This would be handled by parent component
                                    setShowForm(false)
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        ) : null}
                    </DialogContent>
                </Dialog>
            )}

            {/* Dialog for Detail with custom component */}
            {DetailComponent && (
                <Dialog
                    open={showDetail}
                    onOpenChange={(open) => {
                        setShowDetail(open)
                        if (!open) setDetailMachine(null)
                    }}
                >
                    <DialogContent className="w-full max-[1550px]:!max-w-6xl min-[1550px]:!max-w-7xl !gap-5 pb-3 min-[1550px]:top-100">
                        <DialogHeader>
                            <DialogTitle className="text-3xl text-[#084188] font-semibold">
                                Thông tin chi tiết máy
                            </DialogTitle>
                        </DialogHeader>
                        {detailMachine && (
                            <DetailComponent
                                machine={detailMachine}
                                onCancel={() => {
                                    setShowDetail(false)
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Import Dialog */}
            <ImportDialog
                isOpen={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                onImportSuccess={handleImportSuccess}
                endpoint="machine/upload"
                title="Import dữ liệu máy móc"
                description="Chọn file Excel để import dữ liệu máy móc vào hệ thống"
            />

            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div> */}
                <div className="space-x-2">
                    <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Trước
                    </Button>
                    <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    )
}
