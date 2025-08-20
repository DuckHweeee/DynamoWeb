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

import { Machine, Machine2 } from "@/lib/type"
import { mockMachines } from "@/lib/dataDemo"
import EditMachineForm from "../component/editMachine"
import AddMachineForm from "../component/addNewMachine"
import { useMachine } from "../hooks/useMachine"

function getColumns({
    setEditingMachine,
    setShowForm,
}: {
    setEditingMachine: (machine: Machine2) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<Machine2>[] {
    return [
        {
            id: "stt",
            header: () => (<span className="text-lg font-bold ">STT</span>),
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "machineName",
            header: ({ column }) => (
                <Button className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên Máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineName")}</div>,
        },
        {
            accessorKey: "machineType",
            header: ({ column }) => (
                <Button className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Loại Máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineType")}</div>,
        },
        {
            accessorKey: "machineWork",
            header: ({ column }) => (
                <Button className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineWork")}</div>,
        },
        {
            accessorKey: "machineOffice",
            header: ({ column }) => (
                <Button className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Phòng quản lý <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineOffice")}</div>,
        },
        {
            accessorKey: "machineKpiDtos.groupName",
            header: ({ column }) => (
                <Button className="text-lg font-bold" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.original.machineKpiDtos?.groupName ?? "Chưa Có Nhóm"}</div>,

        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold"
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
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as number
                const isRunning = status === 1

                return (
                    <div
                        className={`w-full px-4 py-1 rounded-sm text-center capitalize
                  ${isRunning
                                ? "bg-[#E7F7EF] text-[#0CAF60]"
                                : "bg-gray-400 text-white"}`}
                    >
                        {isRunning ? "Đang chạy" : "Đang dừng"}
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const machine = row.original
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
                                    setEditingMachine(machine)
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

export default function MachineTable() {
    // Staff Data
    const { data: machine } = useMachine()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [editingMachine, setEditingMachine] = useState<Machine2 | null>(null)

    const columns = getColumns({ setEditingMachine, setShowForm })

    const table = useReactTable({
        data: machine,
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
                    <p className="text-2xl font-bold">Hiện Trạng Máy Móc</p>
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
                                    No results.
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
                    if (!open) setEditingMachine(null)
                }}
            >
                <DialogContent className="w-full max-[1550px]:!max-w-6xl min-[1550px]:!max-w-7xl !gap-5 pb-3">
                    <DialogHeader>
                        <DialogTitle>{editingMachine ? "Chỉnh sửa máy" : "Thêm máy mới"}</DialogTitle>
                    </DialogHeader>

                    {editingMachine ? (
                        <EditMachineForm
                            initialData={editingMachine}
                            onUpdate={(updated) => {
                                const index = machine.findIndex((m) => m.machineId === updated.machineId)
                                if (index !== -1) machine[index] = updated
                                table.setOptions((prev) => ({ ...prev, data: [...machine] }))
                                setShowForm(false)
                                setEditingMachine(null)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingMachine(null)
                            }}
                        />
                    ) : (
                        <AddMachineForm
                            onAdd={(newMachine) => {
                                machine.push(newMachine)
                                table.setOptions((prev) => ({ ...prev, data: [...machine] }))
                                setShowForm(false)
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
