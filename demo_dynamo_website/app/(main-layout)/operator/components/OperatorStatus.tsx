"use client";

import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";

type MachineStatus = "Đang Chạy" | "Dừng" | "Lỗi" | "Tắt";

interface Machine {
    id: number;
    name: string;
    status: MachineStatus;
    drawingCode: string;
    operator: string;
    pg: string;
    time: string;
}

const statusColors: Record<MachineStatus, string> = {
    "Đang Chạy": "green-500",
    "Dừng": "yellow-500",
    "Lỗi": "red-500",
    "Tắt": "gray-500",
};

const machines: Machine[] = [
    {
        id: 1,
        name: "Machine 1",
        status: "Đang Chạy",
        drawingCode: "1123",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 10,
        name: "Machine 1",
        status: "Đang Chạy",
        drawingCode: "1123",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 2,
        name: "Machine 2",
        status: "Dừng",
        drawingCode: "1154",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 12,
        name: "Machine 2",
        status: "Dừng",
        drawingCode: "1154",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 3,
        name: "Machine 3",
        status: "Lỗi",
        drawingCode: "1176",
        operator: "Nguyen Van A",
        pg: "360P",
        time: "00:00",
    },
    {
        id: 13,
        name: "Machine 3",
        status: "Lỗi",
        drawingCode: "1176",
        operator: "Nguyen Van A",
        pg: "360P",
        time: "00:00",
    },
    {
        id: 4,
        name: "Machine 4",
        status: "Tắt",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 14,
        name: "Machine 4",
        status: "Tắt",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 154,
        name: "Machine 4",
        status: "Tắt",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 54,
        name: "Machine 4",
        status: "Đang Chạy",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 541,
        name: "Machine 4",
        status: "Lỗi",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 51,
        name: "Machine 4",
        status: "Dừng",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 84,
        name: "Machine 4",
        status: "Tắt",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 94,
        name: "Machine 4",
        status: "Đang Chạy",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 641,
        name: "Machine 4",
        status: "Lỗi",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    {
        id: 61,
        name: "Machine 4",
        status: "Dừng",
        drawingCode: "1134",
        operator: "Nguyen Van A",
        pg: "180P",
        time: "00:00",
    },
    // 👉 Thêm các máy khác tại đây
];

export default function OperatorStatus() {
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
    }, []);

    const statusList: MachineStatus[] = ["Đang Chạy", "Dừng", "Lỗi", "Tắt"];
    const summaryItems = statusList.map((status) => {
        const count = summary.grouped[status] || 0;
        return {
            title: `Tổng Số Máy ${status}`,
            value: count,
            total: summary.total,
            color: statusColors[status],
        };
    });

    // Phân trang
    const itemsPerPage = 3 * 4; // 3 hàng × 4 cột
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedMachines = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return machines.slice(start, end);
    }, [machines, currentPage]);

    const totalPages = Math.ceil(machines.length / itemsPerPage);

    return (
        <div className="mt-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {summaryItems.map((item, idx) => (
                    <Card
                        key={idx}
                        className="p-4 flex flex-col items-center text-center gap-2 shadow-md"
                    >
                        <div className={`text-3xl font-bold text-${item.color}`}>{item.value}</div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                            {item.value}/{item.total}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Machines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusList.map((status) => {
                    const filtered = paginatedMachines.filter((m) => m.status === status);
                    return (
                        <div key={status} className="space-y-4">
                            {filtered.map((machine) => (
                                <div
                                    key={machine.id}
                                    className="bg-white border rounded-lg shadow p-4 space-y-1"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-semibold">
                                            {machine.operator}
                                        </p>
                                        <div
                                            className={`w-4 h-4 rounded-full bg-${statusColors[machine.status]}`}
                                        />
                                    </div>
                                    {/* <p className="text-sm">
                                        Trạng Thái:{" "}
                                        <span className="font-semibold">{machine.status}</span>
                                    </p> */}
                                    <p className="text-sm">
                                        Mã Bản Vẽ: <strong>{machine.drawingCode}</strong>
                                    </p>
                                    <p className="">Máy: <span className="text-blue-800 font-bold ">{machine.name}</span></p>
                                    <p className="text-sm">
                                        {machine.time} - PG: <strong>{machine.pg}</strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-end items-center gap-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    Trước
                </button>
                <span>Trang {currentPage} / {totalPages}</span>
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
