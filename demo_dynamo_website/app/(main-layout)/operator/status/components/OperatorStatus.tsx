"use client";

import { Card } from "@/components/ui/card";
import { AlarmClockCheck, NotebookPen, User } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ListStaffStatus, OperatorStatusType } from "../lib/type";

type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Trống";

const statusColors: Record<
  MachineStatus,
  { text: string; bg: string }
> = {
  "Đang Chạy": {
    text: "text-green-300",
    bg: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
  },
  Dừng: {
    text: "text-yellow-300",
    bg: "bg-gradient-to-br from-yellow-300 via-orange-400 to-amber-500",
  },
  Lỗi: {
    text: "text-red-500",
    bg: "bg-gradient-to-br from-rose-400 via-red-500 to-red-700",
  },
  Trống: {
    text: "text-gray-200",
    bg: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
  },
};

// Map status code từ API → trạng thái hiển thị
const mapStatus = (status: string): MachineStatus => {
  if (status.startsWith("R")) return "Đang Chạy";
  if (status.startsWith("S")) return "Dừng";
  if (status.startsWith("E")) return "Lỗi";
  return "Trống";
};


const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} giờ ${m} phút`;
};
function getRealRunSeconds(machine: ListStaffStatus, now: number) {
  const st = mapStatus(machine.status);
  if (st === "Đang Chạy") {
    return (
      machine.duration +
      Math.floor((now - machine.lastStatusChangeAt!) / 1000)
    );
  }
  return machine.duration;
}

function getProgressPercent(machine: ListStaffStatus, now: number) {
  const runSeconds = getRealRunSeconds(machine, now);
  const planSeconds = machine.pgTime * 60;
  if (!planSeconds || planSeconds <= 0) return 0;
  return Math.min(100, Math.round((runSeconds / planSeconds) * 100));
}

function getRemainingPgText(machine: ListStaffStatus, now: number) {
  const runSeconds = getRealRunSeconds(machine, now);
  const planSeconds = machine.pgTime * 60;
  const diff = planSeconds - runSeconds;

  if (machine.status === "Trống") {
    return { isOver: true, text: "Chưa thực hiện" };
  }

  if (diff >= 0) {
    return {
      isOver: true,
      text: `Còn lại: ${formatMinutes(Math.floor(diff / 60))}`,
    };
  }

  return {
    isOver: false,
    text: `Quá thời gian: ${formatMinutes(Math.floor(Math.abs(diff) / 60))}`,
  };
}
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

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const statusList: MachineStatus[] = ["Đang Chạy", "Dừng", "Lỗi", "Trống"];
  const summaryItems = statusList.map((status) => ({
    title: `Tổng Số Máy ${status}`,
    value: summary.grouped[status],
    total: summary.total,
    color: statusColors[status].text,
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
  return (
    <div className="">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {summaryItems.map((item, idx) => (
          <Card
            key={idx}
            className="p-4 flex flex-col items-center text-center gap-2 shadow-md  bg-white/10 backdrop-blur=lg
            border border-white/20
            shadow-xl"
          >
            <div className={`text-5xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm font-medium text-white">{item.title}</div>
            <div className="text-sm text-muted-foreground text-white">
              {item.value}/{item.total}
            </div>
          </Card>
        ))}
      </div>

      {/* Staff + Machine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedStaff.map((staff, idx) => (
          <Card key={idx} className="p-4 space-y-2 shadow-md gap-2  bg-white/10 backdrop-blur-lg
            border border-white/20
            shadow-xl ">
            <div className="font-semibold text-blue-700 flex items-center gap-2 border-b-2 pb-2">
              <User color="white" /> <span className="text-white">{staff.staffDto?.staffName}</span>
            </div>
            <div className="space-y-2">
              {staff.listStaffStatus.map((op) => {
                const st = mapStatus(op.status);
                const result = getRemainingPgText(op, now);
                const progress = getProgressPercent(op, now);
                return (
                  <div key={op.id} className="text-sm border-b-2 p-3">
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center">
                        <NotebookPen color="white" size={20} />
                        <p className="px-3 text-base text-white font-semibold">
                          {op.drawingCodeName}
                        </p>
                      </div>
                      <p className={`inline-block !w-auto !h-[30px] text-white  font-bold px-4 py-1 rounded-md ${statusColors[st]}`}>
                        {op.machineDto.machineName}
                      </p>
                    </div>
                    <div className="flex items-center justify-start pb-2">
                      <AlarmClockCheck color="white" size={24} />
                      <p className="px-4 text-sm">
                        <strong
                          className={`${result.isOver ? "bg-green-300" : "bg-red-300"} p-2 rounded-xl`}
                        >
                          {result.text}
                        </strong>
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-3 mt-3">
                        <span className="text-white">Tiến độ</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${statusColors[st]}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
                      <span className="font-semibold text-white">
                        {new Date(op.startTime!).toLocaleString("vi-VN")}
                      </span>
                      <span className="text-white">{formatMinutes(op.pgTime)}</span>
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
