"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFetchMachines,
  useFetchOperators,
  useFetchProcesses,
} from "@/hooks/useFetchData";
import { Process2 } from "@/lib/type";
import axios from "axios";
import { OrbitProgress } from "@/node_modules/react-loading-indicators";
import Link from "next/link";
import { toast } from "sonner";
import { OrderDetail } from "@/app/(main-layout)/orderDetail/lib/type";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const tabletCSS = "max-[1300px]:text-3xl max-[1300px]:!py-7 max-[1300px]:!px-8";
export default function TabletProcess() {
  const [isCreating, setIsCreating] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null
  );
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [selectedPGTime, setSelectedPGTime] = useState<string | null>(null);

  const { data: staff } = useFetchOperators();
  const { data: machine2 } = useFetchMachines();

  // Fetch ToDo Progress
  const { data: fetchedProcesses, refetch } = useFetchProcesses();
  const [todo, setTodo] = useState<OrderDetail[]>([]);

  // Fetch and update todo data
  const fetchProcess = async () => {
    try {
      const res = await axios.get<OrderDetail[]>(`${URL}/api/order-detail`);
      setTodo(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu process:", error);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);
  //ge† process
  const [subProcesses, setSubProcesses] = useState<Process2[]>([]);

  // Handle Submit
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (processId: string) => {
    const process = subProcesses.find((p) => p.processId === processId);

    if (!process) return;
    setLoading(true);
    try {
      const url = `${URL}/api/drawing-code-process/update`;
      console.log(url);
      const body = {
        processId: process.processId,
        manufacturingPoint: process.manufacturingPoint,
        pgTime: process.pgTime,
        machineId: process.machineDto?.machineId,
      };
      await axios.put(url, body);
      toast.success("Gửi thành công!");
      const res = await axios.get(
        `${URL}/api/drawing-code-process/orderDetail/${expandedRowId}`
      );
      setSubProcesses(res.data);
    } catch (error: any) {
      // Lấy message từ backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Cập nhật thất bại. Vui lòng thử lại.";
      toast.error(backendMessage);
    }
     finally {
      setLoading(false);
    }
  };
  const updateProcessField = (
    processId: string,
    field: keyof Process2,
    value: any
  ) => {
    setSubProcesses((prev) =>
      prev.map((p) =>
        p.processId === processId
          ? {
            ...p,
            [field]: value, // cho phép value === ""
          }
          : p
      )
    );
  };

  const updateProcessMachine = (
    processId: string,
    machineId: number | string
  ) => {
    setSubProcesses((prev) =>
      prev.map((p) =>
        p.processId === processId
          ? {
            ...p,
            machineId: Number(machineId), // Cập nhật hiển thị
            machineDto: {
              ...((p.machineDto ?? {}) as any),
              machineId: Number(machineId), // Dữ liệu gửi server
            },
          }
          : p
      )
    );
  };

  //Column
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<OrderDetail>[] = [
    {
      accessorKey: "orderType",
      header: ({ column }) => {
        return (
          <Button
            className="cursor-pointer text-lg hover:bg-blue-950 hover:text-white"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Đối tượng gia công
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("orderType")}</div>,
    },
    {
      accessorKey: "orderCode",
      // accessorFn: (row) => row.orderDetailDto?.orderCode ?? "",
      header: ({ column }) => (
        <Button
          className="cursor-pointer text-lg hover:bg-blue-950 hover:text-white"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID Mã Hàng
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("orderCode")}</div>,
    },
    {
      accessorKey: "numberOfSteps",
      header: ({ column }) => {
        return (
          <Button
            className="cursor-pointer text-lg hover:bg-blue-950 hover:text-white"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số lượng nguyên công
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("numberOfSteps")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            className="cursor-pointer text-lg hover:bg-blue-950 hover:text-white"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số lượng
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    // {
    //   accessorKey: "manufacturingPoint",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         className="cursor-pointer text-[22px] font-bold hover:bg-blue-950 hover:text-white"
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         ĐGC
    //         <ArrowUpDown />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => <div>{row.getValue("manufacturingPoint")}</div>,
    // },
    {
      accessorKey: "pgTimeGoal",
      header: ({ column }) => {
        return (
          <Button
            className="cursor-pointer text-lg  hover:bg-blue-950 hover:text-white"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Giờ PG dư kiến
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("pgTimeGoal")}</div>,
    },
    // {
    //     accessorKey: "planDto.machineId",
    //     accessorFn: (row) => row.planDto?.machineId ?? "",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 className="cursor-pointer text-2xl font-bold hover:bg-blue-950 hover:text-white"
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Máy
    //                 <ArrowUpDown />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const machineId = row.original.machineDto?.machineId;
    //         const foundMachine = machine2.find(mc => mc.machineId === machineId);
    //         return <div>{foundMachine ? foundMachine.machineName : ""}</div>;
    //     }
    // },
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
  });

  return (
    <>
      <div className="w-full py-3 px-3 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <p className="text-2xl py-5 px-10 font-bold">
            DANH SÁCH MÃ BẢN VẼ TRONG QUÁ TRÌNH
          </p>
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
                variant="secondary"
                size="icon"
                className="px-18 py-5.5 text-lg max-[1300px]:text-2xl text-white max-[1300px]:font-extrabold bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
                onClick={() => setIsCreating(true)}
              >
                <Plus size={70} strokeWidth={3} color="white" />
                Tạo mới
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          {loading ? (
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
            <Table className="">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-center text-white bg-[#074695] p-2 font-semibold"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => {
                    const isOdd = index % 2 !== 0;
                    // return (
                    //     <Fragment key={row.id}>
                    //         <TableRow
                    //             className={`${isOdd ? "bg-gray-100" : ""} text-2xl font-semibold !border-none`}
                    //         >
                    //             {row.getVisibleCells().map((cell) => (
                    //                 <TableCell key={cell.id} className="text-center">
                    //                     {flexRender(
                    //                         cell.column.columnDef.cell,
                    //                         cell.getContext()
                    //                     )}
                    //                 </TableCell>
                    //             ))}
                    //         </TableRow>
                    //     </Fragment>
                    // );
                    return (
                      <Fragment key={row.id}>
                        <TableRow
                          className={`${isOdd ? "bg-gray-100" : ""
                            } text-base !border-none`}
                          // onClick={() => {
                          //   setExpandedRowId((prev) =>
                          //     prev === row.original.orderDetailId
                          //       ? null
                          //       : row.original.orderDetailId
                          //   );
                          //   // const may = machine2.find(
                          //   //   (m) =>
                          //   //     m.machineId ===
                          //   //     row.original.machineDto?.machineId
                          //   // )?.machineId;
                          //   // const nhanvien = staff.find(
                          //   //   (s) => s.staffId === row.original.planDto?.staffId
                          //   // )?.id;
                          //   // const point = row.original.manufacturingPoint;
                          //   // const pgTime = row.original.pgTime;

                          // setSelectedMachineId(may ? String(may) : "");
                          // setSelectedPGTime(pgTime ? String(pgTime) : "");
                          // setSelectedPoint(point ? String(point) : "");

                          //   // console.log(may ? String(may) : "");
                          //   // console.log(nhanvien ? String(nhanvien) : "");
                          // }}
                          onClick={async () => {
                            const id = row.original.orderDetailId;
                            setExpandedRowId((prev) =>
                              prev === id ? null : id
                            );

                            if (id !== expandedRowId) {
                              try {
                                const res = await axios.get<Process2[]>(
                                  `${URL}/api/drawing-code-process/orderDetail/${id}`
                                );
                                setSubProcesses(res.data);
                              } catch (e) {
                                console.error(
                                  "Lỗi gọi API processByOrderDetailId",
                                  e
                                );
                              }
                            }
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-center p-8">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {row.original.orderDetailId === expandedRowId && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-gray-50 p-5">
                              {/* <div className="p-5 border rounded-xl shadow-sm bg-white"> */}

                                <table className="w-full border-collapse text-sm">
                                  <thead>
                                    <tr className="bg-[#074695] text-white text-center">
                                      <th className="p-3 font-semibold  py-4  px-4">ID mã hàng</th>
                                      <th className="p-3 font-semibold">Thứ tự nguyên công</th>
                                      <th className="p-3 font-semibold">Thứ tự sản phẩm</th>
                                      <th className="p-3 font-semibold">Máy</th>
                                      <th className="p-3 font-semibold">Điểm</th>
                                      <th className="p-3 font-semibold">PG (phút)</th>
                                      <th className="p-3 font-semibold">Thao tác</th>
                                    </tr>
                                  </thead>

                                  <tbody className="bg-white">
                                    {subProcesses.length > 0 ? (
                                      subProcesses.map((p: any) => (
                                        <tr
                                          key={p.processId}
                                          className="text-center border-b hover:bg-gray-100 transition"
                                        >
                                          <td className="p-3">{p.machineId?.toString()}</td>

                                          <td className="p-3">{p.partNumber}</td>

                                          <td className="p-3">{p.stepNumber}</td>

                                          <td className="p-3">
                                            <Select
                                              value={p.machineId?.toString() ?? ""}
                                              onValueChange={(value) =>
                                                updateProcessMachine(p.processId, value)
                                              }
                                            >
                                              <SelectTrigger className="w-full h-11 text-base">
                                                <SelectValue placeholder="Máy" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  {machine2.map((m) => (
                                                    <SelectItem
                                                      key={m.machineId}
                                                      value={m.machineId.toString()}
                                                      className="text-base"
                                                    >
                                                      {m.machineName}
                                                    </SelectItem>
                                                  ))}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </td>

                                          <td className="p-3">
                                            <Input
                                              type="number"
                                              className="h-11"
                                              value={p.manufacturingPoint ?? ""}
                                              onChange={(e) =>
                                                updateProcessField(
                                                  p.processId,
                                                  "manufacturingPoint",
                                                  e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </td>

                                          <td className="p-3">
                                            <Input
                                              type="number"
                                              className="h-11"
                                              value={p.pgTime ?? ""}
                                              onChange={(e) =>
                                                updateProcessField(
                                                  p.processId,
                                                  "pgTime",
                                                  e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                              }
                                            />
                                          </td>

                                          <td className="p-3">
                                            <Button
                                              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg"
                                              onClick={() => handleSubmit(p.processId)}
                                            >
                                              Lưu
                                            </Button>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-500">
                                          Không có dữ liệu process!
                                        </td>
                                      </tr>
                                    )}  
                                  </tbody>
                                </table>
                              {/* </div> */}
                            </TableCell>
                          </TableRow>
                        )}
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
          )}
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-end space-x-2 py-5 px-5">
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
      </div>
    </>
  );
}
