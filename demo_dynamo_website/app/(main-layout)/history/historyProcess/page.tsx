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
import { ArrowUpDown, Search, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCompletedProcess } from "@/hooks/useCompletedProcess";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProcessTable from "@/components/ProcessTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getEndOfDayVN, getStartOfDayVN } from "@/hooks/getTodayRangeVN";
import AddProcessForm from "../../process/components/addNewProcess";
import EditProcessForm from "../../process/components/editProcess";
import DetailProcess from "../../process/components/detailProcess";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Process } from "../../process/lib/type";
import CompletedProcessDetail from "./components/processDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function getColumns({
  setDetailOrderDetail,
  setOpenDetail,
  refetch,
}: {
  setDetailOrderDetail: (orderDetail: Process) => void;
  setOpenDetail: (show: boolean) => void;
  refetch: () => void;
}): ColumnDef<any>[] {
  return [
    {
      accessorKey: "orderDetailDto.orderCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          <span className="font-bold">ID Mã Hàng</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">
          {row.original.orderDetailDto?.orderCode}
        </div>
      ),
    },
    {
      accessorKey: "processType",
      header: () => <div className="font-bold text-base">Đối tượng gia công</div>,
      cell: ({ row }) => (
        <Badge className="py-2 px-4 bg-blue-50" variant="outline">{row.getValue("processType")}</Badge>
      ),
    },
    {
      accessorKey: "partNumber",
      header: () => <div className="font-bold text-base">TT Gia công</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("partNumber")}
        </div>
      ),
    },
    {
      accessorKey: "stepNumber",
      header: () => <div className="font-bold text-base">TT  Sản  phẩm</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("stepNumber")}
        </div>
      ),
    },

    {
      accessorKey: "machineDto.machineName",
      header: () => <div className="font-bold text-base">Máy</div>,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.machineDto?.machineName || "Chưa gán"}
        </div>
      ),
    },
    // {
    //   accessorKey: "staffDtos",
    //   header: () => <div className="font-bold text-base">Nhân viên</div>,
    //   cell: ({ row }) => (
    //     <div className="font-medium">
    //       {row.original.staffDtos
    //         ?.map((staff: any) => staff.staffName)
    //         .join(", ") || "Chưa gán"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "pgTime",
      header: () => <div className="font-bold text-base">PG Dự kiến</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("pgTime")} phút</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const orderDetail = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-lg cursor-pointer pr-6"
                onClick={() => {
                  setDetailOrderDetail(orderDetail);
                  setOpenDetail(true);
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-lg cursor-pointer pr-6"
                onClick={() => {
                  // setEditingOrderDetail(orderDetail);
                  // setShowForm(true);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              {/* {progress !== 2 && progress !== 3 && (
              <DropdownMenuItem
                className="text-lg cursor-pointer pr-6"
                onClick={() => {
                  setEditingOrderDetail(orderDetail);
                  deleteOrderDetail(orderDetail.orderDetailId, refetch);
                  console.log("delete", orderDetail.orderDetailId);
                }}
              >
                Xóa
              </DropdownMenuItem>
            )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export default function HistoryProcessPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  //const [date, setDate] = useState<DateRange | undefined>();
  const [selectedProcessType, setSelectedProcessType] = useState<string>("all");
  const [selectedMachine, setSelectedMachine] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const today = new Date();

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const start = React.useMemo(() => {
    if (!date?.from) return undefined;
    return getStartOfDayVN(date.from);
  }, [date?.from]);

  const stop = React.useMemo(() => {
    if (!date?.to) return undefined;
    return getEndOfDayVN(date.to);
  }, [date?.to]);
  // Fetch data using useCompletedProcess hook
  const { data: processData, loading, error, refetch } = useCompletedProcess(start, stop);

  // Extract unique values for filters from the data
  const processTypes = React.useMemo(() => {
    if (!processData) return [];
    const types = [
      ...new Set(processData.map((item) => item.processType).filter(Boolean)),
    ];
    return types.sort();
  }, [processData]);

  const machines = React.useMemo(() => {
    if (!processData) return [];
    const machineNames = [
      ...new Set(
        processData.map((item) => item.machineDto?.machineName).filter(Boolean)
      ),
    ];
    return machineNames.sort();
  }, [processData]);

  const staffMembers = React.useMemo(() => {
    if (!processData) return [];
    const staffNames: string[] = [];
    processData.forEach((item) => {
      item.staffDtos?.forEach((staff) => {
        if (staff.staffName) {
          staffNames.push(staff.staffName);
        }
      });
    });
    return [...new Set(staffNames)].sort();
  }, [processData]);

  const clearFilters = () => {
    const today = new Date();

    setDate({
      from: today,
      to: today,
    });

    setSelectedProcessType("all");
    setSelectedMachine("all");
    setSelectedStaff("all");

    refetch(
      getStartOfDayVN(today),
      getEndOfDayVN(today)
    );
  };

  const hasFilters =
    date ||
    selectedProcessType !== "all" ||
    selectedMachine !== "all" ||
    selectedStaff !== "all";

  // Filter the data based on selected filters
  const filteredData = React.useMemo(() => {
    if (!processData) return [];

    return processData.filter((item) => {
      // Process type filter
      if (
        selectedProcessType !== "all" &&
        item.processType !== selectedProcessType
      )
        return false;

      // Machine filter
      if (
        selectedMachine !== "all" &&
        item.machineDto?.machineName !== selectedMachine
      )
        return false;

      // Staff filter
      if (
        selectedStaff !== "all" &&
        !item.staffDtos?.some((staff) => staff.staffName === selectedStaff)
      )
        return false;

      return true;
    });
  }, [processData, date, selectedProcessType, selectedMachine, selectedStaff]);

  const [detailOrderDetail, setDetailOrderDetail] =
    useState<Process | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const columns = getColumns({
    setDetailOrderDetail,
    setOpenDetail,
    refetch,
  });
  const table = useReactTable({
    data: processData,
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
    <div className="m-2 py-3 bg-white rounded-[10px] shadow h-screen">
      {/* <div className="h-screen flex flex-col p-4 bg-gray-50"> */}
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 mx-4 flex-shrink-0">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
          {/* Date Range Picker */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between gap-2 w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md hover:border-gray-400 transition-colors min-w-[280px]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {date?.from
                        ? format(date.from, "dd/MM/yyyy")
                        : "Ngày bắt đầu"}{" "}
                      -{" "}
                      {date?.to
                        ? format(date.to, "dd/MM/yyyy")
                        : "Ngày kết thúc"}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                  mode="range"
                  selected={date}
                  onSelect={(range) => {
                    setDate(range);

                    if (range?.from && range?.to) {
                      refetch(
                        getStartOfDayVN(range.from),
                        getEndOfDayVN(range.to)
                      );
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Process Type Filter */}
          <div className="w-full xl:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại quy trình
            </label>
            <Select
              value={selectedProcessType}
              onValueChange={setSelectedProcessType}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                <SelectValue placeholder="Chọn loại quy trình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {processTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Machine Filter */}
          <div className="w-full xl:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máy
            </label>
            <Select value={selectedMachine} onValueChange={setSelectedMachine}>
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                <SelectValue placeholder="Chọn máy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả máy</SelectItem>
                {machines.map((machine) => (
                  <SelectItem key={machine} value={machine}>
                    {machine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Filter */}
          <div className="w-full xl:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhân viên
            </label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-10">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff} value={staff}>
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <div className="w-full xl:w-48">
            <label className="block text-sm font-medium text-transparent mb-2">
              Actions
            </label>
            <div className="flex gap-2">
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                  className="h-10 flex-1"
                >
                  Xóa bộ lọc
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                className="h-10 flex-1"
                onClick={() => refetch()}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Làm mới"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-xl font-bold">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center py-2">
                    {!header.isPlaceholder &&
                      flexRender(
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center font-medium text-[16px] text-[#888888] py-4"
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
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CompletedProcessDetail
          openDetail={openDetail}
          onClose={() => setOpenDetail(false)}
         process={detailOrderDetail}
        />
      </div>

    </div>
  );
}
