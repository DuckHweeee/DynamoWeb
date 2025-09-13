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

interface TableOperatorDetailProps {
    startDate: string;
    endDate: string;
    idOrder?: string;
    machineId: string;
    status: number;
}
const myData: TableOperatorDetailProps[] = [
    {
        startDate: "11/12/2025 7:00:00",
        endDate: "30/12/2025 7:00:00",
        idOrder: "20250148",
        machineId: "M001",
        status: 0
    },
    {
        startDate: "2023-10-01",
        endDate: "2023-10-31",
        idOrder: "20250101",
        machineId: "M002",
        status: 1
    },
    {
        startDate: "2023-10-01",
        endDate: "2023-10-31",
        idOrder: "20250468",
        machineId: "M003",
        status: 2
    },
    {
        startDate: "2023-10-01",
        endDate: "2023-10-31",
        idOrder: "20256689",
        machineId: "M004",
        status: 3
    }
]

function formatSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

const columns: ColumnDef<TableOperatorDetailProps>[] = [
    {
        accessorKey: "startEndDate",
        header: ({ column }) => (
            <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Thời gian <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <div className="text-lg font-normal">{row.original.startDate}</div>
                <div className="text-lg font-normal">{row.original.endDate}</div>
            </div>
        ),
    },
    {
        accessorKey: "idOrder",
        header: ({ column }) => (
            <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                ID mã hàng <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("idOrder")}</div>,
    },
    {
        accessorKey: "machineId",
        header: ({ column }) => (
            <Button className="text-lg font-bold capitalize" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Máy vận hành <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("machineId")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Trạng thái <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as number;

            let bg = "";
            let text = "";
            let label = "";

            switch (status) {
                case 0:
                    bg = "bg-gray-300";
                    text = "text-white";
                    label = "Trống";
                    break;
                case 1:
                    bg = "bg-yellow-100";
                    text = "text-yellow-600";
                    label = "Dừng";
                    break;
                case 2:
                    bg = "bg-green-100";
                    text = "text-green-600";
                    label = "Chạy";
                    break;
                case 3:
                    bg = "bg-red-100";
                    text = "text-red-600";
                    label = "Lỗi";
                    break;
            }

            return (
                <div className="flex justify-center w-full">
                    <div
                        className={`w-1/2 flex items-center justify-center py-1 rounded-sm text-center capitalize ${bg} ${text}`}
                    >
                        {label}
                    </div>
                </div>
            );
        },
    },
]


export default function TableOperatorDetail({ title, description }: { title: string; description: string }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data: myData,
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
                            <TableRow key={headerGroup.id} className="text-lg font-bold !text-center">
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
                                        <TableCell key={cell.id} className=" font-medium text-[16px] text-[#888888] text-center">
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
