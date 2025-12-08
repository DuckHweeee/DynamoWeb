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
import { ArrowUpDown, MoreHorizontal, Plus, Search, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Staff } from "@/lib/type";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportButton } from "@/components/ImportButton"
import { toast } from "sonner";

interface OperatorTableProps {
  data: Staff[];
  loading?: boolean;
  error?: string | null;
  showAddButton?: boolean;
  showActions?: boolean;
  showViewHistory?: boolean;
  title?: string;
  onAdd?: () => void;
  onEdit?: (staff: Staff) => void;
  onDetail?: (staff: Staff) => void;
  onViewHistory?: (staffId: string, staffName: string) => void;
  editForm?: React.ReactNode;
  detailForm?: React.ReactNode;
  showEditDialog?: boolean;
  showDetailDialog?: boolean;
  onCloseEditDialog?: () => void;
  onCloseDetailDialog?: () => void;
  onImportSuccess?: () => void;
  showImportButton?: boolean;
}

function getColumns({
  showActions = true,
  showViewHistory = false,
  onEdit,
  onDetail,
  onViewHistory,
}: {
  showActions?: boolean;
  showViewHistory?: boolean;
  onEdit?: (staff: Staff) => void;
  onDetail?: (staff: Staff) => void;
  onViewHistory?: (staffId: string, staffName: string) => void;
}): ColumnDef<Staff>[] {
  const baseColumns: ColumnDef<Staff>[] = [
    {
      id: "stt",
      header: () => <span className="text-lg font-bold">STT</span>,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "staffId",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã nhân viên <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("staffId")}</div>
      ),
    },
    {
      accessorKey: "staffName",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên nhân viên <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("staffName")}</div>
      ),
    },
    {
      accessorKey: "staffOffice",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phòng Ban <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("staffOffice")}</div>
      ),
    },
    {
      accessorKey: "staffKpiDtos.groupName",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nhóm <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.staffKpiDtos?.groupName ?? "Chưa Có Nhóm"}
        </div>
      ),
    },
    {
      accessorKey: "staffSection",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Công Việc <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("staffSection")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng Thái <ArrowUpDown />
        </Button>
      ),
      cell: ({ getValue }) => {
        const value = getValue<number>();
        const isWorking = value === 1;
        return (
          <div
            className={`w-full px-4 py-1.5 rounded-sm text-center capitalize
        ${isWorking
                ? "bg-[#E7F7EF] text-[#0CAF60]"
                : "bg-[#FFE6E6] text-[#FE4A4A]"
              }`}
          >
            {isWorking ? "Đang Làm" : "Đã Nghỉ"}
          </div>
        );
      },
    },
  ];

  // Add action columns based on props
  if (showViewHistory && onViewHistory) {
    baseColumns.push({
      id: "viewHistory",
      header: () => <div className="font-bold">Lịch Sử</div>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onViewHistory(row.original.id, row.getValue("staffName"))
          }
          className="h-8 px-3"
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem Lịch Sử
        </Button>
      ),
    });
  }

  if (showActions && (onEdit || onDetail)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={80} strokeWidth={3} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onDetail && (
                <DropdownMenuItem
                  className="text-lg cursor-pointer pr-6"
                  onClick={() => onDetail(staff)}
                >
                  Thông tin chi tiết
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  className="text-lg cursor-pointer"
                  onClick={() => onEdit(staff)}
                >
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return baseColumns;
}

export function OperatorTable({
  data,
  loading = false,
  error = null,
  showAddButton = false,
  showActions = true,
  showViewHistory = false,
  title = "Danh Sách Nhân Viên",
  onAdd,
  onEdit,
  onDetail,
  onViewHistory,
  editForm,
  detailForm,
  showEditDialog = false,
  showDetailDialog = false,
  onCloseEditDialog,
  onCloseDetailDialog,
  showImportButton = true,
  onImportSuccess,
}: OperatorTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = getColumns({
    showActions,
    showViewHistory,
    onEdit,
    onDetail,
    onViewHistory,
  });

  const table = useReactTable({
    data,
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const handleImportSuccess = () => {
    if (onImportSuccess) {
      toast.success("Thêm mới thành công!");
      onImportSuccess()
    }
  }

  return (
    <div className="bg-white rounded-[10px] px-6 mx-2 h-screen">
      <div className="flex flex-row items-center justify-between py-4 bg-white">
        <div className="w-2/3">
          <p className="text-2xl font-bold">{title}</p>
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

          {showAddButton && onAdd && (
            <Button
              variant="secondary"
              size="icon"
              className="px-10 py-6 bg-[#074695] hover:bg-[#0754B4] cursor-pointer"
              onClick={onAdd}
            >
              <Plus size={60} strokeWidth={5} color="white" />
            </Button>
          )}

          {showImportButton && (
            <ImportButton
              endpoint="staff/upload"
              title="Import dữ liệu nhân viên"
              description="Chọn file Excel để import dữ liệu nhân viên vào hệ thống"
              onImportSuccess={handleImportSuccess}
              variant="outline"
              size="lg"
              className="px-4 py-6 bg-green-600 hover:bg-green-700 cursor-pointer text-white hover:text-white"
            />
          )}
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center font-medium text-[16px] text-[#888888] py-5"
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
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {showEditDialog && editForm && (
        <Dialog open={showEditDialog} onOpenChange={onCloseEditDialog}>
          <DialogContent className="w-full max-[1550px]:!max-w-6xl min-[1550px]:!max-w-7xl !gap-5 pb-3 min-[1550px]:top-100">
            <DialogHeader>
              <DialogTitle className="text-3xl text-[#084188] font-semibold">
                Chỉnh sửa nhân viên
              </DialogTitle>
            </DialogHeader>
            {editForm}
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Dialog */}
      {showDetailDialog && detailForm && (
        <Dialog open={showDetailDialog} onOpenChange={onCloseDetailDialog}>
          <DialogContent className="w-full max-[1550px]:!max-w-6xl min-[1550px]:!max-w-7xl !gap-5 pb-3 min-[1550px]:top-100">
            <DialogHeader>
              <DialogTitle className="text-3xl text-[#084188] font-semibold">
                Thông tin chi tiết nhân viên
              </DialogTitle>
            </DialogHeader>
            {detailForm}
          </DialogContent>
        </Dialog>
      )}



      <div className="flex items-center justify-end space-x-2 py-4">
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
    // </div>
  );
}
