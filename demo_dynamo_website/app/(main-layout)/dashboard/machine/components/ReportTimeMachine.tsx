"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MachineStatistic } from "../lib/type";
function convertHoursToHM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
    if (h > 0) return `${h} giờ`;
    if (m > 0) return `${m} phút`;
    return "0 phút";
}

function formatHoursToHM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (h > 0 && m > 0) {
        return `${h} giờ ${m} phút`;
    } else if (h > 0) {
        return `${h} giờ`;
    } else if (m > 0) {
        return `${m} phút`;
    } else {
        return "0 phút";
    }
}

interface ReportTimeOperatorProps {
    data: MachineStatistic;
    type: string;
}
export function ReportTimeMachine({ data, type }: ReportTimeOperatorProps) {
    const typeDate: { [key: string]: string } = {
        day: "Ngày",
        week: "Tuần",
        month: "Tháng",
        year: "Năm",
    };
    return (
        <>
            <div className="my-5 flex gap-3 items-center justify-between">
                <div className="inline-block rounded-sm bg-white px-5 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.runTimeRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.runTimeRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.runTimeRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.runTimeRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.runTimeRate ?? 0) > 0
                                ? `+${data?.runTimeRate ?? 0}%`
                                : `${data?.runTimeRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {convertHoursToHM(data?.totalRunTime ?? 0)}
                    </p>

                     <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Giờ Làm {typeDate[data.timeType]} */}
                            Tổng Giờ Chạy  {typeDate[type]}
                            {(data?.runTimeRate ?? 0) !== undefined && (
                                (data?.runTimeRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                        <p className="text-sm text-gray-400">
                            Trung bình: {data && data.totalMachines > 0
                                ? formatHoursToHM((data?.totalRunTime ?? 0) / data.totalMachines)
                                : "0 giờ 0 phút"} / máy
                        </p>
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.stopTimeRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.stopTimeRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.stopTimeRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.stopTimeRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.stopTimeRate ?? 0) > 0
                                ? `+${data?.stopTimeRate ?? 0}%`
                                : `${data?.stopTimeRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {convertHoursToHM(data?.totalStopTime ?? 0)}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Điểm {typeDate[data.timeType]} */}
                            Tổng Giờ Dừng  {typeDate[type]}
                            {(data?.stopTimeRate ?? 0) !== undefined && (
                                (data?.stopTimeRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                        <p className="text-sm text-gray-400">
                            Trung bình: {data && data.totalMachines > 0
                                ? formatHoursToHM((data?.totalStopTime ?? 0) / data.totalMachines)
                                : "0 giờ 0 phút"} / máy
                        </p>
                    </div>
                </div>

                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.errorTimeRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.errorTimeRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.errorTimeRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.errorTimeRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.errorTimeRate ?? 0) > 0
                                ? `+${data?.errorTimeRate ?? 0}%`
                                : `${data?.errorTimeRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {convertHoursToHM(data?.totalErrorTime ?? 0)}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Điểm {typeDate[data.timeType]} */}
                            Tổng Giờ Lỗi  {typeDate[type]}
                            {(data?.errorTimeRate ?? 0) !== undefined && (
                                (data?.errorTimeRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                        <p className="text-sm text-gray-400">
                            Trung bình: {data && data.totalMachines > 0
                                ? formatHoursToHM((data?.totalErrorTime ?? 0) / data.totalMachines)
                                : "0 giờ 0 phút"} / máy
                        </p>
                    </div>
                </div>


                {/*  */}
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.pgTimeRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.pgTimeRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.pgTimeRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.pgTimeRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.pgTimeRate ?? 0) > 0
                                ? `+${data?.pgTimeRate ?? 0}%`
                                : `${data?.pgTimeRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {convertHoursToHM(data?.totalPgTime ?? 0)}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Điểm {typeDate[data.timeType]} */}
                            Tổng Giờ PG  {typeDate[type]}
                            {(data?.pgTimeRate ?? 0) !== undefined && (
                                (data?.pgTimeRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                        <p className="text-sm text-gray-400">
                            Trung bình: {data && data.totalMachines > 0
                                ? formatHoursToHM((data?.totalPgTime ?? 0) / data.totalMachines)
                                : "0 giờ 0 phút"} / máy
                        </p>
                    </div>
                </div>
                <div className="inline-block rounded-sm bg-white px-6 py-4 shadow-md border w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.processRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.processRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.processRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.processRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.processRate ?? 0) > 0
                                ? `+${data?.processRate ?? 0}%`
                                : `${data?.processRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {data?.totalProcesses ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Số Nguyên Công {typeDate[data.timeType]} */}
                            Tổng Số Gia Công  {typeDate[type]}
                            {(data?.processRate ?? 0) !== undefined && (
                                (data?.processRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                        <p className="text-sm text-gray-400">
                            Trung bình: {data && data.totalProcesses > 0
                                ? Math.round((data?.totalProcesses ?? 0) / data.totalMachines)
                                : "0"} gia công / máy
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}