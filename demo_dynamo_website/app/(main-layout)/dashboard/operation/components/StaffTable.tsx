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
import { ArrowUpDown, } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { StaffOverview } from "../lib/type"
// function formatSecondsToTime(seconds: number): string {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     return `${hours}h ${minutes}m`
// }
function convertHoursToHM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
    if (h > 0) return `${h} giờ`;
    if (m > 0) return `${m} phút`;
    return "0 phút";
}
const columns: ColumnDef<StaffOverview>[] = [
    {
        accessorKey: "staffFullName",
        header: ({ column }) => (
            <Button className="cursor-pointer text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tên nhân viên <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                <div className="text-lg">{row.getValue("staffFullName")}</div>
                <div className="text-sm text-muted-foreground font-normal uppercase">#{row.original.staffIdNumber}</div>
            </div>
        ),
    },
    {
        accessorKey: "totalWorkingHour",
        header: ({ column }) => (
            <Button className="cursor-pointer text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Giờ làm việc <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{convertHoursToHM(row.getValue("totalWorkingHour"))}</div>,
    },
    {
        accessorKey: "totalOperationNumber",
        header: ({ column }) => (
            <Button className="cursor-pointer text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Số nguyên công <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("totalOperationNumber")}</div>,
    },
    {
        accessorKey: "totalManufacturingPoint",
        header: ({ column }) => (
            <Button className="cursor-pointer text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Điểm nguyên công <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-bold">{row.getValue("totalManufacturingPoint")}</div>
        ),
    },
    {
        accessorKey: "kpi",
        header: ({ column }) => (
            <Button className="cursor-pointer text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                KPI <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-bold">{row.getValue("kpi")}</div>
        ),
    },
]



export default function StaffTable({ title, description, staffList }: { title: string; description: string; staffList: StaffOverview[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const table = useReactTable({
        data: staffList,
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
        <div className="my-2 px-4 py-2 bg-white rounded-[10px] shadow border border-purple-300 shadow-purple-200">
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
                                        <TableHead key={header.id} className="text-center">
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
                                        <TableCell
                                            key={cell.id}
                                            className={`font-medium text-[16px] text-[#888888] text-center`}
                                        >
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
                                    Không có dữ liệu.
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
