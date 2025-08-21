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
// import { Staff } from "@/lib/type"
import EditOperatorForm from "../components/editOperator"
import AddOperatorForm from "../components/addNewOperator"
import { useStaff } from "../hooks/useStaff"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { useStaffKPI } from "./hooks/useStaffKPI"
import { KPI } from "./lib/type"
import AddNewKPI from "./components/addNewKPI"
import EditKPIStaffForm from "./components/editKPI"
import { Staff } from "@/lib/type"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
function getColumns({
    setEditingOperator,
    setShowForm,
}: {
    setEditingOperator: (operator: KPI) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<KPI>[] {
    return [
        // {
        //     id: "stt",
        //     header: () => (<span className="text-lg font-bold ">STT</span>),
        //     cell: ({ row }) => <div>{row.index + 1}</div>,
        // },
        {
            accessorKey: "staffName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên nhân viên <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("staffName")}</div>,
        },
        // {
        //     accessorKey: "id",
        //     header: ({ column }) => (
        //         <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        //             Mã nhân viên <ArrowUpDown />
        //         </Button>
        //     ),
        //     cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
        // },
        {
            accessorKey: "groupName",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("groupName")}</div>
            )
        },
        {
            accessorKey: "year",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Năm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("year")}</div>,
        },
        {
            accessorKey: "month",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tháng <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("month")}</div>,
        },
        {
            accessorKey: "manufacturingPoint",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Điểm gia công <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("manufacturingPoint")}</div>,
        },
        {
            accessorKey: "pgTimeGoal",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Giờ PG <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("pgTimeGoal")}</div>,
        },
        {
            accessorKey: "machineTimeGoal",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Giờ máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineTimeGoal")}</div>,
        },
        {
            accessorKey: "workGoal",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Giờ làm việc <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("workGoal")}</div>,
        },
        {
            accessorKey: "kpi",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    KPI <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("kpi")}</div>,
        },
        {
            accessorKey: "oleGoal",
            header: ({ column }) => (
                <Button className="text-lg font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    OLE <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("oleGoal")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const operator = row.original
                const [open, setOpen] = useState(false)

                return (
                    <DropdownMenu
                        open={open}
                        onOpenChange={(nextOpen) => {
                            if (nextOpen && operator.staffStatus === 0) {
                                toast.error("Nhân viên đã nghỉ không thể thao tác")
                                return
                            }
                            setOpen(nextOpen)
                        }}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal size={80} strokeWidth={3} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem className="text-lg cursor-pointer">
                                Thông tin chi tiết
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                className="text-lg cursor-pointer"
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
        }



    ]
}


export default function OperatorTable() {
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    // Staff KPI
    const { data: staffKPI } = useStaffKPI()

    // Add new operator
    const [showForm, setShowForm] = useState(false)
    // Edit Operator
    const [editingOperator, setEditingOperator] = useState<KPI | null>(null)

    const columns = getColumns({ setEditingOperator, setShowForm })
    const table = useReactTable({
        data: staffKPI,
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
        <div className="w-full">
            <div className="m-2 px-4 py-3 bg-white rounded-[10px] shadow">
                <div className="flex flex-row items-center justify-between py-4">
                    <div className="w-2/3">
                        <p className="text-2xl font-bold">Danh Sách Mục Tiêu Nhân Viên</p>
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
                <div className="rounded-md border w-full">
                    <Table className="w-full">
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
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={index % 2 === 0 ? "bg-gray-50" : ""}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            // kiểm tra nếu cột là staffName thì custom render
                                            if (cell.column.id === "staffName") {
                                                const staffName = row.original.staffName
                                                const staffId = row.original.id
                                                const status = row.original.staffStatus
                                                return (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="font-medium text-[16px] text-center"
                                                    >
                                                        <div className="flex flex-col">
                                                            <div className={`${status === 0
                                                                ? "text-gray-400"
                                                                : ""
                                                                }`}>
                                                                <div className="">
                                                                    {staffName}
                                                                    <span>
                                                                        {status === 0 ? "- Đã nghỉ" : ""}
                                                                    </span>
                                                                </div>
                                                                <div className="">
                                                                    ID: {staffId}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </TableCell>
                                                )
                                            }
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className="font-medium text-[17px] text-[#000000] text-center"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Không có dữ liệu
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
                    <DialogContent className="w-full max-[1550px]:!max-w-5xl min-[1550px]:!max-w-5xl !gap-5 pb-3 min-[1550px]:top-100">
                        <DialogHeader>
                            <DialogTitle className="text-3xl text-[#084188] font-semibold">{editingOperator ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu"}</DialogTitle>
                        </DialogHeader>
                        {editingOperator ? (
                            <EditKPIStaffForm
                                inforKPI={editingOperator}
                                // onUpdate={(updated) => {
                                //     const index = staff.findIndex(op => op.id === updated.id)
                                //     if (index !== -1) staff[index] = updated
                                //     table.setOptions(prev => ({ ...prev, data: [...staff] }))
                                //     setShowForm(false)
                                //     setEditingOperator(null)
                                // }}
                                onCancel={() => {
                                    setShowForm(false)
                                    setEditingOperator(null)
                                }} onUpdate={function (updated: Staff): void {
                                    throw new Error("Function not implemented.")
                                }} />
                        ) : (
                            <AddNewKPI
                                onAdd={(newOp) => {
                                    staffKPI.push(newOp)
                                    table.setOptions(prev => ({ ...prev, data: [...staffKPI] }))
                                    router.refresh()
                                    setShowForm(false)
                                }}
                                onCancel={() => {
                                    setShowForm(false)
                                }}
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
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Trước
                        </Button>
                        <Button
                            className="cursor-pointer"
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
        </div>
    )
}
