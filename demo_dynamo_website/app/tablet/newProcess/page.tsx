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
import { ArrowUpDown, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Fragment, useEffect, useState } from "react"
import { useFetchMachines, useFetchOperators, useFetchProcesses } from "@/hooks/useFetchData"
import { Machine2, Process2, Staff } from "@/lib/type"
import axios from "axios"
import { OrbitProgress } from "@/node_modules/react-loading-indicators"
import Link from "next/link"

const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const tabletCSS = "max-[1300px]:text-3xl max-[1300px]:!py-7 max-[1300px]:!px-8"
export default function TabletProcess() {
    const [isCreating, setIsCreating] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Phần chọn máy và nhân viên
    // const [selectedMachineId, setSelectedMachineId] = useState<string>("");
    // const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");

    // Fetch Data
    const fetchedOperator = useFetchOperators()
    const [staff, setStaff] = useState<Staff[]>([])
    useEffect(() => {
        setStaff(fetchedOperator)
    }, [fetchedOperator])
    // console.log("staff:")
    // console.log(fetchedOperator)

    const fetchedMachine = useFetchMachines()
    const [machine2, setMachine2] = useState<Machine2[]>([])
    useEffect(() => {
        setMachine2(fetchedMachine)
    }, [fetchedMachine])
    // console.log("machine2")
    // console.log(machine2)

    // Fetch ToDo Progress
    const { data: fetchedProcesses, refetch } = useFetchProcesses();
    // const [processData2, setProcessData2] = useState<Process2[]>([])
    const [todo, setTodo] = useState<Process2[]>([]);
    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const res = await axios.get<Process2[]>(
                    `${URL}/api/drawing-code-process`
                );
                const filteredData = res.data.filter(item => item.isPlan === 0);
                setTodo(filteredData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu process:", error);
            }
        };
        fetchProcess();
    }, []);
    // useEffect(() => {
    //     setProcessData2(fetchedProcesses)
    // }, [fetchedProcesses])

    // Handle Submit
    const [loading, setLoading] = useState(false);

    // const handleSubmit = async (processId: string) => {
    //     if (!selectedMachineId || !selectedOperatorId) {
    //         toast.error("Vui lòng chọn đầy đủ thông tin.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const url = `${URL}/api/drawing-code-process/receive?drawingCodeProcess_id=${processId}&&staffId=${selectedOperatorId}&&machineId=${selectedMachineId}`;
    //         await axios.post(url);
    //         toast.success("Gửi thành công!");
    //         // Refetch lại dữ liệu
    //         await refetch();

    //     } catch (error) {
    //         toast.error("Gửi thất bại. Vui lòng thử lại.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    //Column
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    // const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

    const columns: ColumnDef<Process2>[] = [
        {
            accessorKey: "processType",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ĐTGC
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("processType")}</div>,
        },
        {
            accessorKey: "orderDetailDto.orderCode",
            accessorFn: (row) => row.orderDetailDto?.orderCode ?? "",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID Mã Hàng
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.orderDetailDto?.orderCode ?? "—"}</div>
            )
        },
        {
            accessorKey: "partNumber",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-[22px] font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        TTSP
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("partNumber")}</div>,
        },
        {
            accessorKey: "stepNumber",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-[22px] font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        TTGC
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("stepNumber")}</div>,
        },
        {
            accessorKey: "manufacturingPoint",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-[22px] font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ĐGC
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("manufacturingPoint")}</div>,
        },
        {
            accessorKey: "pgTime",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Giờ PG
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("pgTime")}</div>,
        },
        // {
        //     accessorKey: "planDto.staffId",
        //     accessorFn: (row) => row.planDto?.staffId ?? "",
        //     header: ({ column }) => {
        //         return (
        //             <Button
        //                 className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
        //                 variant="ghost"
        //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //             >
        //                 Nhân Viên
        //                 <ArrowUpDown />
        //             </Button>
        //         )
        //     },
        //     cell: ({ row }) => {
        //         const staffId = row.original.planDto?.staffId;
        //         const foundStaff = staff.find(st => st.staffId === staffId);
        //         return <div>{foundStaff ? foundStaff.staffName : ""}</div>;
        //     }
        // },
        {
            accessorKey: "planDto.machineId",
            accessorFn: (row) => row.planDto?.machineId ?? "",
            header: ({ column }) => {
                return (
                    <Button
                        className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Máy
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const machineId = row.original.machineDto?.machineId;
                const foundMachine = machine2.find(mc => mc.machineId === machineId);
                return <div>{foundMachine ? foundMachine.machineName : ""}</div>;
            }
        },
    ];
    const table = useReactTable({
        data: todo,
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
        <>
            <div className="w-full py-3 px-3 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between pb-3">
                    <p className="text-3xl capitalize">Danh sách mã bản vẽ trong quá trình</p>
                    <div className="flex flex-row justify-between items-center gap-3">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Tìm kiếm"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10 py-5"
                            />
                        </div>
                        <Link href="/tablet/newProcess/addNewProcess">
                            <Button
                                variant="secondary" size="icon" className="px-18 py-6 text-xl max-[1300px]:text-2xl text-white max-[1300px]:font-extrabold font-bold bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus size={70} strokeWidth={6} color="white" />
                                Tạo mới
                            </Button>
                        </Link>

                    </div>
                </div>

                {/* Table */}
                <div className="border">
                    {
                        loading ? (
                            <div className="flex justify-center mt-4">
                                <OrbitProgress
                                    variant="spokes"
                                    color="#b3b3b3"
                                    size="medium"
                                    text="Đang gửi"
                                    textColor=""
                                />
                            </div>
                        ) : (
                            <Table >
                                <TableHeader >
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow className="" key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id} className="text-center text-white bg-blue-950 p-2 font-semibold">
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
                                        table.getRowModel().rows.map((row, index) => {
                                            const isOdd = index % 2 !== 0;
                                            return (
                                                <Fragment key={row.id}>
                                                    <TableRow
                                                        className={`${isOdd ? "bg-gray-100" : ""} text-2xl font-semibold !border-none`}
                                                    // onClick={() => setExpandedRowId(prev =>
                                                    //     prev === row.original.processId ? null : row.original.processId
                                                    // )
                                                    // }
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="text-center">
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    {/* {row.original.processId === expandedRowId && (
                                                        <TableRow className={`${isOdd ? "bg-gray-100" : ""} text-2xl font-semibold !border-none`}>
                                                            <TableCell colSpan={6}>
                                                                <div className="pb-3 max-2xl:pl-6 max-2xl:pr-3  min-2xl:pr-3 min-2xl:pl-10 flex items-center gap-3">
                                                                    <div className="flex gap-6 w-full">
                                                                        <div className="w-1/2 flex items-center gap-2">
                                                                            <p className="font-bold text-2xl whitespace-nowrap">Chọn máy:</p>
                                                                            <Select
                                                                                value={selectedMachineId}
                                                                                onValueChange={(value) => setSelectedMachineId(value)}
                                                                            >
                                                                                <SelectTrigger className="w-full text-2xl">
                                                                                    <SelectValue placeholder="Máy" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectGroup>
                                                                                        {machine2
                                                                                            .filter((m) => m.status === 0)
                                                                                            .map((m) => (
                                                                                                <SelectItem className="text-2xl" key={m.machineId} value={m.machineId.toString()}>
                                                                                                    {m.machineName}
                                                                                                </SelectItem>
                                                                                            ))}
                                                                                    </SelectGroup>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>

                                                                        <div className="w-1/2 flex items-center gap-2">
                                                                            <p className="font-bold text-2xl whitespace-nowrap">Chọn nhân viên:</p>
                                                                            <Select
                                                                                value={selectedOperatorId}
                                                                                onValueChange={(value) => setSelectedOperatorId(value)}
                                                                            >
                                                                                <SelectTrigger className="w-full text-2xl">
                                                                                    <SelectValue placeholder="Nhân viên" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectGroup>
                                                                                        {staff.map((staff) => (
                                                                                            <SelectItem className="text-2xl" key={staff.id} value={staff.id}>
                                                                                                {staff.staffName} - {staff.staffId}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectGroup>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Button
                                                                            className="bg-green-700 hover:bg-green-600 px-10 py-6 text-xl font-bold"
                                                                            onClick={() => handleSubmit(row.original.processId)}
                                                                        >
                                                                            Gửi
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )} */}
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                Không có dữ liệu!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )
                    }
                </div>

                {/* Phân trang */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-lg text-muted-foreground flex-1">
                        Trang {table.getState().pagination.pageIndex + 1} /{" "}
                        <span>{table.getPageCount()}</span>
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="text-lg"
                        >
                            Trước
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="text-lg"
                        >
                            Tiếp
                        </Button>
                    </div>
                </div>
            </div >
        </>
    )
}
