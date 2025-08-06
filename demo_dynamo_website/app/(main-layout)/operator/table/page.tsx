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
import { Operator, Staff } from "@/lib/type"
import { mockOperators } from "@/lib/dataDemo"
import EditOperatorForm from "../component/editOperator"
import AddOperatorForm from "../component/addNewOperator"
import { useStaff } from "../hook/useStaff"

function getColumns({
    setEditingOperator,
    setShowForm,
}: {
    setEditingOperator: (operator: Staff) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<Staff>[] {
    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={
        //                 table.getIsAllPageRowsSelected() ||
        //                 (table.getIsSomePageRowsSelected() && "indeterminate")
        //             }
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            id: "stt",
            // header: ({ column }) => (
            //     <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            //         STT <ArrowUpDown />
            //     </Button>
            // ),
            header: () => (<span className="text-lg font-bold ">STT</span>),
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "staffId",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã nhân viên <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("staffId")}</div>,
        },
        {
            accessorKey: "staffName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên nhân viên <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("staffName")}</div>,
        },
        {
            accessorKey: "staffOffice",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Phòng Ban <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("staffOffice")}</div>,
        },
        {
            accessorKey: "groupName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("groupName")}</div>,
        },
        {
            accessorKey: "staffSection",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Công Việc <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("staffSection")}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    className="text-lg font-bold cursor-pointer"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Trạng Thái <ArrowUpDown />
                </Button>
            ),
            cell: ({ getValue }) => {
                const value = getValue<number>()
                const isWorking = value === 1
                return (
                    <div
                        className={`w-full px-4 py-1 rounded-sm text-center capitalize
        ${isWorking ? "bg-[#E7F7EF] text-[#0CAF60]" : "bg-[#FFE6E6] text-[#FE4A4A]"}`}
                    >
                        {isWorking ? "Đang Làm Việc" : "Đã Nghỉ Việc"}
                    </div>
                )
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const operator = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal size={80} strokeWidth={3} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(operator.id)}>
                                Xóa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingOperator(operator)
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



export default function OperatorTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    // Staff Data
    const { data: staff, loading, error } = useStaff()
    console.log("Danh sách Staff")
    console.log(staff)

    // Add new operator
    const [showForm, setShowForm] = useState(false)
    // Edit Operator
    const [editingOperator, setEditingOperator] = useState<Staff | null>(null)

    const columns = getColumns({ setEditingOperator, setShowForm })
    const table = useReactTable({
        data: staff,
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
        <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
            <div className="flex flex-row items-center justify-between py-4">
                <div className="w-2/3">
                    <p className="text-2xl font-bold">Danh Sách Người Vận hành</p>
                </div>
                <div className="w-1/3 flex items-center gap-5">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button
                        variant="secondary" size="icon" className="px-10 py-5 bg-[#074695] hover:bg-[#0754B4]"
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
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center py-2">
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
                                        <TableCell key={cell.id} className="text-center font-medium text-[16px] text-[#888888]">
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

            <Dialog open={showForm} onOpenChange={(open) => {
                setShowForm(open)
                if (!open) setEditingOperator(null)
            }}>
                <DialogContent className="w-full !max-w-5xl !gap-1">
                    <DialogHeader>
                        <DialogTitle className="text-3xl">{editingOperator ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
                    </DialogHeader>
                    {editingOperator ? (
                        <EditOperatorForm
                            initialData={editingOperator}
                            onUpdate={(updated) => {
                                const index = staff.findIndex(op => op.id === updated.id)
                                if (index !== -1) staff[index] = updated
                                table.setOptions(prev => ({ ...prev, data: [...staff] }))
                                setShowForm(false)
                                setEditingOperator(null)
                            }}
                            onCancel={() => {
                                setShowForm(false)
                                setEditingOperator(null)
                            }}
                        />
                    ) : (
                        <AddOperatorForm
                            onAdd={(newOp) => {
                                staff.push(newOp)
                                table.setOptions(prev => ({ ...prev, data: [...staff] }))
                                setShowForm(false)
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div> */}
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
