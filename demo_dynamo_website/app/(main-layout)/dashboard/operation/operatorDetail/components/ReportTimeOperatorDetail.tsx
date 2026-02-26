"use client";

import { UserCog, TrendingDown, TrendingUp } from "lucide-react";
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
            <div className="my-5 flex gap-6 items-center justify-between">
                <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  px-5 py-4 shadow-md w-full">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#D0E5A5] to-[#86E3C3]">
                            <UserCog size={19} style={{ fill: "white", stroke: "white" }} />
                        </div>
                        <div
                            className={`text-base font-medium ${(data?.pgRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.pgRate ?? 0) > 0
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.pgRate ?? 0) < 0
                                    ? "bg-red-100 text-red-500"
                                    : (data?.pgRate ?? 0) > 0
                                        ? "bg-green-100 text-green-500"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                {(data?.pgRate ?? 0) > 0
                                    ? `+${data?.pgRate}%`
                                    : `${data?.pgRate}%`}
                            </span>
                        </div>
                    </div>

                    <p className="mt-3 text-2xl font-semibold text-green-400 leading-none mt-2">
                        {convertHoursToHM(data?.pgHour ?? 0)}
                    </p>

                    <div className="mt-2">
                        <p className="text-base font-medium text-green-300 flex items-center">
                            {/* Tổng Giờ Làm {typeDate[data.timeType]} */}
                            Tổng Giờ Làm {typeDate[type]}
                            {(data?.pgRate ?? 0) !== undefined && (
                                (data?.pgRate ?? 0) >= 0 ? (
                                    <TrendingUp size={14} className="ml-1 text-green-500" />
                                ) : (
                                    <TrendingDown size={14} className="ml-1 text-red-500" />
                                )
                            )}
                        </p>
                    </div>
                </div>

                <div className="inline-block rounded-[20px] px-6 py-4  bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#4adede] to-[#1ca7ec]">
                            <UserCog size={20} style={{ fill: "white", stroke: "white" }} />
                        </div>
                        <div
                            className={`text-base font-medium ${(data?.mpRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.mpRate ?? 0) > 0
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.mpRate ?? 0) < 0
                                    ? "bg-red-100 text-red-500"
                                    : (data?.mpRate ?? 0) > 0
                                        ? "bg-green-100 text-green-500"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                {(data?.mpRate ?? 0) > 0
                                    ? `+${data?.mpRate.toFixed(2)}%`
                                    : `${data?.mpRate.toFixed(2)}%`}
                            </span>
                        </div>
                    </div>
                    <p className="text-2xl mt-3 font-semibold text-sky-400 leading-none mt-2">
                        {data?.manufacturingPoints ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-base font-medium text-sky-300 flex items-center">
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

                <div className="inline-block rounded-[20px] px-6 py-4  bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  px-5 py-3 shadow-md w-full">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#ffdd94] to-[#fa897b]">
                            <UserCog size={19} style={{ fill: "white", stroke: "white" }} />
                        </div>
                        <div
                            className={`text-base font-medium ${(data?.kpiRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.kpiRate ?? 0) > 0
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.kpiRate ?? 0) < 0
                                    ? "bg-red-100 text-red-500"
                                    : (data?.kpiRate ?? 0) > 0
                                        ? "bg-green-100 text-green-500"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                {(data?.kpiRate ?? 0) > 0
                                    ? `+${data?.kpiRate.toFixed(2)}%`
                                    : `${data?.kpiRate.toFixed(2)}%`}
                            </span>
                        </div>
                    </div>

                    <p className="text-2xl mt-3 font-semibold text-orange-400 leading-none mt-2">
                        {data?.processCount ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-base font-medium text-orange-300 flex items-center">
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
                <div className="inline-block rounded-[20px] px-6 py-4  bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#faa2ae] to-[#ccabdb]">
                            <UserCog size={20} style={{ fill: "white", stroke: "white" }} />
                        </div>
                        <div
                            className={`text-base font-medium ${(data?.kpiRate ?? 0) < 0
                                ? "text-red-500"
                                : (data?.kpiRate ?? 0) > 0
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                        >
                            <span
                                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.kpiRate ?? 0) < 0
                                    ? "bg-red-100 text-red-500"
                                    : (data?.kpiRate ?? 0) > 0
                                        ? "bg-green-100 text-green-500"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                {(data?.kpiRate ?? 0) > 0
                                    ? `+${data?.kpiRate.toFixed(2)}%`
                                    : `${data?.kpiRate.toFixed(2)}%`}
                            </span>
                        </div>
                    </div>

                    <p className="text-2xl mt-3 font-semibold text-purple-400 leading-none mt-2">
                        {data?.totalKpi ?? 0}
                    </p>

                    <div className="mt-2">
                        <p className="text-base font-medium text-purple-300 flex items-center">
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