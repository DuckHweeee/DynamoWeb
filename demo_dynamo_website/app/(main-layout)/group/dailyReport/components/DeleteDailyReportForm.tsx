"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { DailyReport } from "@/lib/type";

interface DeleteDailyReportFormProps {
  dailyReport: DailyReport;
  onDelete: (id: number) => Promise<void>;
  onCancel: () => void;
}

export function DeleteDailyReportForm({
  dailyReport,
  onDelete,
  onCancel,
}: DeleteDailyReportFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(dailyReport.id);
      // Don't set isDeleting to false here - let the parent component handle closing
    } catch (error) {
      setIsDeleting(false); // Only reset loading state on error
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-red-200 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-red-800">
                Xóa Báo Cáo
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isDeleting}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ Cảnh báo: Hành động này không thể hoàn tác!
            </p>
            <p className="text-sm text-red-700">
              Bạn có chắc chắn muốn xóa báo cáo này không? Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 border-2 border-red-600 hover:border-red-700 transition-all duration-200"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
            
            <Button
              onClick={onCancel}
              disabled={isDeleting}
              variant="outline"
              className="flex-1 font-medium py-2.5 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Hủy bỏ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}