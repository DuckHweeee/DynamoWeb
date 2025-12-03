"use client";

import { useState, useEffect } from "react";
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
import { GroupKPI } from "../lib/type";
import { FlexibleCombobox } from "./FlexibleCombobox";
import WeekPicker from "../components/WeekPicker";
import DatePicker from "../components/DatePicker";
import { useGroups } from "@/hooks/useGroup";
import { useGroupKPIMutations } from "@/hooks/useGroupKPI";
import { getWeeksInYear } from "../lib/utils";
import { officeList } from "@/app/(main-layout)/operator/lib/data";

type EditGroupKPIFormProps = {
  groupKPI: GroupKPI;
  onEdit: (groupKPI: GroupKPI) => void;
  onCancel: () => void;
};

export default function EditGroupKPIForm({
  groupKPI,
  onEdit,
  onCancel,
}: EditGroupKPIFormProps) {
  const [editGroupKPI, setEditGroupKPI] = useState<Partial<GroupKPI>>({});

  const { data: groups, loading: groupsLoading } = useGroups();
  const { updateGroupKPI, loading } = useGroupKPIMutations();

  useEffect(() => {
    if (groupKPI) {
      setEditGroupKPI(groupKPI);
    }
  }, [groupKPI]);

  const handleSubmit = async () => {
    if (
      !editGroupKPI.groupId ||
      editGroupKPI.year === null ||
      !editGroupKPI.office ||
      editGroupKPI.workingHourGoal === null ||
      (editGroupKPI.isMonth === 1 && editGroupKPI.month === null) ||
      (editGroupKPI.isMonth === 0 && editGroupKPI.week === null) 

    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Prepare data based on isMonth flag
      const kpiData = {
        ...editGroupKPI,
        month: editGroupKPI.isMonth === 1 ? editGroupKPI.month : null,
        week: editGroupKPI.isMonth === 0 ? editGroupKPI.week : null,
        
      };

      const result = await updateGroupKPI(editGroupKPI.id!, kpiData);
      onEdit(result);
      toast.success("Cập nhật KPI nhóm thành công!");
    } catch (error) {
      console.error("Error updating group KPI:", error);
      toast.error("Lỗi khi cập nhật KPI nhóm");
    }
  };

  const handleInputChange = (
    field: keyof GroupKPI,
    value: string | number | null
  ) => {
    setEditGroupKPI((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKPITypeChange = (value: string) => {
    const isMonth = parseInt(value);
    setEditGroupKPI((prev) => ({
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
    (group) => group.groupId === editGroupKPI.groupId
  );
  const selectedGroupName = selectedGroup ? selectedGroup.groupName : "";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate weeks for the selected year
  const selectedYear = editGroupKPI.year || currentYear;
  const weeksInYear = getWeeksInYear(selectedYear);
  const weeks = Array.from({ length: weeksInYear }, (_, i) => i + 1);

  // Generate days for the selected month and year
  const selectedMonth = editGroupKPI.month || 1;
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
                  value={editGroupKPI.groupId || ""}
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
              value={editGroupKPI.office || ""}
              onChange={(e) => handleInputChange("office", e.target.value)}
              placeholder="Nhập tên văn phòng..."
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="office">Phòng ban *</Label>
            <Select
              value={editGroupKPI.office || ""}
              onValueChange={(value) =>
                setEditGroupKPI({ ...editGroupKPI, office: value })
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
              value={editGroupKPI.year?.toString() || ""}
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
              value={editGroupKPI.isMonth?.toString() || "0"}
              onValueChange={handleKPITypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại KPI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Theo tháng</SelectItem>
                <SelectItem value="0">Theo tuần</SelectItem>
               
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Period-specific selection */}
        <div className="grid grid-cols-1 gap-6">
          {editGroupKPI.isMonth === 1 && (
            <div className="space-y-2">
              <Label htmlFor="month">Tháng *</Label>
              <FlexibleCombobox
                options={months.map((month) => ({
                  value: month.toString(),
                  label: `Tháng ${month}`,
                }))}
                value={editGroupKPI.month?.toString() || ""}
                onSelect={(value) =>
                  handleInputChange("month", value ? parseInt(value) : null)
                }
                placeholder="Chọn tháng..."
                searchPlaceholder="Tìm kiếm tháng..."
                emptyMessage="Không tìm thấy tháng."
              />
            </div>
          )}

          {editGroupKPI.isMonth === 0 && (
            <div className="space-y-2">
              <Label htmlFor="week">Tuần *</Label>
              <WeekPicker
                value={editGroupKPI.week}
                year={editGroupKPI.year}
                onSelect={(week) => handleInputChange("week", week)}
                placeholder="Chọn tuần..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="space-y-4">
       
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="workingHourGoal">Mục tiêu giờ làm việc *</Label>
            <Input
              id="workingHourGoal"
              type="number"
              step="0.1"
              value={editGroupKPI.workingHourGoal || ""}
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
          {loading ? "Đang cập nhật..." : "Cập nhật KPI"}
        </Button>
      </div>
    </div>
  );
}
