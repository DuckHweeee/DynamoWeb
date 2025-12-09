"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css"

import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useGroups } from "@/hooks/useGroup";
import { useAdmin } from "@/hooks/useAdmin";
import { Group } from "@/lib/type";
import { DailyReport, REPORT_TYPE_OPTIONS, OFFICE_OPTIONS } from "@/lib/type";
import { useDailyReportMutations } from "../hooks/useDailyReport";

interface AddDailyReportFormProps {
  onAdd: (report: DailyReport) => void;
  onCancel: () => void;
}

export default function AddDailyReportForm({
  onAdd,
  onCancel,
}: AddDailyReportFormProps) {
  const { user } = useAuth();
  const { data: groups } = useGroups();
  const { data: admins } = useAdmin();
  const { createDailyReport } = useDailyReportMutations();

  // Multiple strategies to find current admin
  const currentAdmin =
    admins?.find((admin) => admin.id === user?.userId) ||
    admins?.find((admin) => admin.username === user?.username) ||
    admins?.find((admin) => admin.email === user?.email) ||
    admins?.find((admin) => admin.fullname === user?.fullname);

  const [formData, setFormData] = useState({
    dateTime: new Date(),
    office: "",
    reportType: "",
    hourDiff: "",
    groupId: "",
  });

  const [errors, setErrors] = useState({
    dateTime: "",
    office: "",
    reportType: "",
    hourDiff: "",
    groupId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // Helper function to determine if hourDiff should be negative based on reportType
  const getHourDiffSign = (reportType: string, hourValue: string) => {
    if (!hourValue || !reportType) return hourValue;

    const absValue = Math.abs(parseFloat(hourValue));
    if (isNaN(absValue)) return hourValue;

    // Negative for 'off' and 'leave', positive for 'overtime' and 'extra'
    if (reportType === "off" || reportType === "leave") {
      return (-absValue).toString();
    } else if (reportType === "overtime" || reportType === "extra") {
      return absValue.toString();
    }

    return hourValue;
  };

  // Handle reportType change to auto-adjust hourDiff sign
  const handleReportTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      reportType: value,
      hourDiff: getHourDiffSign(value, prev.hourDiff),
    }));
  };

  // Handle hourDiff change to maintain correct sign based on reportType
  const handleHourDiffChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      hourDiff: getHourDiffSign(prev.reportType, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      dateTime: !formData.dateTime ? "Ngày không được để trống" : "",
      office: !formData.office ? "Phòng ban không được để trống" : "",
      reportType: !formData.reportType
        ? "Loại khai báo không được để trống"
        : "",
      hourDiff: !formData.hourDiff ? "Giờ tăng giảm không được để trống" : "",
      groupId: !formData.groupId ? "Nhóm không được để trống" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
      return;
    }

    // Use current admin ID, or fall back to user ID, or use hardcoded admin ID as last resort
    const adminId =
      currentAdmin?.id || user?.userId || "361f3631-1b80-45d8-a726-834c514dab76";

    if (!adminId) {
      toast.error("Không tìm thấy thông tin admin");
      return;
    }

    setIsLoading(true);

    try {
      const reportData = {
        dateTime: formData.dateTime.toISOString().split("T")[0],
        office: formData.office,
        reportType: formData.reportType,
        hourDiff: parseInt(formData.hourDiff),
        groupId: formData.groupId,
        adminId: adminId,
      };

      const newReport = await createDailyReport(reportData);
      toast.success("Thêm báo cáo hàng ngày thành công!");
      onAdd(newReport);
    } catch (error) {
      toast.error("Lỗi khi thêm báo cáo hàng ngày");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div className="space-y-2">
          <Label
            htmlFor="dateTime"
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Ngày báo cáo <span className="text-red-500 ml-1">*</span>
          </Label>
            <DatePicker
              locale={vi}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm"
              className="border px-3 py-1 rounded-sm w-full text-xl"
            />
       
        </div>

        {/* Office */}
        <div className="space-y-2">
          <Label
            htmlFor="office"
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Phòng ban <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.office}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, office: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger
              className={`h-12 text-lg border-2 transition-colors ${
                errors.office
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <SelectValue
                placeholder="Chọn phòng ban"
                className="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent>
              {OFFICE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-lg py-3 hover:bg-blue-50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.office && (
            <p className="text-red-500 text-sm font-medium">{errors.office}</p>
          )}
        </div>

        {/* Group */}
        <div className="space-y-2">
          <Label
            htmlFor="groupId"
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Nhóm <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.groupId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, groupId: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger
              className={`h-12 text-lg border-2 transition-colors ${
                errors.groupId
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <SelectValue placeholder="Chọn nhóm" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent>
              {groups?.map((group: Group) => (
                <SelectItem
                  key={group.groupId}
                  value={group.groupId}
                  className="text-lg py-3 hover:bg-blue-50"
                >
                  {group.groupName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.groupId && (
            <p className="text-red-500 text-sm font-medium">{errors.groupId}</p>
          )}
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <Label
            htmlFor="reportType"
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Loại khai báo <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.reportType}
            onValueChange={handleReportTypeChange}
            disabled={isLoading}
          >
            <SelectTrigger
              className={`h-12 text-lg border-2 transition-colors ${
                errors.reportType
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <SelectValue
                placeholder="Chọn loại khai báo"
                className="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-lg py-3 hover:bg-blue-50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.reportType && (
            <p className="text-red-500 text-sm font-medium">
              {errors.reportType}
            </p>
          )}
        </div>

        {/* Hour Difference */}
        <div className="space-y-2">
          <Label
            htmlFor="hourDiff"
            className="text-lg font-semibold text-gray-700 flex items-center"
          >
            Số giờ{" "}
            {formData.reportType && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (
                {formData.reportType === "off" ||
                formData.reportType === "leave"
                  ? "Số âm"
                  : "Số dương"}
                )
              </span>
            )}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="hourDiff"
            type="number"
            step="0.5"
            placeholder="Nhập số giờ (dấu sẽ được tự động điều chỉnh)"
            value={Math.abs(parseFloat(formData.hourDiff) || 0)}
            onChange={(e) => handleHourDiffChange(e.target.value)}
            className={`h-12 text-lg border-2 transition-colors ${
              errors.hourDiff
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          {formData.reportType && formData.hourDiff && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Giá trị sẽ được lưu:</span>
              <span
                className={`font-bold ${
                  parseFloat(formData.hourDiff) < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {formData.hourDiff} giờ
              </span>
            </div>
          )}
          {errors.hourDiff && (
            <p className="text-red-500 text-sm font-medium">
              {errors.hourDiff}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-8 py-3 h-12 text-lg font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </div>
            ) : (
              "Tạo báo cáo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
