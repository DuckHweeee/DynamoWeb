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
import { ArrowUpDown, MoreHorizontal, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { useGroups } from "@/hooks/useGroup";
import { useAdmin } from "@/hooks/useAdmin";
import { DailyReport, REPORT_TYPE_LABELS, REPORT_TYPE_OPTIONS, OFFICE_OPTIONS } from "@/lib/type";
import { useDailyReport, useDailyReportMutations } from "../hooks/useDailyReport";
import AddDailyReportForm from "./AddDailyReportForm";
import EditDailyReportForm from "./EditDailyReportForm";
import { DeleteDailyReportForm } from "./DeleteDailyReportForm";

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function getColumns({
  setEditingDailyReport,
  setShowForm,
  setDeletingDailyReport,
  handleDelete,
  groups,
  groupsLoading,
  admins,
  adminsLoading,
}: {
  setEditingDailyReport: (report: DailyReport | null) => void;
  setShowForm: (show: boolean) => void;
  setDeletingDailyReport: (report: DailyReport | null) => void;
  handleDelete: (reportId: number) => void;
  groups: any[];
  groupsLoading: boolean;
  admins: any[];
  adminsLoading: boolean;
}): ColumnDef<DailyReport>[] {
  return [
    {
      accessorKey: "dateTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Ngày
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg font-semibold text-[#074695]">
            {formatDate(row.getValue("dateTime"))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "office",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Phòng ban
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const officeValue = row.getValue("office") as string;
        const office = OFFICE_OPTIONS.find(opt => opt.value === officeValue);

        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            <div className="text-lg font-semibold">{office?.label || officeValue}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "groupId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Nhóm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const groupId = row.original.groupId;
        const group = groups.find((g) => g.groupId === groupId);

        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            <div className="text-lg font-semibold text-[#074695]">
              {groupsLoading ? (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                </div>
              ) : group ? (
                group.groupName
              ) : (
                "Nhóm không xác định"
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "reportType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Loại khai báo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const reportType = row.getValue("reportType") as string;
        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            <div className="text-lg font-semibold text-[#074695]">
              {REPORT_TYPE_LABELS[reportType as keyof typeof REPORT_TYPE_LABELS] || reportType}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "hourDiff",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Giờ tăng giảm thực
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const hourDiff = Number(row.getValue("hourDiff") || 0);
        const reportType = row.original.reportType;
        
        // Determine the expected sign and display based on report type
        const isOffOrLeave = reportType === 'off' || reportType === 'leave';
        const isOvertimeOrExtra = reportType === 'overtime' || reportType === 'extra';
        
        let displayValue = "";
        let colorClass = "text-[#074695]"; // default blue
        
        if (isOffOrLeave) {
          // Off/Leave should always show negative values
          displayValue = `-${Math.abs(hourDiff)}`;
          colorClass = "text-red-600";
        } else if (isOvertimeOrExtra) {
          // Overtime/Extra should always show positive values
          displayValue = `+${Math.abs(hourDiff)}`;
          colorClass = "text-green-600";
        } 
        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            <div className={`text-lg font-semibold ${colorClass}`}>
              {displayValue}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg font-semibold text-[#074695]">
            {formatDateTime(row.getValue("createdDate"))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "adminId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Người khai báo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const adminId = row.original.adminId;
        const admin = admins.find((a) => a.id === adminId);

        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            <div className="text-lg font-semibold text-[#074695]">
              {adminsLoading ? (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                </div>
              ) : admin ? (
                admin.fullname || admin.username
              ) : (
                "Người dùng không xác định"
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const report = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingDailyReport(report);
                  setShowForm(true);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeletingDailyReport(report)}
                className="text-red-600"
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export default function DailyReportPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingDailyReport, setEditingDailyReport] = useState<DailyReport | null>(null);
  const [deletingDailyReport, setDeletingDailyReport] = useState<DailyReport | null>(null);

  // Filter states
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [groupSearchFilter, setGroupSearchFilter] = useState("");

  const { data: dailyReports, loading, error, refetch } = useDailyReport();
  const { data: groups, loading: groupsLoading } = useGroups();
  const { data: admins, loading: adminsLoading } = useAdmin();
  const { deleteDailyReport } = useDailyReportMutations();

  // Filter data based on filters
  const filteredDailyReports = React.useMemo(() => {
    let filtered = dailyReports || [];

    // Filter by report type
    if (reportTypeFilter !== "all") {
      filtered = filtered.filter((report) => report.reportType === reportTypeFilter);
    }

    // Filter by year
    if (yearFilter !== null) {
      filtered = filtered.filter((report) => {
        const reportYear = new Date(report.dateTime).getFullYear();
        return reportYear === yearFilter;
      });
    }

    // Filter by month
    if (monthFilter !== null) {
      filtered = filtered.filter((report) => {
        const reportMonth = new Date(report.dateTime).getMonth() + 1;
        return reportMonth === monthFilter;
      });
    }

    return filtered;
  }, [dailyReports, reportTypeFilter, yearFilter, monthFilter]);

  // Additional filter for group search
  const finalFilteredData = React.useMemo(() => {
    if (!groupSearchFilter) return filteredDailyReports;

    return filteredDailyReports.filter((item) => {
      const groupId = item.groupId?.toString()?.toLowerCase() || "";
      const group = groups?.find((g) => g.groupId === item.groupId);
      const groupName = group?.groupName?.toLowerCase() || "";
      const searchTerm = groupSearchFilter?.toLowerCase() || "";

      return groupId.includes(searchTerm) || groupName.includes(searchTerm);
    });
  }, [filteredDailyReports, groupSearchFilter, groups]);

  const handleDelete = async (reportId: number) => {
    try {
      await deleteDailyReport(reportId);
      toast.success("Xóa báo cáo thành công!");
      setDeletingDailyReport(null);
      refetch();
    } catch (error) {
      toast.error("Lỗi khi xóa báo cáo");
    }
  };

  const handleAdd = (newReport: DailyReport) => {
    setShowForm(false);
    refetch();
  };

  const handleEdit = (updatedReport: DailyReport) => {
    setShowForm(false);
    setEditingDailyReport(null);
    refetch();
  };

  const clearFilters = () => {
    setReportTypeFilter("all");
    setYearFilter(null);
    setMonthFilter(null);
    setGroupSearchFilter("");
    // Clear office filter
    const officeColumn = table.getColumn("office");
    if (officeColumn) {
      officeColumn.setFilterValue("");
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const columns = getColumns({
    setEditingDailyReport,
    setShowForm,
    setDeletingDailyReport,
    handleDelete,
    groups: groups || [],
    groupsLoading,
    admins: admins || [],
    adminsLoading,
  });

  const table = useReactTable({
    data: finalFilteredData,
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

  const hasActiveFilters =
    reportTypeFilter !== "all" ||
    yearFilter !== null ||
    monthFilter !== null ||
    groupSearchFilter !== "" ||
    (table.getColumn("office")?.getFilterValue() as string) !== "";

  if (loading || groupsLoading || adminsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
      {/* Header with Filters */}
      <div className="space-y-4 py-4">
        {/* Title and Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex justify-start">
            <h1 className="text-2xl font-bold uppercase">Giờ Làm Việc Tăng Giảm Ngoài Kế Hoạch</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setEditingDailyReport(null);
                setShowForm(true);
              }}
              className="bg-[#004799] hover:bg-[#003b80] text-white px-6 py-2 rounded-md transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm báo cáo
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-2 border-t border-blue-300">
          {/* Report Type Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Loại báo cáo
            </label>
            <Select
              value={reportTypeFilter}
              onValueChange={(value: string) => setReportTypeFilter(value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {REPORT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Năm
            </label>
            <Select
              value={yearFilter?.toString() || "all"}
              onValueChange={(value) =>
                setYearFilter(value === "all" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm</SelectItem>
                {years.map((year: number) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Tháng
            </label>
            <Select
              value={monthFilter?.toString() || "all"}
              onValueChange={(value) =>
                setMonthFilter(value === "all" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tháng</SelectItem>
                {months.map((month: number) => (
                  <SelectItem key={month} value={month.toString()}>
                    Tháng {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Name Search */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Tên nhóm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <Input
                placeholder="Tìm nhóm..."
                value={groupSearchFilter}
                onChange={(event) => setGroupSearchFilter(event.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Office Search */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Phòng ban
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <Input
                placeholder="Tìm kiếm..."
                value={
                  (table.getColumn("office")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("office")?.setFilterValue(event.target.value)
                }
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Reset Filter Button */}
          {hasActiveFilters && (
            <div className="space-y-1 flex flex-col justify-end">
              <label className="text-xs font-medium text-transparent">
                Action
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                Đang hiển thị {table.getFilteredRowModel().rows.length} /{" "}
                {filteredDailyReports.length} kết quả
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {reportTypeFilter !== "all" && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {REPORT_TYPE_OPTIONS.find(opt => opt.value === reportTypeFilter)?.label}
                </span>
              )}
              {yearFilter && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Năm {yearFilter}
                </span>
              )}
              {monthFilter && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                  Tháng {monthFilter}
                </span>
              )}
              {(table.getColumn("office")?.getFilterValue() as string) && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  "{table.getColumn("office")?.getFilterValue() as string}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5">
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
                  Không có dữ liệu báo cáo nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Trang {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
          <span className="ml-2">
            ({table.getFilteredRowModel().rows.length} kết quả)
          </span>
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

      {/* Dialog for Add/Edit */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingDailyReport(null);
        }}
      >
        <DialogContent className="w-full max-[1550px]:!max-w-5xl min-[1550px]:!max-w-5xl !gap-5 pb-3 min-[1550px]:top-100">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#084188] font-semibold">
              {editingDailyReport ? "Chỉnh sửa báo cáo hàng ngày" : "Thêm báo cáo hàng ngày mới"}
            </DialogTitle>
          </DialogHeader>
          {editingDailyReport ? (
            <EditDailyReportForm
              report={editingDailyReport}
              onUpdate={handleEdit}
              onCancel={() => {
                setShowForm(false);
                setEditingDailyReport(null);
              }}
            />
          ) : (
            <AddDailyReportForm
              onAdd={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Form */}
      {deletingDailyReport && (
        <DeleteDailyReportForm
          dailyReport={deletingDailyReport}
          onDelete={handleDelete}
          onCancel={() => setDeletingDailyReport(null)}
        />
      )}
    </div>
  );
}