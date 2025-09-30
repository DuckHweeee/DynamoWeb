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

import { DrawingCode, Order } from "@/lib/type"
import { useOrder } from "../hooks/useOrder"
import EditOrderForm from "../components/editOrder"
import AddOrderForm from "../components/addOrder"
import { ImportDialog } from "@/components/ImportDialog"
import { toast } from "sonner"

function getColumns({
    setEditingOrder,
    setShowForm,
}: {
    setEditingOrder: (order: Order) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<Order>[] {
    return [
        {
            id: "stt",
            header: () => (<span className="text-lg font-bold ">STT</span>),
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "poNumber",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số PO
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("poNumber")}</div>,
        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Ngày Thêm
                    <ArrowUpDown />
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
                <Button
                    className="cursor-pointer text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng Thái
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>()
                const isWorking = value === 1
                return (
                    <div className="flex justify-center">
                        <div
                            className={`px-4 py-1.5 rounded-sm text-center capitalize
        ${isWorking ? "bg-[#E7F7EF] text-[#0CAF60]" : "bg-[#FFE6E6] text-[#FE4A4A]"}`}
                        >
                            {isWorking ? "Còn hiệu lực" : "Hết hiệu lực"}
                        </div>
                    </div>
                )
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const drawing = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-lg cursor-pointer pr-6"
                                onClick={() => {
                                    setEditingOrder(drawing)
                                    setShowForm(true)
                                }}
                            >
                                Chỉnh sửa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}

export default function DrawingCodeTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    // Order Data
    const { data: order } = useOrder()

    const [showForm, setShowForm] = useState(false)
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)
    const [showImportDialog, setShowImportDialog] = useState(false)

    const handleImportSuccess = () => {
        toast.success("Import thành công!")
        window.location.reload()
    }

    const columns = getColumns({ setEditingOrder, setShowForm })

    const table = useReactTable({
        data: order,
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

    return (
        <>
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Danh Sách Đơn Hàng</p>
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

                    <Button
                        variant="secondary" size="icon" className="px-10 py-6 bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
                        onClick={() => setShowForm(true)}>
                        <Plus size={60} strokeWidth={5} color="white" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="px-10 py-6 bg-green-600 hover:bg-green-700 cursor-pointer text-white hover:text-white"
                        onClick={() => setShowImportDialog(true)}
                    >
                        <Upload size={60} strokeWidth={4} color="white" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-lg font-bold">
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
                                        <TableCell key={cell.id} className="text-center font-medium text-[16px] text-[#888888]">
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

            <Dialog
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open)
                    if (!open) setEditingOrder(null)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl">{editingOrder ? "Chỉnh sửa bản vẽ" : "Thêm bản vẽ mới"}</DialogTitle>
                    </DialogHeader>

                    {editingOrder ? (
                        <EditOrderForm
                            initialData={editingOrder}
                            onUpdate={(updated) => {
                                const index = order.findIndex((d) => d.orderId === updated.orderId)
                                if (index !== -1) order[index] = updated
                                table.setOptions((prev) => ({ ...prev, data: [...order] }))
                                setShowForm(false)
                                setEditingOrder(null)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingOrder(null)
                            }}
                        />
                    ) : (
                        <AddOrderForm
                            onAdd={(newDrawing) => {
                                order.push(newDrawing)
                                table.setOptions((prev) => ({ ...prev, data: [...order] }))
                                setShowForm(false)
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <ImportDialog
                isOpen={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                onImportSuccess={handleImportSuccess}
                endpoint="order/upload"
                title="Tải Đơn Hàng từ Excel"
                description="Chọn file Excel để tải danh sách đơn hàng"
            />

            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} dòng được chọn.
                </div> */}
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Trước
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Tiếp
                    </Button>
                </div>
            </div>
            {/* </div> */}
        </>
    )
}
