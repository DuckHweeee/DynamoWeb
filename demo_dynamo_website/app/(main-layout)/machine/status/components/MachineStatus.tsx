"use client";

import { Card } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { MachineStatusType } from "../lib/type";
import { AlarmClockCheck, NotebookPen, User } from "lucide-react";

type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Trống";

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  drawingCode: string;
  operator: string;
  pg: number;               // phút
  duration: number;        // giây (từ backend progress)
  lastStatusChangeAt: number | null; // ms
  startTime: number | null;
}

/* ===== MAP STATUS ===== */
const machineStatusClasses: Record<
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

function mapStatus(code: string): MachineStatus {
  if (code?.startsWith("R")) return "Đang Chạy";
  if (code?.startsWith("S")) return "Dừng";
  if (code?.startsWith("E")) return "Lỗi";
  return "Trống";
}

/* ===== MAP API ===== */
function mapApiDataToMachines(data: MachineStatusType[]): Machine[] {
  return data.map((d) => ({
    id: d.id,
    name: d.machineDto?.machineName ?? "",
    status: mapStatus(d.status),
    drawingCode: d.drawingCodeName,
    operator: d.staffDto?.staffName ?? "Chưa có nhân viên",
    pg: d.pgTime,                         // phút
    duration: d.duration ?? 0,           // giây đã chạy
    lastStatusChangeAt: d.lastStatusChangeAt ?? null, // ms
    startTime: d.startTime ?? null,
  }));
}

/* ===== UTILS ===== */
function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} giờ ${m} phút`;
}

function getRealRunSeconds(machine: Machine, now: number) {
  if (machine.status === "Đang Chạy") {
    return (
      machine.duration +
      Math.floor((now - machine.lastStatusChangeAt!) / 1000)
    );
  }
  return machine.duration;
}

function getProgressPercent(machine: Machine, now: number) {
  const runSeconds = getRealRunSeconds(machine, now);
  const planSeconds = machine.pg * 60;
  if (!planSeconds || planSeconds <= 0) return 0;
  return Math.min(100, Math.round((runSeconds / planSeconds) * 100));
}

function getRemainingPgText(machine: Machine, now: number) {
  const runSeconds = getRealRunSeconds(machine, now);
  const planSeconds = machine.pg * 60;
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

/* ===== COMPONENT ===== */
export default function MachineStatus({
  dataMachineStatus,
}: {
  dataMachineStatus: MachineStatusType[];
}) {
  const machines = useMemo(
    () => mapApiDataToMachines(dataMachineStatus),
    [dataMachineStatus]
  );

  /* ⏱ TICK mỗi giây để re-render realtime */
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===== SUMMARY ===== */
  const summary = useMemo(() => {
    const total = machines.length;
    const grouped = machines.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<MachineStatus, number>);
    return { total, grouped };
  }, [machines]);

  const statusList: MachineStatus[] = ["Đang Chạy", "Dừng", "Lỗi", "Trống"];
  const summaryItems = statusList.map((status) => ({
    title: `Tổng Số Máy ${status}`,
    value: summary.grouped[status] || 0,
    total: summary.total,
    textColor: machineStatusClasses[status].text,
  }));

  /* ===== PAGINATION ===== */
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedMachines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return machines.slice(start, end);
  }, [machines, currentPage]);

  const totalPages = Math.ceil(machines.length / itemsPerPage);

  /* ===== RENDER ===== */
  return (
    <div className="mt-4">
      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {summaryItems.map((item, idx) => (
          <Card
            key={idx}
            className="p-4 flex flex-col items-center text-center gap-2 shadow-md mt-2  bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-xl"
          >
            <div className={`text-5xl font-bold ${item.textColor}`}>
              {item.value}
            </div>
            <div className="text-sm font-medium text-white">{item.title}</div>
            <div className="text-sm text-muted-foreground text-white ">
              {item.value}/{item.total}
            </div>
          </Card>
        ))}
      </div>

      {/* ===== MACHINES ===== */}
      {machines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 ">
          {paginatedMachines.map((machine) => {
            const result = getRemainingPgText(machine, now);
            const progress = getProgressPercent(machine, now);

            return (
              <div
                key={machine.id}
                className="relative bg-white/20 backdrop-blur-xl
                border border-white/20
                shadow-xl rounded-2xl shadow-md p-5 space-y-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 absolute -top-4 left-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                    ${machineStatusClasses[machine.status].bg}`}
                  >
                    {machine.name}
                  </div>
                </div>

                {/* Drawing + Time */}
                <div className="text-sm space-y-1 pt-8">
                  <div className="flex items-center justify-start pb-2">
                    <NotebookPen color="white" size={20} />
                    <p className="px-5 text-base text-white font-semibold">
                      {machine.drawingCode}
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

                  <div className="flex items-center justify-start">
                    <User color="white" size={24} />
                    <p className="px-4 text-sm text-white font-semibold">
                      {machine.operator}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white">Tiến độ</span>
                    <span className="text-white" >{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${machineStatusClasses[machine.status].bg} `}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-semibold text-white">
                    {new Date(machine.startTime!).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-white">{formatMinutes(machine.pg)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">Không có dữ liệu</div>
      )}

      {/* ===== PAGINATION ===== */}
      <div className="mt-6 flex justify-end items-center gap-4">
        <button
          className="px-3 py-1 rounded disabled:opacity-50 bg-white"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-white rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
