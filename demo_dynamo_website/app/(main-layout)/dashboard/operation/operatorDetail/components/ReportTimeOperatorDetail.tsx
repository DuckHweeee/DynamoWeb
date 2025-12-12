"use client";

import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";
import { StaffStatistic } from "../../lib/type";
interface Props {
    staffCount: number;

    workingHours: number;
    workingRate: number;

    manufacturingPoints: number;
    mpRate: number;

    processCount: number;
    processRate: number;

    totalKpi: number;
    kpiRate: number;

    timeType: string;
}
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
    data: StaffStatistic;
    type: string;
}
// export function ReportTimeOperator(data: Props) {
export function ReportTimeOperatorDetail({ data, type }: ReportTimeOperatorProps) {
    const typeDate: { [key: string]: string } = {
        day: "Ngày",
        week: "Tuần",
        month: "Tháng",
        year: "Năm",
    };

    return (
        <>
            <div className="my-5 flex gap-3 items-center justify-between">
                <div className="inline-block rounded-xl bg-white px-5 py-4 shadow-md shadow-green-200 border border-green-200 w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.workingRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.workingRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.workingRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.workingRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.workingRate ?? 0) > 0
                                ? `+${data?.workingRate ?? 0}%`
                                : `${data?.workingRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {convertHoursToHM(data?.workingHours ?? 0)}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Giờ Làm {typeDate[data.timeType]} */}
                            Tổng Giờ Làm {typeDate[type]}
                            {(data?.workingRate ?? 0) !== undefined && (
                                (data?.workingRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                    </div>
                </div>

                <div className="inline-block rounded-xl bg-white px-6 py-4 shadow-md shadow-blue-200 border border-blue-200 w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.mpRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.mpRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.mpRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.mpRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.mpRate ?? 0) > 0
                                ? `+${data?.mpRate ?? 0}%`
                                : `${data?.mpRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {data?.manufacturingPoints ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Điểm {typeDate[data.timeType]} */}
                            Tổng Điểm {typeDate[type]}
                            {(data?.mpRate ?? 0) !== undefined && (
                                (data?.mpRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                    </div>
                </div>

                <div className="inline-block rounded-xl bg-white px-6 py-4 shadow-md shadow-orange-200 border border-orange-200 w-full">
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
                        {data?.processCount ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng Số Nguyên Công {typeDate[data.timeType]} */}
                            Tổng Số Nguyên Công {typeDate[type]}
                            {(data?.processRate ?? 0) !== undefined && (
                                (data?.processRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                    </div>
                </div>


                {/*  */}
                <div className="inline-block rounded-xl bg-white px-6 py-4 shadow-md shadow-purple-200 border border-purple-200 w-full">
                    <div className="flex items-start justify-between">
                        <MonitorDot
                            size={24}
                            className={
                                (data?.kpiRate ?? 0) < 0
                                    ? "text-red-500"
                                    : (data?.kpiRate ?? 0) > 0
                                        ? "text-green-500"
                                        : ""
                            }
                        />
                        <p
                            className={`text-lg font-medium ${(data?.kpiRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.kpiRate ?? 0) > 0
                                    ? "text-green-500"
                                    : ""
                                }`}
                        >
                            {(data?.kpiRate ?? 0) > 0
                                ? `+${data?.kpiRate ?? 0}%`
                                : `${data?.kpiRate ?? 0}%`}
                        </p>
                    </div>

                    <p className="text-[30px] font-semibold text-[#074695] leading-none mt-2">
                        {data?.totalKpi ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-lg font-medium text-[#343A40] flex items-center">
                            {/* Tổng KPI {typeDate[data.timeType]} */}
                            Tổng KPI {typeDate[type]}
                            {(data?.kpiRate ?? 0) !== undefined && (
                                (data?.kpiRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}