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
import { ArrowUpDown, MoreHorizontal, Plus, Search, X, Upload } from "lucide-react";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGroupKPI,
  useGroupKPIMutations,
} from "../../../../hooks/useGroupKPI";
import { useGroups } from "../../../../hooks/useGroup";
import { GroupKPI } from "./lib/type";
import AddNewGroupKPI from "./components/addNewGroupKPI";
import EditGroupKPIForm from "./components/editGroupKPI";
import WeekPicker from "./components/WeekPicker";
import DatePicker from "./components/DatePicker";
import { ImportDialog } from "@/components/ImportDialog";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

function getColumns({
  setEditingGroupKPI,
  setShowForm,
  handleDelete,
  groups,
  groupsLoading,
}: {
  setEditingGroupKPI: (groupKPI: GroupKPI | null) => void;
  setShowForm: (show: boolean) => void;
  handleDelete: (kpiId: number) => void;
  groups: any[];
  groupsLoading: boolean;
}): ColumnDef<GroupKPI>[] {
  return [
    {
      accessorKey: "office",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Văn Phòng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg font-semibold">{row.getValue("office")}</div>
          {/* <div className="text-sm text-muted-foreground font-normal flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            ID: {row.original.groupId.substring(0, 8)}
          </div> */}
        </div>
      ),
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
            Tên Nhóm
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
            {/* <div className="text-sm text-muted-foreground font-normal flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              ID: {groupId ? groupId.substring(0, 12) : "N/A"}
            </div> */}
          </div>
        );
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Năm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg font-semibold text-[#074695]">
            {row.getValue("year")}
          </div>
          {/* <div className="text-sm text-muted-foreground">
            {new Date().getFullYear() === row.getValue("year") ? (
              <span className="text-green-600 font-medium">Năm hiện tại</span>
            ) : (
              "Năm trước"
            )}
          </div> */}
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Chu Kỳ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const groupKPI = row.original;
        const getPeriodColor = (isMonth: number) => {
          if (isMonth === 0) return "bg-purple-100 text-purple-700";
          if (isMonth === 1) return "bg-orange-100 text-orange-700";
          return "bg-pink-100 text-pink-700";
        };

        return (
          <div className="pl-5 font-medium text-[16px] text-[#888888]">
            {groupKPI.isMonth === 0 ? (
              <div className="text-lg font-semibold">
                Tháng {groupKPI.month}
              </div>
            ) : groupKPI.isMonth === 1 ? (
              <div className="text-lg font-semibold">Tuần {groupKPI.week}</div>
            ) : (
              <div className="text-lg font-semibold">
                Ngày {groupKPI.day}/{groupKPI.month}
              </div>
            )}
            <div className="text-sm mt-1">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getPeriodColor(
                  groupKPI.isMonth
                )}`}
              >
                {groupKPI.isMonth === 0
                  ? "Hàng tháng"
                  : groupKPI.isMonth === 1
                    ? "Hàng tuần"
                    : "Hàng ngày"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "workingHourGoal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Mục Tiêu (Giờ)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg font-semibold text-[#074695]">
            {Number(row.getValue("workingHourGoal")).toFixed(1)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "workingHour",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Thực Tế (Giờ)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-5 font-medium text-[16px] text-[#888888]">
          <div className="text-lg">
            {Number(row.getValue("workingHour")).toFixed(1)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "workingHourDifference",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-lg font-bold"
          >
            Chênh Lệch
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const difference = Number(row.getValue("workingHourDifference"));
        const isPositive = difference >= 0;
        return (
          <div className="pl-5 font-medium text-[16px]">
            <div
              className={`text-lg font-semibold ${isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
              {isPositive ? "+" : ""}
              {difference.toFixed(1)}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const groupKPI = row.original;

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
                  setEditingGroupKPI(groupKPI);
                  setShowForm(true);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(groupKPI.id)}
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

export default function GroupKPIPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingGroupKPI, setEditingGroupKPI] = useState<GroupKPI | null>(null);
  const [showImportDialogWeek, setShowImportDialogWeek] = useState(false);
  const [showImportDialogMonth, setShowImportDialogMonth] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<
    "all" | "month" | "week" | "day"
  >("all");

  // Date filtering states
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [weekFilter, setWeekFilter] = useState<number | null>(null);
  const [dayFilter, setDayFilter] = useState<number | null>(null);
  const [dayMonthFilter, setDayMonthFilter] = useState<number | null>(null);
  const [groupSearchFilter, setGroupSearchFilter] = useState("");

  const { data: groupKPIs, loading, error, refetch } = useGroupKPI();
  const { data: groups, loading: groupsLoading } = useGroups();
  const { deleteGroupKPI } = useGroupKPIMutations();
  const router = useRouter();

  // Filter data based on period type and date filters
  const filteredGroupKPIs = React.useMemo(() => {
    let filtered = groupKPIs;

    // Filter by period type
    if (periodFilter === "month")
      filtered = filtered.filter((kpi) => kpi.isMonth === 1);
    else if (periodFilter === "week")
      filtered = filtered.filter((kpi) => kpi.isMonth === 0);
    else if (periodFilter === "day")
      filtered = filtered.filter((kpi) => kpi.isMonth === 2);

    // Filter by year
    if (yearFilter !== null) {
      filtered = filtered.filter((kpi) => kpi.year === yearFilter);
    }

    // Filter by month (for monthly KPIs)
    if (monthFilter !== null && periodFilter === "month") {
      filtered = filtered.filter((kpi) => kpi.month === monthFilter);
    }

    // Filter by week (for weekly KPIs)
    if (weekFilter !== null && periodFilter === "week") {
      filtered = filtered.filter((kpi) => kpi.week === weekFilter);
    }

    // Filter by day (for daily KPIs)
    if (
      dayFilter !== null &&
      dayMonthFilter !== null &&
      periodFilter === "day"
    ) {
      filtered = filtered.filter(
        (kpi) => kpi.day === dayFilter && kpi.month === dayMonthFilter
      );
    }

    return filtered;
  }, [
    groupKPIs,
    periodFilter,
    yearFilter,
    monthFilter,
    weekFilter,
    dayFilter,
    dayMonthFilter,
  ]);

  // Additional filter for group search
  const finalFilteredData = React.useMemo(() => {
    if (!groupSearchFilter) return filteredGroupKPIs;

    return filteredGroupKPIs.filter((item) => {
      const groupId = item.groupId?.toString()?.toLowerCase() || "";
      const group = groups?.find((g) => g.groupId === item.groupId);
      const groupName = group?.groupName?.toLowerCase() || "";
      const searchTerm = groupSearchFilter?.toLowerCase() || "";

      return groupId.includes(searchTerm) || groupName.includes(searchTerm);
    });
  }, [filteredGroupKPIs, groupSearchFilter, groups]);

  const handleDelete = async (kpiId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa KPI này không?")) {
      try {
        await deleteGroupKPI(kpiId);
        toast.success("Xóa KPI thành công!");
        refetch();
      } catch (error) {
        toast.error("Lỗi khi xóa KPI");
      }
    }
  };

  const handleAdd = (newGroupKPI: GroupKPI) => {
    setShowForm(false);
    refetch();
  };

  const handleEdit = (updatedGroupKPI: GroupKPI) => {
    setShowForm(false);
    setEditingGroupKPI(null);
    refetch();
  };

  const handleImportSuccess = () => {
    toast.success("Import KPI nhóm thành công!");
    refetch();
    if (showImportDialogWeek === true) setShowImportDialogWeek(false);
    if (showImportDialogMonth === true) setShowImportDialogMonth(false);
  };

  const clearFilters = () => {
    setPeriodFilter("all");
    setYearFilter(null);
    setMonthFilter(null);
    setWeekFilter(null);
    setDayFilter(null);
    setDayMonthFilter(null);
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
    setEditingGroupKPI,
    setShowForm,
    handleDelete,
    groups,
    groupsLoading,
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
    periodFilter !== "all" ||
    yearFilter !== null ||
    monthFilter !== null ||
    weekFilter !== null ||
    dayFilter !== null ||
    dayMonthFilter !== null ||
    groupSearchFilter !== "" ||
    (table.getColumn("office")?.getFilterValue() as string) !== "";

  if (loading || groupsLoading) {
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
            <h1 className="text-2xl font-bold">Quản Lý KPI Nhóm</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setEditingGroupKPI(null);
                setShowForm(true);
              }}
              className="bg-[#004799] hover:bg-[#003b80] text-white px-6 py-2 rounded-md transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm KPI
            </Button>
            <Button
              onClick={() => setShowImportDialogMonth(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition mr-2"
            >
              <Upload className="h-5 w-5 mr-2" />
              KPI Tháng
            </Button>
            <Button
              onClick={() => setShowImportDialogWeek(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition mr-2"
            >
              <Upload className="h-5 w-5 mr-2" />
              KPI Tuần
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 pt-2 border-t">
          {/* Period Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 tracking-wide">
              Loại KPI
            </label>
            <Select
              value={periodFilter}
              onValueChange={(value: "all" | "month" | "week" | "day") =>
                setPeriodFilter(value)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="day">Theo ngày</SelectItem>
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
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter (for monthly KPIs) */}
          {periodFilter === "month" && (
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
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Tháng {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Week Filter (for weekly KPIs) */}
          {periodFilter === "week" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 tracking-wide">
                Tuần
              </label>
              <WeekPicker
                value={weekFilter}
                year={yearFilter}
                onSelect={(week) => setWeekFilter(week)}
                placeholder="Chọn tuần..."
              />
            </div>
          )}

          {/* Day Filter (for daily KPIs) */}
          {periodFilter === "day" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 tracking-wide">
                Ngày
              </label>
              <DatePicker
                value={{ day: dayFilter, month: dayMonthFilter }}
                year={yearFilter}
                onSelect={(day, month) => {
                  setDayFilter(day);
                  setDayMonthFilter(month);
                }}
                placeholder="Chọn ngày..."
              />
            </div>
          )}

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
                {filteredGroupKPIs.length} kết quả
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {periodFilter !== "all" && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {periodFilter === "month"
                    ? "Theo tháng"
                    : periodFilter === "week"
                      ? "Theo tuần"
                      : "Theo ngày"}
                </span>
              )}
              {yearFilter && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Năm {yearFilter}
                </span>
              )}
              {monthFilter && periodFilter === "month" && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                  Tháng {monthFilter}
                </span>
              )}
              {weekFilter && periodFilter === "week" && (
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                  Tuần {weekFilter}
                </span>
              )}
              {dayFilter && dayMonthFilter && periodFilter === "day" && (
                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-medium">
                  {dayFilter}/{dayMonthFilter}
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
                    <TableCell key={cell.id}>
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
                  Không có dữ liệu KPI nào.
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
          if (!open) setEditingGroupKPI(null);
        }}
      >
        <DialogContent className="w-full max-[1550px]:!max-w-5xl min-[1550px]:!max-w-5xl !gap-5 pb-3 min-[1550px]:top-100">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#084188] font-semibold">
              {editingGroupKPI ? "Chỉnh sửa KPI Nhóm" : "Thêm KPI Nhóm Mới"}
            </DialogTitle>
          </DialogHeader>
          {editingGroupKPI ? (
            <EditGroupKPIForm
              groupKPI={editingGroupKPI}
              onEdit={handleEdit}
              onCancel={() => {
                setShowForm(false);
                setEditingGroupKPI(null);
              }}
            />
          ) : (
            <AddNewGroupKPI
              onAdd={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ImportDialog
        isOpen={showImportDialogWeek}
        onClose={() => setShowImportDialogWeek(false)}
        onImportSuccess={handleImportSuccess}
        endpoint="groupKpi/upload/week"
        title="Import KPI Nhóm từ Excel"
        description="Chọn file Excel để import danh sách KPI nhóm"
      />
      <ImportDialog
        isOpen={showImportDialogMonth}
        onClose={() => setShowImportDialogMonth(false)}
        onImportSuccess={handleImportSuccess}
        endpoint="groupKpi/upload/month"
        title="Import KPI Nhóm từ Excel"
        description="Chọn file Excel để import danh sách KPI nhóm"
      />
    </div>
  );
}
