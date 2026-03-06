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
import { MachineOverview } from "../lib/type"

function formatHoursToTime(hours: number): string {
    // The API returns time in decimal hours, so convert to hours and minutes
    // const wholeHours = Math.floor(hours)
    // const minutes = Math.floor((hours % 1) * 60)
    // return `${wholeHours}h ${minutes}m`


    let h = Math.floor(hours);
    let m = Math.round((hours - h) * 60);

    // ⚠️ Xử lý trường hợp làm tròn lên 60 phút
    if (m === 60) {
        h += 1;
        m = 0;
    }

    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h} h`;
    if (m > 0) return `${m} m`;
    return "0 phút";
}

const columns: ColumnDef<MachineOverview>[] = [
    {
        accessorKey: "machineName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[14px] font-bold text-white">Tên máy <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => (
            <div>
                <div className="text-sm text-white">{row.getValue("machineName")}</div>
                {/* <div className="text-sm text-muted-foreground font-normal">#{row.original.id}</div> */}
            </div>
        ),
    },
    {
        accessorKey: "runTime",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[14px] font-bold text-white">Tổng giờ chạy <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] bg-[#E6FFE6] text-[#00A90B] px-4 py-1 rounded-md">{formatHoursToTime(row.getValue("runTime"))}</span></div>,
        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgc"))}</div>,
    },
    {
        accessorKey: "stopTime",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[14px] font-bold text-white">Tổng giờ dừng <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] bg-[#FAFFAF] text-[#C3B300] px-4 py-1 rounded-md">{formatHoursToTime(row.getValue("stopTime"))}</span></div>,

        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgd"))}</div>,
    },
    {
        accessorKey: "emptyTime",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[14px] font-bold text-white">Tổng giờ trống <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] bg-[#B5B5B5] text-[#FFFFFF] px-4 py-1 rounded-md">{formatHoursToTime(row.getValue("emptyTime"))}</span></div>,
        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgt"))}</div>,
    },
    {
        accessorKey: "errorTime",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[14px] font-bold text-white">Tổng giờ lỗi <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] bg-[#FFE6E6] text-[#FE4A4A]  px-4 py-1 rounded-md">{formatHoursToTime(row.getValue("errorTime"))}</span></div>,

        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgl"))}</div>,
    },
]

export default function MachineTable({
    title,
    dataOverview,
}: {
    title: string
    description: string
    dataOverview: MachineOverview[]
}) {
    // Debug logging
    React.useEffect(() => {
    }, [dataOverview]);

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data: dataOverview,
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
            initialState: {
            pagination: {
                pageSize: 5,   // ⬅️ mỗi trang tối đa 7 dòng
            },
        },
    })

    return (
        <div className="px-4 py-2 bg-white rounded-[10px] shadow-md bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl ">
            <div className="flex flex-row items-center justify-between py-4">
                {/* <p className="text-2xl font-bold">Thống kê thời gian máy</p> */}
                <p className="text-base font-bold text-white">{title}</p>
                {/* <p className="text-xl">{description}</p> */}
                {/* <Input
                    placeholder="Tìm kiếm"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm !text-[20px]"
                /> */}
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
                                        <TableCell key={cell.id} className="text-center font-bold text-[14px] text-[#888888] py-5">
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
        </div>
    )
}
