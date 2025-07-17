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
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"

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

import { DrawingCode } from "@/lib/type"
import { mockDrawingCodes } from "@/lib/dataDemo"
import EditDrawingCodeForm from "./component/editDrawingCode"
import AddDrawingCodeForm from "./component/addNewDrawingCode"

function getColumns({
    setEditingDrawing,
    setShowForm,
}: {
    setEditingDrawing: (drawing: DrawingCode) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<DrawingCode>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    STT
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "ma_ban_ve",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã Bản Vẽ
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("ma_ban_ve")}</div>,
        },
        {
            accessorKey: "dnc",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    DNC
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("dnc")}</div>,
        },
        {
            accessorKey: "trang_thai",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng Thái
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const trang_thai = String(row.getValue("trang_thai")).toLowerCase();
                return trang_thai === "hoàn thành" ? (
                    <span className="bg-[#E7F7EF] text-[#0CAF60] px-4 py-1 rounded-md capitalize">
                        {trang_thai}
                    </span>
                ) : (
                    <span className="bg-[#FFE6E6] text-[#FE4A4A] px-4 py-1 rounded-md capitalize">
                        {trang_thai}
                    </span>
                    // <span>{kpiValue}</span>
                )
                // < div > { row.getValue("trang_thai") }</>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const drawing = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                Xóa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingDrawing(drawing)
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

    const [showForm, setShowForm] = useState(false)
    const [editingDrawing, setEditingDrawing] = useState<DrawingCode | null>(null)

    const columns = getColumns({ setEditingDrawing, setShowForm })

    const table = useReactTable({
        data: mockDrawingCodes,
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
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            <div className="flex flex-row items-center justify-between py-4">
                <p className="text-2xl font-bold">Danh Sách Bản Vẽ</p>
                <div className="flex items-center gap-5">
                    <Input
                        placeholder="Tìm kiếm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm !text-[20px]"
                    />
                    <Button
                        variant="secondary"
                        size="icon"
                        className="px-10 py-5 bg-[#074695] hover:bg-[#0754B4]"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={60} strokeWidth={5} color="white" />
                    </Button>
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
                    if (!open) setEditingDrawing(null)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingDrawing ? "Chỉnh sửa bản vẽ" : "Thêm bản vẽ mới"}</DialogTitle>
                    </DialogHeader>

                    {editingDrawing ? (
                        <EditDrawingCodeForm
                            initialData={editingDrawing}
                            onUpdate={(updated) => {
                                const index = mockDrawingCodes.findIndex((d) => d.id === updated.id)
                                if (index !== -1) mockDrawingCodes[index] = updated
                                table.setOptions((prev) => ({ ...prev, data: [...mockDrawingCodes] }))
                                setShowForm(false)
                                setEditingDrawing(null)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingDrawing(null)
                            }}
                        />
                    ) : (
                        <AddDrawingCodeForm
                            onAdd={(newDrawing) => {
                                mockDrawingCodes.push(newDrawing)
                                table.setOptions((prev) => ({ ...prev, data: [...mockDrawingCodes] }))
                                setShowForm(false)
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} dòng được chọn.
                </div>
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
