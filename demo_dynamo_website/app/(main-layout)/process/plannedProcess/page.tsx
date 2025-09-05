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
import { mockProcesses } from "@/lib/dataDemo"
import AddProcessForm from "../components/addNewProcess"
import { usePlannedProcess } from "../hooks/usePlannedProcess"
import { Process } from "../lib/type"
import DetailProcess from "../components/detailProcess"
import EditProcessForm from "../components/editProcess"

function formatSeconds(seconds: string): string {
    const total = parseInt(seconds)
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    return `${hours}h ${minutes}m`
}

function getColumns({
    setEditingProcess,
    setShowForm,
    setDetailProcess,
    setOpenDetail
}: {
    setEditingProcess: (process: Process) => void
    setShowForm: (show: boolean) => void
    setDetailProcess: (process: Process) => void
    setOpenDetail: (show: boolean) => void
}): ColumnDef<Process>[] {
    return [
        {
            accessorKey: "processType",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Đối tượng gia công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("processType")}</div>,
        },
        {
            accessorKey: "orderDetailDto.orderCode",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Mã hàng <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>
                <div>{row.original.orderDetailDto?.orderCode ?? "—"}</div></div>,
        },
        {
            accessorKey: "partNumber",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Số nguyên công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("partNumber")}</div>,
        },
        {
            accessorKey: "stepNumber",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Thứ tự nguyên công<ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("stepNumber")}</div>,
        },
        {
            accessorKey: "manufacturingPoint",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Điểm nguyên công <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("manufacturingPoint")}</div>,
        },
        {
            accessorKey: "pgTime",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Giờ PG <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div>{row.getValue("pgTime")}</div>,
        },
        {
            accessorKey: "processStatus",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Trạng Thái <ArrowUpDown /></Button>
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
        {
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}

export default function PlannedProcessTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    // PlannedProcess Data
    const { data: process } = usePlannedProcess()

    const [showForm, setShowForm] = useState(false)
    const [editingProcess, setEditingProcess] = useState<Process | null>(null)

    // Detail
    const [detailProcess, setDetailProcess] = useState<Process | null>(null)
    const [openDetail, setOpenDetail] = useState(false);


    const columns = getColumns({
        setEditingProcess,
        setShowForm,
        setDetailProcess,
        setOpenDetail
    })

    const table = useReactTable({
        data: process,
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
        <div className="m-1 bg-white rounded-[10px]">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Quản lý kế hoạch gia công</p>
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
                    if (!open) setEditingProcess(null)
                }}
            >
                <DialogContent className="!max-w-5xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl">{editingProcess ? "Chỉnh sửa kế hoạch" : "Thêm kế hoạch mới"}</DialogTitle>
                    </DialogHeader>

                    {editingProcess ? (
                        <EditProcessForm
                            initialData={editingProcess}
                            onUpdate={(updated) => {
                                const index = process.findIndex((p) => p.processId === updated.processId)
                                if (index !== -1) process[index] = updated
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
                                process.push(newProcess)
                                table.setOptions((prev) => ({ ...prev, data: [...process] }))
                                setShowForm(false)
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <DetailProcess openDetail={openDetail} onClose={() => setOpenDetail(false)} process={detailProcess} />

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
