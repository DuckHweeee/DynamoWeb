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
import dayjs from "dayjs"
import { MachineHistoryDetail } from "../lib/type"

const columns: ColumnDef<MachineHistoryDetail>[] = [
    {
        accessorKey: "startEndDate",
        header: ({ column }) => (
            <Button
                className="text-lg font-bold capitalize"
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Thời gian <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const start = row.original.startTime
            const end = row.original.endTime

            return (
                <div className="flex flex-col">
                    <div className="text-lg font-normal">{dayjs(start).format("DD-MM-YYYY HH:mm:ss")}</div>
                    <div className="text-lg font-normal">{dayjs(end).format("DD-MM-YYYY HH:mm:ss")}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "orderCode",
        header: ({ column }) => (
            <Button
                className="text-lg font-bold capitalize"
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Mã hàng <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("orderCode")}</div>,
    },
    {
        accessorKey: "machineName",
        header: ({ column }) => (
            <Button
                className="text-lg font-bold capitalize"
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Người Vận Hành <ArrowUpDown />
            </Button>
        ),
        // cell: ({ row }) => <div>{row.getValue("machineName")}</div>,
        cell: ({ row }) => {
            const staffId = row.original.staffIdNumber
            const staffName = row.original.staffName

            return (
                <div className="flex flex-col">
                    <div className="text-lg font-normal">{staffName}</div>
                    <div className="text-lg font-normal">ID: {staffId}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-lg font-bold">Trạng thái</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            let bg = ""
            let text = ""
            let label = status // mặc định giữ nguyên

            switch (status?.charAt(0)) {
                case "C":
                    bg = "bg-green-100"
                    text = "text-green-600"
                    label = "Hoàn thành"
                    break
                case "R":
                    bg = "bg-blue-100"
                    text = "text-blue-600"
                    label = "Đang chạy"
                    break
                case "S":
                    bg = "bg-yellow-100"
                    text = "text-yellow-600"
                    label = "Đang ngưng"
                    break
                case "E":
                    bg = "bg-red-100"
                    text = "text-red-600"
                    label = "Đang lỗi"
                    break
            }

            return (
                <div className="flex justify-center">
                    <div
                        className={`px-2 py-1 rounded-sm text-center ${bg} ${text}`}
                    >
                        {label}
                    </div>
                </div>
            )
        },
    },
]

export default function MachineHistoryTable({
    title,
    dataHistory,
}: {
    title: string
    dataHistory: MachineHistoryDetail[]
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data: dataHistory,
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
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="text-lg font-bold !text-center"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-center"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
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
                                            className="font-medium text-[16px] text-[#555] text-center"
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
