"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, CalendarIcon, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useStaffProcessHistory } from "@/hooks/useStaffProcessHistory";
import { DrawingCodeProcessHistory } from "@/lib/type";
import { Calendar as DatePicker } from "@/components/ui/calendar";

interface StaffProcessHistoryTableProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
}

export function StaffProcessHistoryTable({
  isOpen,
  onClose,
  staffId,
  staffName,
}: StaffProcessHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Convert dates to strings for API
  const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : null;
  const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : null;

  // Helper function to format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // Fetch staff process history data
  const {
    data: processHistory,
    loading,
    error,
    refetch,
  } = useStaffProcessHistory(staffId, startDateString, endDateString);

  const columns: ColumnDef<DrawingCodeProcessHistory>[] = [
    // {
    //     accessorKey: "createdDate",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             className="h-auto p-0 hover:bg-transparent text-xs"
    //         >
    //             <span className="font-semibold">Thời Gian</span>
    //             <ArrowUpDown className="ml-1 h-3 w-3" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => (
    //         <div className="font-medium text-xs">
    //             {formatTime(row.getValue("createdDate"))}
    //         </div>
    //     ),
    //     size: 130,
    // },
    {
      accessorKey: "orderDetailDto.orderCode",
      header: () => <div className="font-semibold text-xs">ID mã hàng</div>,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs px-2 py-1">
          {row.original.orderDetailDto?.orderCode || "N/A"}
        </Badge>
      ),
      size: 100,
    },
    {
      accessorKey: "processType",
      header: () => (
        <div className="font-semibold text-xs">Đối tượng sản phẩm</div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-xs">
          {row.getValue("processType") || "N/A"}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "partNumber",
      header: () => <div className="font-semibold text-xs text-center">TT Nguyên công</div>,
      cell: ({ row }) => (
        <div className="text-center text-xs">{row.getValue("partNumber")}</div>
      ),
      size: 60,
    },
    {
      accessorKey: "stepNumber",
      header: () => <div className="font-semibold text-xs text-center">TT Sản phẩm</div>,
      cell: ({ row }) => (
        <div className="text-center text-xs">{row.getValue("stepNumber")}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "manufacturingPoint",
      header: () => <div className="font-semibold text-xs text-center">Điểm Gia công</div>,
      cell: ({ row }) => (
        <div className="text-center text-xs">
          {row.getValue("manufacturingPoint")}
        </div>
      ),
      size: 70,
    },

    {
      accessorKey: "pgTime",
      header: () => <div className="font-semibold text-xs text-center">PG Time</div>,
      cell: ({ row }) => (
        <div className="text-center text-xs">{row.getValue("pgTime")} phút</div>
      ),
      size: 80,
    },
    {
      accessorKey: "machineDto.machineName",
      header: () => <div className="font-semibold text-xs">Máy</div>,
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs px-2 py-1">
          {row.original.machineDto?.machineName || "N/A"}
        </Badge>
      ),
      size: 80,
    },
    {
      accessorKey: "startTime",
      header: () => <div className="font-semibold text-xs">TG Bắt Đầu</div>,
      cell: ({ row }) => (
        <div className="text-xs">{formatTime(row.getValue("startTime"))}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "endTime",
      header: () => <div className="font-semibold text-xs">TG Kết Thúc</div>,
      cell: ({ row }) => {
        const endTime = row.getValue("endTime") as string;
        return (
          <div className="text-xs">
            {endTime ? formatTime(endTime) : "Chưa kết thúc"}
          </div>
        );
      },
      size: 120,
    },

  ];

  const table = useReactTable({
    data: processHistory,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Lịch Sử Quy Trình - {staffName}</ModalTitle>
      </ModalHeader>

      <ModalContent>
        <div className="flex-1 flex flex-col gap-4 overflow-hidden px-6 py-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={
                  (table
                    .getColumn("orderDetailDto_orderCode")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("orderDetailDto_orderCode")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[140px]",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Từ ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[140px]",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Đến ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={handleRefresh}
                className="px-3"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Loading or Error State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-red-500 mb-2">Có lỗi xảy ra</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Thử lại
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 border rounded-lg overflow-hidden min-h-0">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-gray-900 py-3 px-4 whitespace-nowrap"
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
                  {!loading && table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b border-gray-100"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-3 px-4 text-sm whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : !loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {error ? error : "Không có dữ liệu"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {table.getRowModel().rows?.length > 0 && (
            <div className="flex items-center justify-between flex-shrink-0">
              <div className="text-sm text-gray-700">
                Hiển thị {table.getFilteredRowModel().rows.length} /{" "}
                {processHistory.length} bản ghi
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Trước
                </Button>
                <div className="text-sm">
                  Trang {table.getState().pagination.pageIndex + 1} /{" "}
                  {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
