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
import { ArrowUpDown } from "lucide-react"

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
import { DrawingCode2 } from "@/lib/type"
import { mockDrawingCodes2 } from "@/lib/dataDemo"

function formatSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

function getColumns(): ColumnDef<DrawingCode2>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button className="text-lg font-bold uppercase" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    MÃ BẢN VẼ <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div className="text-lg uppercase">{row.getValue("name")}</div>
                    <div className="text-sm text-muted-foreground font-normal uppercase">#{row.original.id}</div>
                </div>
            ),
        },
        {
            accessorKey: "thoi_gian_du_kien",
            header: ({ column }) => (
                <Button className="text-lg font-bold uppercase" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    THỜI GIAN DỰ KIẾN <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("thoi_gian_du_kien"))}</div>,
        },
        {
            accessorKey: "thoi_gian_thuc_te",
            header: ({ column }) => (
                <Button className="text-lg font-bold uppercase" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    THỜI GIAN THỰC TẾ <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("thoi_gian_thuc_te"))}</div>,
        },
        {
            id: "do_chenh_lech",
            header: () => <div className="text-lg font-bold uppercase">ĐỘ CHÊNH LỆCH</div>,
            cell: ({ row }) => {
                const chenhLech = row.original.thoi_gian_thuc_te - row.original.thoi_gian_du_kien
                return <div>{formatSecondsToTime(chenhLech)}</div>
            },
        },
    ]
}

export default function DrawingCodeTable({ title, description }: { title: string; description: string }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const columns = getColumns()
    const table = useReactTable({
        data: mockDrawingCodes2,
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
        <div className="my-2 px-4 py-2 bg-white rounded-[10px] shadow border">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-lg font-bold">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                        <TableCell key={cell.id} className="pl-5 font-medium text-[16px] text-[#888888]">
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
    )
}
