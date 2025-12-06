import { Card } from "@/components/ui/card";
import { ListOrderDetailStatusType } from "../lib/type";
import { useOrderDetailStatus } from "../hooks/useOrderDetailStatus";

export default function OrderStatus({
    dataMachineStatus,
}: {
    dataMachineStatus: ListOrderDetailStatusType[];
}) {
    const {data} = useOrderDetailStatus();
    return (
        <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {data.map((status) => (
                    <Card
                        key={status.orderDetailId}
                        className="p-4 flex flex-col items-center text-center gap-2 shadow-md"
                    >
                        <div className={`text-5xl font-bold`}>
                            {status.orderCode}
                        </div>
                        <div className="text-sm font-medium">{status.orderDetailId}</div>
                        <div className="text-sm text-muted-foreground">
                            {status.orderDetailId}
                        </div>
                    </Card>
                ))}
            </div>

            {/* {dataMachineStatus && dataMachineStatus.length > 0 ? (
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
                                    const now = Date.now();
                                    const elapsedMs = now - machine.startTime;
                                    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
                                    const result = getRemainingPgTime(machine.startTime, machine.pg);
                                    const status = machine.status;
                                    return (
                                        <span>
                                            <strong className={result.isOver ? "text-red-400" : "text-green-600"}>
                                                {result.text}
                                            </strong>
                                        </span>
                                    );

                                })()}
                            </p>
                            <p className="text-sm">
                                {(() => {
                                    const now = Date.now();
                                    const elapsedMs = now - machine.startTime;
                                    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
                                    const result = getRemainingPgTime(machine.startTime, machine.pg);
                                    const status = machine.status;
                                    if (status != "Trống") {
                                        return (    
                                            <span>
                                                <span className="text-xs text-gray-500">
                                                    PG: {formatMinutes(machine.pg)} | Đã chạy:{" "}
                                                    {formatMinutes(elapsedMinutes)}
                                                </span>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span>
                                                <span className="text-xs text-gray-500">
                                                    PG: {formatMinutes(machine.pg)} | Đã chạy: 0
                                                    giờ 0 phút
                                                </span>
                                            </span>
                                        );
                                    }

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
            </div> */}
        </div>
    );
}
