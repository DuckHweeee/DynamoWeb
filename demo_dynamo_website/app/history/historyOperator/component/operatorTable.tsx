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
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import { mockOperator3, Operator3 } from "../lib/dataDemo"
function formatSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

const columns: ColumnDef<Operator3>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-xl capitalize">Mã nhân viên<ArrowUpDown /></Button>
        ),
        cell: ({ row }) => (
            <div>
                <div className="text-lg">{row.getValue("name")}</div>
                <div className="text-sm text-muted-foreground font-normal">#{row.original.id}</div>
            </div>
        ),
    },
    {
        accessorKey: "tong_so_nguyen_cong",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-xl capitalize">Tổng Số nguyên công <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] px-4 py-1 rounded-md">{row.getValue("tong_so_nguyen_cong")}</span></div>,
        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgc"))}</div>,
    },
    {
        accessorKey: "diem_nguyen_cong",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-xl capitalize">Điểm nguyên công<ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] px-4 py-1 rounded-md">{row.getValue("diem_nguyen_cong")}</span></div>,

        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgd"))}</div>,
    },
    {
        accessorKey: "id_may",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-xl">Máy<ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] text-[#718096] px-4 py-1 rounded-md">#ID{row.getValue("id_may")}</span></div>,
        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgt"))}</div>,
    },
    {
        accessorKey: "tong_gio_loi",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-xl">Tổng Giờ Lỗi <ArrowUpDown /></Button>
        ),
        cell: ({ row }) => <div> <span className="inline-block !w-[93px] !h-[30px] bg-[#FFE6E6] text-[#FE4A4A]  px-4 py-1 rounded-md">{formatSecondsToTime(row.getValue("tong_gio_loi"))}</span></div>,

        // cell: ({ row }) => <div>{formatSecondsToTime(row.getValue("tgl"))}</div>,
    },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const item = row.original
    //         return (
    //             <div className="flex items-center justify-center">
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" className="h-8 w-8 p-0">
    //                             <span className="sr-only">Open menu</span>
    //                             <MoreHorizontal />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         <DropdownMenuItem onClick={() => alert(`Xem chi tiết máy ${item.ten_may}`)}>
    //                             Xem chi tiết
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem onClick={() => alert(`Xóa máy ${item.ten_may}`)}>
    //                             Xóa
    //                         </DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //             </div>
    //         )
    //     },
    // },
]

export default function OperatorTable({ title, description }: { title: string; description: string }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data: mockOperator3,
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
        <div className="">
            <div className="flex flex-row items-center justify-between py-4">
                <p className="text-2xl font-bold">{title}</p>
                {/* <p className="text-xl">{description}</p> */}
                {/* <Input
                    placeholder="Tìm kiếm"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
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
                                    <TableHead key={header.id} className="text-center py-5">
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
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.id === "name"
                                                    ? "pl-10 font-medium "
                                                    : "text-center font-medium text-lg"
                                            }
                                        >
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
