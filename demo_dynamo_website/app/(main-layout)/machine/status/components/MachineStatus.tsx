"use client";

import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { MachineStatusType } from "../lib/type";

type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Trống";

interface Machine {
    id: string;
    name: string;
    status: MachineStatus;
    drawingCode: string;
    operator: string;
    pg: number;
    startTime: number;
}

const machineStatusClasses: Record<MachineStatus, { text: string; bg: string }> = {
    "Đang Chạy": { text: "text-green-500", bg: "bg-green-500" },
    "Dừng": { text: "text-yellow-500", bg: "bg-yellow-500" },
    "Lỗi": { text: "text-red-500", bg: "bg-red-500" },
    "Trống": { text: "text-gray-500", bg: "bg-gray-500" },
};

function mapStatus(code: string): MachineStatus {
    if (code.startsWith("R")) return "Đang Chạy";
    if (code.startsWith("S")) return "Dừng";
    if (code.startsWith("E")) return "Lỗi";
    return "Trống";
}

function mapApiDataToMachines(data: MachineStatusType[]): Machine[] {
    return data.map((d) => ({
        id: d.id,
        name: d.machineDto?.machineName ?? "",
        status: mapStatus(d.status),
        drawingCode: d.drawingCodeName,
        operator: d.staffDto?.staffName ?? "Chưa có nhân viên",
        pg: d.pgTime,
        startTime: d.startTime,
    }));
}

export default function MachineStatus({
    dataMachineStatus,
}: {
    dataMachineStatus: MachineStatusType[];
}) {
    const machines = useMemo(() => mapApiDataToMachines(dataMachineStatus), [dataMachineStatus]);

    const summary = useMemo(() => {
        const total = machines.length;
        const grouped = machines.reduce(
            (acc, m) => {
                acc[m.status] = (acc[m.status] || 0) + 1;
                return acc;
            },
            {} as Record<MachineStatus, number>
        );
        return { total, grouped };
    }, [machines]);

    const statusList: MachineStatus[] = ["Đang Chạy", "Dừng", "Lỗi", "Trống"];
    const summaryItems = statusList.map((status) => {
        const count = summary.grouped[status] || 0;
        return {
            title: `Tổng Số Máy ${status}`,
            value: count,
            total: summary.total,
            textColor: machineStatusClasses[status].text,
        };
    });

    const itemsPerPage = 3 * 4;
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedMachines = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return machines.slice(start, end);
    }, [machines, currentPage]);

    const totalPages = Math.ceil(machines.length / itemsPerPage);

    const formatMinutes = (minutes: number): string => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h} giờ ${m} phút`;
    };

    const getRemainingPgTime = (
        startTime: number,
        pgTime: number // đơn vị giờ
    ): { isOver: boolean; text: string } => {
        const now = Date.now();
        const elapsedMs = now - startTime;
        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

        const pgMinutes = Math.round(pgTime * 60);
        const remaining = pgMinutes - elapsedMinutes;

        if (remaining >= 0) {
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
        <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {summaryItems.map((item, idx) => (
                    <Card
                        key={idx}
                        className="p-4 flex flex-col items-center text-center gap-2 shadow-md"
                    >
                        <div className={`text-5xl font-bold ${item.textColor}`}>
                            {item.value}
                        </div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                            {item.value}/{item.total}
                        </div>
                    </Card>
                ))}
            </div>

            {dataMachineStatus && dataMachineStatus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedMachines.map((machine) => (
                        <div
                            key={machine.id}
                            className="bg-white border rounded-lg shadow p-4 space-y-1"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-xl text-blue-800 font-bold">{machine.name}</p>
                                <div
                                    className={`w-4 h-4 rounded-full ${machineStatusClasses[machine.status].bg}`}
                                />
                            </div>
                            <p className="text-sm">
                                Trạng Thái: <span className="font-semibold">{machine.status}</span>
                            </p>
                            <p className="text-sm">
                                Mã Bản Vẽ: <strong>{machine.drawingCode}</strong>
                            </p>
                            <p className="text-sm">
                                NVVH: <strong>{machine.operator}</strong>
                            </p>
                            <p className="text-sm">
                                {(() => {
                                    const result = getRemainingPgTime(machine.startTime, machine.pg);
                                    return (
                                        <strong className={result.isOver ? "text-red-400" : ""}>
                                            {result.text}
                                        </strong>
                                    );
                                })()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-6">
                    Không có dữ liệu
                </div>
            )}

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
