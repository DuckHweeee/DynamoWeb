"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { GroupKPI, NewGroupKPI } from "../lib/type";
import { FlexibleCombobox } from "./FlexibleCombobox";
import WeekPicker from "../components/WeekPicker";
import DatePicker from "../components/DatePicker";
import { useGroups } from "@/hooks/useGroup";
import { useGroupKPIMutations } from "@/hooks/useGroupKPI";
import { getCurrentWeek, getWeeksInYear } from "../lib/utils";
import { officeList } from "@/app/(main-layout)/operator/lib/data";

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

type AddGroupKPIFormProps = {
  onAdd: (groupKPI: GroupKPI) => void;
  onCancel: () => void;
};

export default function AddNewGroupKPI({
  onAdd,
  onCancel,
}: AddGroupKPIFormProps) {
  const [newGroupKPI, setNewGroupKPI] = useState<NewGroupKPI>({
    groupId: "",
    year: null,
    month: null,
    week: null,
    day: null,
    isMonth: 0, // Default to monthly
    office: "",
    workingHourGoal: null,
  });

  const { data: groups, loading: groupsLoading } = useGroups();
  const { createGroupKPI, loading } = useGroupKPIMutations();

  const handleSubmit = async () => {
    if (
      !newGroupKPI.groupId ||
      newGroupKPI.year === null ||
      !newGroupKPI.office ||
      newGroupKPI.workingHourGoal === null
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    

    try {
      // Prepare data based on isMonth flag
      const kpiData = {
        ...newGroupKPI,
        month: newGroupKPI.isMonth === 1 ? newGroupKPI.month : null,
        week: newGroupKPI.isMonth === 0 ? newGroupKPI.week : null,
     
        groupName: selectedGroupName, // Include group name from the selected group
      };

      const result = await createGroupKPI(kpiData);
      onAdd(result);
      toast.success("Thêm KPI nhóm thành công!");
    } catch (error) {
      console.error("Error adding group KPI:", error);
      toast.error("Lỗi khi thêm KPI nhóm");
    }
  };

  const handleInputChange = (
    field: keyof NewGroupKPI,
    value: string | number | null
  ) => {
    setNewGroupKPI((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKPITypeChange = (value: string) => {
    const isMonth = parseInt(value);
    setNewGroupKPI((prev) => ({
      ...prev,
      isMonth,
      month: isMonth === 1 ? prev.month : null,
      week: isMonth === 0 ? prev.week : null,
     
    }));
  };

  // Transform groups data for combobox
  const groupOptions = groups.map((group) => ({
    value: group.groupId,
    label: group.groupName,
  }));

  // Get selected group name
  const selectedGroup = groups.find(
    (group) => group.groupId === newGroupKPI.groupId
  );
  const selectedGroupName = selectedGroup ? selectedGroup.groupName : "";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate weeks for the selected year
  const selectedYear = newGroupKPI.year || currentYear;
  const weeksInYear = getWeeksInYear(selectedYear);
  const weeks = Array.from({ length: weeksInYear }, (_, i) => i + 1);

  // Generate days for the selected month and year
  const selectedMonth = newGroupKPI.month || 1;
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 p-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="group">Nhóm *</Label>
            {groupsLoading ? (
              <div className="h-10 bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : (
              <>
                <FlexibleCombobox
                  options={groupOptions}
                  value={newGroupKPI.groupId}
                  onSelect={(value) => handleInputChange("groupId", value)}
                  placeholder="Chọn nhóm..."
                  searchPlaceholder="Tìm kiếm nhóm..."
                  emptyMessage="Không tìm thấy nhóm."
                />
                {selectedGroupName && (
                  <div className="text-sm text-muted-foreground">
                    Nhóm đã chọn:{" "}
                    <span className="font-medium">{selectedGroupName}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* <div className="space-y-2">
                        <Label htmlFor="office">Văn phòng *</Label>
                        <Input
                            id="office"
                            type="text"
                            value={newGroupKPI.office}
                            onChange={(e) => handleInputChange("office", e.target.value)}
                            placeholder="Nhập tên văn phòng..."
                        />
                    </div> */}
          <div className="space-y-2">
            <Label htmlFor="office">Phòng ban *</Label>
            <Select
              value={newGroupKPI.office || ""}
              onValueChange={(value) =>
                setNewGroupKPI({ ...newGroupKPI, office: value })
              }
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent id="nhom">
                <SelectGroup>
                  {officeList.map((g) => (
                    <SelectItem key={g.name} value={g.name.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Time Period Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Thời gian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="year">Năm *</Label>
            <FlexibleCombobox
              options={years.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              }))}
              value={newGroupKPI.year?.toString() || ""}
              onSelect={(value) =>
                handleInputChange("year", value ? parseInt(value) : null)
              }
              placeholder="Chọn năm..."
              searchPlaceholder="Tìm kiếm năm..."
              emptyMessage="Không tìm thấy năm."
            />
          </div>

          <div className="space-y-2">
            <Label>Loại KPI *</Label>
            <Select
              value={newGroupKPI.isMonth.toString()}
              onValueChange={handleKPITypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại KPI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Theo tháng</SelectItem>
                <SelectItem value="0">Theo tuần</SelectItem>
                {/* <SelectItem value="2">Theo ngày</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Period-specific selection */}
        <div className="grid grid-cols-1 gap-6">
          {newGroupKPI.isMonth === 1 && (
            <div className="space-y-2">
              <Label htmlFor="month">Tháng *</Label>
              <FlexibleCombobox
                options={months.map((month) => ({
                  value: month.toString(),
                  label: `Tháng ${month}`,
                }))}
                value={newGroupKPI.month?.toString() || ""}
                onSelect={(value) =>
                  handleInputChange("month", value ? parseInt(value) : null)
                }
                placeholder="Chọn tháng..."
                searchPlaceholder="Tìm kiếm tháng..."
                emptyMessage="Không tìm thấy tháng."
              />
            </div>
          )}

          {newGroupKPI.isMonth === 0 && (
            <div className="space-y-2">
              <Label htmlFor="week">Tuần *</Label>
              <WeekPicker
                value={newGroupKPI.week}
                year={newGroupKPI.year}
                onSelect={(week) => handleInputChange("week", week)}
                placeholder="Chọn tuần..."
              />
            </div>
          )}

          {/* {newGroupKPI.isMonth === 2 && (
            <div className="space-y-2">
              <Label htmlFor="date">Ngày *</Label>
              <DatePicker
                value={{ day: newGroupKPI.day, month: newGroupKPI.month }}
                year={newGroupKPI.year}
                onSelect={(day, month) => {
                  handleInputChange("day", day);
                  handleInputChange("month", month);
                }}
                placeholder="Chọn ngày..."
              />
            </div>
          )} */}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Chỉ số hiệu suất
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="workingHourGoal">Mục tiêu giờ làm việc *</Label>
            <Input
              id="workingHourGoal"
              type="number"
              step="0.1"
              value={newGroupKPI.workingHourGoal || ""}
              onChange={(e) =>
                handleInputChange(
                  "workingHourGoal",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              placeholder="Nhập mục tiêu giờ làm việc"
            />
            <p className="text-xs text-muted-foreground">
              Hệ thống sẽ tự động tính toán giờ làm việc thực tế và chênh lệch
              dựa trên mục tiêu này
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="px-6">
          {loading ? "Đang thêm..." : "Thêm KPI"}
        </Button>
      </div>
    </div>
  );
}
