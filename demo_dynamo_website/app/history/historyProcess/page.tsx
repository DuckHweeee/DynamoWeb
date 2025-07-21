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
import { ArrowUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { HistoryProcess } from "@/lib/type"
import { mockHistoryProcesses } from "@/lib/dataDemo"
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
function formatSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

const columns: ColumnDef<HistoryProcess>[] = [
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
        accessorKey: "ma_ban_ve",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Mã Bản Vẽ <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("ma_ban_ve")}</div>,
    },
    {
        accessorKey: "tsnc",
        header: () => <div className="text-center">Tổng SNC</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("tsnc")}</div>,
    },
    {
        accessorKey: "hoan_thanh",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Hoàn thành <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="bg-[#E7F7EF] text-[#0CAF60] px-4 py-1 rounded-md capitalize">{row.getValue("hoan_thanh")}</span></div>,

    },
    {
        accessorKey: "chua_hoan_thanh",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Chưa hoàn thành <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="bg-[#FFE6E6] text-[#FE4A4A]  px-4 py-1 rounded-md capitalize">{row.getValue("chua_hoan_thanh")}</span></div>,
    },
    {
        accessorKey: "tght",
        header: () => <div className="text-center">TG Hoàn Thành</div>,
        cell: ({ row }) => <div className="text-center">{formatSeconds(row.getValue("tght"))}</div>,
    },
]

export default function HistoryProcessTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data: mockHistoryProcesses,
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
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            <div className="flex flex-row items-center justify-between py-4">
                <p className="text-2xl font-bold">Lịch Sử Quy Trình</p>
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
            </div>
            <div className="flex flex-wrap items-center justify-between mb-4">
                {/* Vùng chọn ngày */}
                <div className="flex flex-wrap gap-4 items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className={cn(
                                    "flex items-center gap-2 bg-[#004799] text-white px-4 py-3 rounded-md hover:bg-[#003b80] transition"
                                )}
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm">
                                    {date?.from ? format(date.from, "dd/MM/yyyy") : "Ngày bắt đầu"} -{" "}
                                    {date?.to ? format(date.to, "dd/MM/yyyy") : "Ngày kết thúc"}
                                </span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="flex gap-4 p-4 !w-full" align="start">
                            <DatePicker
                                mode="range"
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Bộ lọc 1 */}
                    <Select>
                        <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                            <SelectValue placeholder="Nhóm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                <SelectItem value="apple">Nhóm 1</SelectItem>
                                <SelectItem value="banana">Nhóm 2</SelectItem>
                                <SelectItem value="blueberry">Nhóm 3</SelectItem>
                                <SelectItem value="grapes">Nhóm 4</SelectItem>
                                <SelectItem value="pineapple">Nhóm 5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bộ lọc 2 */}
                <div>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-[#004799] px-4 py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                            <SelectValue placeholder="Lịch sử bản vẽ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                <SelectItem value="apple">AC001</SelectItem>
                                <SelectItem value="banana">AC002</SelectItem>
                                <SelectItem value="blueberry">AC003</SelectItem>
                                <SelectItem value="grapes">AC004</SelectItem>
                                <SelectItem value="pineapple">AC005</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="text-lg font-bold">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
