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
import { Operator2 } from "@/lib/type"
import { mockOperators, mockOperators2 } from "@/lib/dataDemo"
function formatSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

function getColumns({
    setEditingOperator,
    setShowForm,
}: {
    setEditingOperator: (operator: Operator2) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<Operator2>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên nhân viên <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div className="text-lg">{row.getValue("name")}</div>
                    <div className="text-sm text-muted-foreground font-normal uppercase">#{row.original.id}</div>
                </div>
            ),
        },
        {
            accessorKey: "gio_lam_viec",
            header: ({ column }) => (
                <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Giờ làm việc <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("gio_lam_viec"))}</div>,
        },
        {
            accessorKey: "so_nguyen_cong",
            header: ({ column }) => (
                <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số nguyên công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("so_nguyen_cong")}</div>,
        },
        {
            accessorKey: "diem_nguyen_cong",
            header: ({ column }) => (
                <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Điểm nguyên công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("diem_nguyen_cong")}</div>
            ),
        },
        {
            id: "kpi",
            header: ({ column }) => (
                <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    KPI
                </Button>
            ),
            cell: ({ row }) => {
                const diem = row.original.diem_nguyen_cong;
                const soCong = row.original.so_nguyen_cong;
                return <div className={diem >= soCong ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {diem >= soCong ? "Đạt" : "Không Đạt"}
                </div>;
            },
        },
    ]
}



export default function OperatorTable({ title, description }: { title: string; description: string }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")



    // Add new operator
    const [showForm, setShowForm] = useState(false)
    // Edit Operator
    const [editingOperator, setEditingOperator] = useState<Operator2 | null>(null)

    const columns = getColumns({ setEditingOperator, setShowForm })
    const table = useReactTable({
        data: mockOperators2,
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
        // <div className="w-full">
        <div className="my-2 px-4 py-2 bg-white rounded-[10px] shadow border">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">{title}</p>
                </div>

            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-lg font-bold">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="pl-5 font-medium text-[16px] text-[#888888]">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Tiếp
                    </Button>
                </div>
            </div>
        </div>
    )
}
