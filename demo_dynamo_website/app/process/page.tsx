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

import { Process } from "@/lib/type"
import { mockProcesses } from "@/lib/dataDemo"
import EditProcessForm from "./component/editProcess"
import AddProcessForm from "./component/addNewProcess"

function formatSeconds(seconds: string): string {
    const total = parseInt(seconds)
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    return `${hours}h ${minutes}m`
}

function getColumns({
    setEditingProcess,
    setShowForm,
}: {
    setEditingProcess: (process: Process) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<Process>[] {
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
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>STT <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "ma_ban_ve",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Mã Bản Vẽ <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("ma_ban_ve")}</div>,
        },
        {
            accessorKey: "dnc",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>DNC <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("dnc")}</div>,
        },
        {
            accessorKey: "tgdk",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Thời Gian ĐK <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{formatSeconds(row.getValue("tgdk"))}</div>,
        },
        {
            accessorKey: "snc",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>SNC <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("snc")}</div>,
        },
        {
            accessorKey: "ttnc",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>TTNC <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("ttnc")}</div>,
        },
        {
            accessorKey: "trang_thai",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Trạng Thái <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => {
                const status = String(row.getValue("trang_thai")).toLowerCase()
                return status === "hoàn thành" ? (
                    <span className="bg-[#E7F7EF] text-[#0CAF60] px-4 py-1 rounded-md capitalize">{status}</span>
                ) : (
                    <span className="bg-[#FFE6E6] text-[#FE4A4A] px-4 py-1 rounded-md capitalize">{status}</span>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const process = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Xóa</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingProcess(process)
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

export default function ProcessTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [editingProcess, setEditingProcess] = useState<Process | null>(null)

    const columns = getColumns({ setEditingProcess, setShowForm })

    const table = useReactTable({
        data: mockProcesses,
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
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Danh Sách Quy Trình</p>
                </div>
                <div className="w-1/3 flex items-center gap-5">
                    {/* <Input
                        placeholder="Tìm kiếm"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm !text-[20px]"
                    /> */}
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>
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
                    if (!open) setEditingProcess(null)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingProcess ? "Chỉnh sửa quy trình" : "Thêm quy trình mới"}</DialogTitle>
                    </DialogHeader>

                    {editingProcess ? (
                        <EditProcessForm
                            initialData={editingProcess}
                            onUpdate={(updated) => {
                                const index = mockProcesses.findIndex((p) => p.id === updated.id)
                                if (index !== -1) mockProcesses[index] = updated
                                table.setOptions((prev) => ({ ...prev, data: [...mockProcesses] }))
                                setShowForm(false)
                                setEditingProcess(null)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingProcess(null)
                            }}
                        />
                    ) : (
                        <AddProcessForm
                            onAdd={(newProcess) => {
                                mockProcesses.push(newProcess)
                                table.setOptions((prev) => ({ ...prev, data: [...mockProcesses] }))
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
