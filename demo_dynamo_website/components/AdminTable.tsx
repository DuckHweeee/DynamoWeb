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
import { Admin } from "@/lib/type";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AdminTableProps {
  data: Admin[];
  loading?: boolean;
  error?: string | null;
  showAddButton?: boolean;
  showActions?: boolean;
  showViewHistory?: boolean;
  title?: string;
  onAdd?: () => void;
  onEdit?: (admin: Admin) => void;
  onDetail?: (admin: Admin) => void;
  onDelete?: (admin: Admin) => void;
  onViewHistory?: (adminId: string, adminName: string) => void;
  editForm?: React.ReactNode;
  detailForm?: React.ReactNode;
  showEditDialog?: boolean;
  showDetailDialog?: boolean;
  onCloseEditDialog?: () => void;
  onCloseDetailDialog?: () => void;
}

function getColumns({
  showActions = true,
  showViewHistory = false,
  onEdit,
  onDetail,
  onDelete,
  onViewHistory,
}: {
  showActions?: boolean;
  showViewHistory?: boolean;
  onEdit?: (admin: Admin) => void;
  onDetail?: (admin: Admin) => void;
  onDelete?: (admin: Admin) => void;
  onViewHistory?: (adminId: string, adminName: string) => void;
}): ColumnDef<Admin>[] {
  const baseColumns: ColumnDef<Admin>[] = [
    {
      id: "stt",
      header: () => <span className="text-lg font-bold">STT</span>,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên đăng nhập <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Họ và tên <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fullname")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vai trò <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const roles = row.original.role;
        return (
          <div className="flex flex-wrap gap-1">
            {roles && roles.length > 0 ? (
              roles.map((role, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {role.name.replace('ROLE_', '')}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Chưa có vai trò</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdDate"));
        return <div>{date.toLocaleDateString('vi-VN')}</div>;
      },
    },
    {
      accessorKey: "updatedDate",
      header: ({ column }) => (
        <Button
          className="text-lg font-bold cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày cập nhật <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedDate"));
        return <div>{date.toLocaleDateString('vi-VN')}</div>;
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
            onViewHistory(row.original.id, row.getValue("fullname"))
          }
          className="h-8 px-3"
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem Lịch Sử
        </Button>
      ),
    });
  }

  if (showActions && (onEdit || onDetail || onDelete)) {
    baseColumns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const admin = row.original;
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
                  onClick={() => onDetail(admin)}
                >
                  Thông tin chi tiết
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  className="text-lg cursor-pointer"
                  onClick={() => onEdit(admin)}
                >
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-lg cursor-pointer text-red-600"
                  onClick={() => onDelete(admin)}
                >
                  Xóa
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

export function AdminTable({
  data,
  loading = false,
  error = null,
  showAddButton = false,
  showActions = true,
  showViewHistory = false,
  title = "Danh Sách Quản Trị Viên",
  onAdd,
  onEdit,
  onDetail,
  onDelete,
  onViewHistory,
  editForm,
  detailForm,
  showEditDialog = false,
  showDetailDialog = false,
  onCloseEditDialog,
  onCloseDetailDialog,
}: AdminTableProps) {
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
    onDelete,
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
                      className="text-center font-medium text-[16px] text-[#888888]"
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
                Chỉnh sửa quản trị viên
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
                Thông tin chi tiết quản trị viên
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
  );
}