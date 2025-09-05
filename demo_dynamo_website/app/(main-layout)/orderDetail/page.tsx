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
import { ArrowUpDown, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { OrderDetail } from "./lib/type"
import { useOrderDetail } from "./hooks/useOrderDetail"
import AddOrderDetailForm from "./components/addOrderDetail"
import EditOrderDetailForm from "./components/editOrderDetail"
import DetailOrderDetail from "./components/orderDetail"

function getColumns({
    setEditingOrderDetail,
    setShowForm,
    setDetailOrderDetail,
    setOpenDetail
}: {
    setEditingOrderDetail: (orderDetail: OrderDetail) => void
    setShowForm: (show: boolean) => void
    setDetailOrderDetail: (orderDetail: OrderDetail) => void
    setOpenDetail: (show: boolean) => void
}): ColumnDef<OrderDetail>[] {
    return [
        {
            accessorKey: "orderType",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Đối tượng gia công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("orderType")}</div>,
        },
        {
            accessorKey: "orderCode",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>ID Mã hàng <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>
                <div>{row.getValue("orderCode") ?? "—"}</div></div>,
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Số nguyên công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
        },
        {
            accessorKey: "managerGroupName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Thứ tự nguyên công<ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("managerGroupName")}</div>,
        },
        {
            accessorKey: "pgTimeGoal",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Điểm nguyên công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("pgTimeGoal")}</div>,
        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Giờ PG <ArrowUpDown /></Button>
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
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const orderDetail = row.original
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
                                    setDetailOrderDetail(orderDetail)
                                    setOpenDetail(true)
                                }}
                            >
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-lg cursor-pointer pr-6"
                                onClick={() => {
                                    setEditingOrderDetail(orderDetail)
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

export default function OrderDetailTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    // OrderDetail Data
    const { data: orderDetail } = useOrderDetail()


    const [showForm, setShowForm] = useState(false)
    const [editingOrderDetail, setEditingOrderDetail] = useState<OrderDetail | null>(null)

    // Detail
    const [detailOrderDetail, setDetailOrderDetail] = useState<OrderDetail | null>(null)
    const [openDetail, setOpenDetail] = useState(false);


    const columns = getColumns({
        setEditingOrderDetail,
        setShowForm,
        setDetailOrderDetail,
        setOpenDetail
    })

    const table = useReactTable({
        data: orderDetail,
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
        <div className="w-full">
            <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
                <div className="flex flex-row items-center justify-between py-4">
                    <div className="w-2/3">
                        <p className="text-2xl font-bold">Quản lý mã hàng gia công</p>
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
                        if (!open) setEditingOrderDetail(null)
                    }}
                >
                    <DialogContent className="!max-w-5xl">
                        <DialogHeader>
                            <DialogTitle className="text-4xl">{editingOrderDetail ? "Chỉnh sửa mã hàng gia công" : "Thêm mã hàng gia công"}</DialogTitle>
                        </DialogHeader>

                        {editingOrderDetail ? (
                            <EditOrderDetailForm
                                initialData={editingOrderDetail}
                                onUpdate={(updated) => {
                                    const index = orderDetail.findIndex((p) => p.orderDetailId === updated.orderDetailId)
                                    if (index !== -1) orderDetail[index] = updated
                                    setShowForm(false)
                                    setEditingOrderDetail(null)
                                }}
                                onCancel={() => {
                                    setShowForm(false)
                                    setEditingOrderDetail(null)
                                }}
                            />
                        ) : (
                            <AddOrderDetailForm
                                onAdd={(neworderDetail) => {
                                    orderDetail.push(neworderDetail)
                                    table.setOptions((prev) => ({ ...prev, data: [...orderDetail] }))
                                    setShowForm(false)
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
                <DetailOrderDetail openDetail={openDetail} onClose={() => setOpenDetail(false)} orderDetail={detailOrderDetail} />

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
        </div>
    )
}
