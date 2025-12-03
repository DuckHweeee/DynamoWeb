"use client";

import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useMemo, useState } from "react";
import { OperatorStatusType } from "../lib/type";

type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Trống";

const statusColors: Record<MachineStatus, string> = {
  "Đang Chạy": "green-500",
  Dừng: "yellow-500",
  Lỗi: "red-500",
  Trống: "gray-500",
};

// Map status code từ API → trạng thái hiển thị
const mapStatus = (status: string): MachineStatus => {
  if (status.startsWith("R")) return "Đang Chạy";
  if (status.startsWith("S")) return "Dừng";
  if (status.startsWith("E")) return "Lỗi";
  return "Trống";
};

export default function OperatorStatus({
  dataOperatorStatus,
}: {
  dataOperatorStatus: OperatorStatusType[];
}) {
  const summary = useMemo(() => {
    let grouped: Record<MachineStatus, number> = {
      "Đang Chạy": 0,
      Dừng: 0,
      Lỗi: 0,
      Trống: 0,
    };

    dataOperatorStatus.forEach((staff) => {
      staff.listStaffStatus.forEach((m) => {
        const st = mapStatus(m.status);
        grouped[st] += 1;
      });
    });

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);
    return { total, grouped };
  }, [dataOperatorStatus]);

  const statusList: MachineStatus[] = ["Đang Chạy", "Dừng", "Lỗi", "Trống"];
  const summaryItems = statusList.map((status) => ({
    title: `Tổng Số Máy ${status}`,
    value: summary.grouped[status],
    total: summary.total,
    color: statusColors[status],
  }));

  // === Phân trang cho staff ===
  const itemsPerPage = 3 * 4; // 3 hàng × 4 cột
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return dataOperatorStatus.slice(start, end);
  }, [currentPage, dataOperatorStatus]);

  const totalPages = Math.ceil(dataOperatorStatus.length / itemsPerPage);

  const formatMinutes = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} giờ ${m} phút`;
  };

  const getRemainingPgTime = (
    startTime: number,
    pgTime: number,
    status: string // đơn vị giờ
  ): { isOver: boolean; text: string } => {
    const now = Date.now();
    const elapsedMs = now - startTime;
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

    const pgMinutes = Math.round(pgTime);
    const remaining = pgMinutes - elapsedMinutes;

    if (status == "0") {
      return {
        isOver: false,
        text: `Chưa thực hiện: 0 giờ 0 phút`,
      };
    } else if (remaining >= 0) {
      return {
        isOver: false,
        text: `Thời gian PG còn lại: ${formatMinutes(remaining)}`,
      };
    } else {
      return {
        isOver: true,
        text: `Quá thời gian PG dự kiến: ${formatMinutes(Math.abs(remaining))}`,
      };
    }
  };
  return (
    <div className="">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {summaryItems.map((item, idx) => (
          <Card
            key={idx}
            className="p-4 flex flex-col items-center text-center gap-2 shadow-md"
          >
            <div className={`text-3xl font-bold text-${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">
              {item.value}/{item.total}
            </div>
          </Card>
        ))}
      </div>

      {/* Staff + Machine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {paginatedStaff.map((staff, idx) => (
          <Card key={idx} className="p-4 space-y-2 shadow-md gap-4">
            <div className="font-semibold text-blue-700 flex items-center gap-2 border-b-2 pb-2">
              <User /> {staff.staffDto?.staffName}
            </div>
            <div className="space-y-2">
              {staff.listStaffStatus.map((op) => {
                const st = mapStatus(op.status);
                return (
                  <div key={op.id} className="text-sm border-b-2 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full bg-${statusColors[st]}`}
                      />
                      <span className="">
                        <strong>Máy:</strong> {op.machineDto.machineName}
                      </span>
                    </div>
                    <div className="ml-5">
                      <strong>MH:</strong> {op.drawingCodeName}
                    </div>
                    <div className="ml-5">
                      <p className="text-sm">
                        {(() => {
                          const result = getRemainingPgTime(
                            op.startTime,
                            op.pgTime,
                            op.status
                          );
                          return (
                            <strong
                              className={result.isOver ? "text-red-400" : ""}
                            >
                              {result.text}
                            </strong>
                          );
                        })()}
                      </p>

                      <p className="text-sm">
                        {(() => {
                          const now = Date.now();
                          const elapsedMs = now - op.startTime;
                          const elapsedMinutes = Math.floor(
                            elapsedMs / (1000 * 60)
                          );
                          if (op.status != "0") {
                            return (
                              <span>
                                <span className="text-xs text-gray-500">
                                  PG: {formatMinutes(op.pgTime)} | Đã chạy:{" "}
                                  {formatMinutes(elapsedMinutes)}
                                </span>
                              </span>
                            );
                          } else {
                            return (
                              <span>
                                <span className="text-xs text-gray-500">
                                  PG: {formatMinutes(op.pgTime)} | Đã chạy: 0
                                  giờ 0 phút
                                </span>
                              </span>
                            );
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-end items-center gap-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
