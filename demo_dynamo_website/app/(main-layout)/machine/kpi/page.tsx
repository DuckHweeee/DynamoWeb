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
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Search, Upload } from "lucide-react"

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
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import AddNewKPI from "./components/addNewKPI"
import EditKPIStaffForm from "./components/editKPI"
import { Staff } from "@/lib/type"
import { KPI } from "../lib/type"
import { useMachineKPI } from "../../../../hooks/useMachine"
import { ImportDialog } from "@/components/ImportDialog"

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
function getColumns({
    setEditingOperator,
    setShowForm,
}: {
    setEditingOperator: (operator: KPI) => void
    setShowForm: (show: boolean) => void
}): ColumnDef<KPI>[] {
    return [
        {
            accessorKey: "machineId",
            header: ({ column }) => (
                <Button className="text-base text-white font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineId")}</div>,
        },
        {
            accessorKey: "machineName",
            header: ({ column }) => (
                <Button className="text-base text-white font-bold cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineName")}</div>,
        },
        {
            accessorKey: "groupName",
            header: ({ column }) => (
                <Button className="text-base font-bold text-white cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nhóm máy<ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("groupName")}</div>
            )
        },
        {
            accessorKey: "year",
            header: ({ column }) => (
                <Button className="text-base font-bold text-white cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Năm <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("year")}</div>,
        },
        {
            accessorKey: "month",
            header: ({ column }) => (
                <Button className="text-base font-bold text-white cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tháng <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("month")}</div>,
        },
        {
            accessorKey: "machineMiningTarget",
            header: ({ column }) => (
                <Button className="text-base font-bold text-white cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mục tiêu khai thác máy <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("machineMiningTarget")}</div>,
        },
        {
            accessorKey: "oee",
            header: ({ column }) => (
                <Button className="text-base font-bold text-white cursor-pointer" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    OEE <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize">{row.getValue("oee")}</div>,
        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => (
                <Button
                    className="text-base font-bold text-white cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ngày tạo <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = row.getValue("createdDate") as string
                const date = value ? new Date(value) : null
                const formatted = date
                    ? date.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : ""
                return <div>{formatted}</div>
            },
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
                                <Edit className="mr-2 h-4 w-4" />
                                <span className="text-sm">Chỉnh sửa</span>
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
    const { data: machineKPI } = useMachineKPI()

    // Add new operator
    const [showForm, setShowForm] = useState(false)
    // Edit Operator
    const [editingOperator, setEditingOperator] = useState<KPI | null>(null)
    // Import Dialog
    const [showImportDialog, setShowImportDialog] = useState(false)

    const handleImportSuccess = () => {
        toast.success("Import KPI máy thành công!")
        router.refresh()
        setShowImportDialog(false)
    }

    // console.log("editingOperator")
    // console.log(editingOperator)
    const columns = getColumns({ setEditingOperator, setShowForm })
    const table = useReactTable({
        data: machineKPI,
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
                pageSize: 8,   // ⬅️ mỗi trang tối đa 8 dòng
            },
        },
    })


    return (
        <div className="w-full">
            <div className="mt-6 m-2 px-4 py-3  bg-white/10 backdrop-blur
            border border-white/20
            shadow-xl rounded-[10px] shadow ">
                <div className="flex flex-row items-center justify-between py-4 border-b border-red-300 mb-4">
                    <div className="w-2/3">
                        {/* <p className="text-2xl font-bold">Danh Sách Mục Tiêu Máy</p> */}
                    </div>
                    <div className="w-1/3 flex flex-row justify-end-safe items-center gap-1">
                        <div className="relative max-w-sm w-full ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Tìm kiếm"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 py-5.5"
                            />
                        </div>
                        <Button
                            variant="secondary" size="icon" className="px-10 py-6  bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow hover:bg-[#0754B4] cursor-pointer"
                            onClick={() => setShowForm(true)}>
                            <Plus size={60} strokeWidth={5} color="white" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="px-10 py-6  bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow  hover:bg-green-700 cursor-pointer mr-2"
                            onClick={() => setShowImportDialog(true)}
                        >
                            <Upload size={24} color="white" />
                        </Button>

                    </div>
                </div>
                <div className="rounded-md border w-full">
                    <Table className="w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="text-base font-bold">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-center py-3">
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

                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className="text-[14px] text-[#ffffff] text-center py-5"
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
                                    machineKPI.push(newOp)
                                    table.setOptions(prev => ({ ...prev, data: [...machineKPI] }))
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

                <ImportDialog
                    isOpen={showImportDialog}
                    onClose={() => setShowImportDialog(false)}
                    onImportSuccess={handleImportSuccess}
                    endpoint="machine-kpi/upload"
                    title="Import KPI Máy từ Excel"
                    description="Chọn file Excel để import danh sách KPI máy"
                />

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
