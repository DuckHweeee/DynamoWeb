"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MachineStatistic } from "../lib/type";
function convertHoursToHM(hours: number): string {
  let h = Math.floor(hours);
  let m = Math.round((hours - h) * 60);

  // ⚠️ Xử lý trường hợp làm tròn lên 60 phút
  if (m === 60) {
    h += 1;
    m = 0;
  }

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
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="inline-block rounded-xl bg-white px-5 py-3 shadow-md shadow-green-200 border border-green-500 w-full">
          <div className="flex items-center justify-between">
            <MonitorDot size={25} className={"text-green-500"} />
            <div
              className={`text-base font-medium ${(data?.runTimeRate ?? 0) < 0
                ? "text-red-500"
                : (data?.runTimeRate ?? 0) > 0
                  ? "text-green-500"
                  : "text-gray-400"
                }`}
            >
              <span
                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.runTimeRate ?? 0) < 0
                  ? "bg-red-100 text-red-500"
                  : (data?.runTimeRate ?? 0) > 0
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {(data?.runTimeRate ?? 0) > 0
                  ? `+${data?.runTimeRate}%`
                  : `${data?.runTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-[30px] font-semibold text-green-700 leading-none mt-2">
            {convertHoursToHM(data?.totalRunTime ?? 0)}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-green-500 flex items-center">
              {/* Tổng Giờ Làm {typeDate[data.timeType]} */}
              Tổng Giờ Chạy {typeDate[type]}
              {(data?.runTimeRate ?? 0) !== undefined &&
                ((data?.runTimeRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                ))}
            </p>
            <p className="text-sm text-gray-400">
              Trung bình:{" "}
              {data && data.totalMachines > 0
                ? formatHoursToHM(
                  (data?.totalRunTime ?? 0) / data.totalMachines
                )
                : "0 giờ 0 phút"}{" "}
              / máy
            </p>
          </div>
        </div>

        <div className="inline-block rounded-xl bg-white px-6 py-3 shadow-md shadow-yellow-100 border border-yellow-500 w-full">
          <div className="flex items-center justify-between">
            <MonitorDot size={25} className={"text-yellow-500"} />
            <div
              className={`text-base font-medium ${(data?.stopTimeRate ?? 0) < 0
                ? "text-red-500"
                : (data?.stopTimeRate ?? 0) > 0
                  ? "text-green-500"
                  : "text-gray-400"
                }`}
            >
              <span
                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.stopTimeRate ?? 0) < 0
                  ? "bg-red-100 text-red-500"
                  : (data?.stopTimeRate ?? 0) > 0
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {(data?.stopTimeRate ?? 0) > 0
                  ? `+${data?.stopTimeRate}%`
                  : `${data?.stopTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-[30px] font-semibold text-yellow-700 leading-none mt-2">
            {convertHoursToHM(data?.totalStopTime ?? 0)}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-yellow-500 flex items-center">
              {/* Tổng Điểm {typeDate[data.timeType]} */}
              Tổng Giờ Dừng {typeDate[type]}
              {(data?.stopTimeRate ?? 0) !== undefined &&
                ((data?.stopTimeRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                ))}
            </p>
            <p className="text-sm text-gray-400">
              Trung bình:{" "}
              {data && data.totalMachines > 0
                ? formatHoursToHM(
                  (data?.totalStopTime ?? 0) / data.totalMachines
                )
                : "0 giờ 0 phút"}{" "}
              / máy
            </p>
          </div>
        </div>

        <div className="inline-block rounded-xl bg-white px-6 py-3 shadow-md shadow-red-200 border border-red-500 w-full">
          <div className="flex items-center justify-between">
            <MonitorDot size={25} className={"text-red-500"} />
            <div
              className={`text-base font-medium ${(data?.errorTimeRate ?? 0) < 0
                ? "text-red-500"
                : (data?.errorTimeRate ?? 0) > 0
                  ? "text-green-500"
                  : "text-gray-400"
                }`}
            >
              <span
                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.errorTimeRate ?? 0) < 0
                  ? "bg-red-100 text-red-500"
                  : (data?.errorTimeRate ?? 0) > 0
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {(data?.errorTimeRate ?? 0) > 0
                  ? `+${data?.errorTimeRate}%`
                  : `${data?.errorTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-[30px] font-semibold text-red-700 leading-none mt-2">
            {convertHoursToHM(data?.totalErrorTime ?? 0)}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-red-500 flex items-center">
              {/* Tổng Điểm {typeDate[data.timeType]} */}
              Tổng Giờ Lỗi {typeDate[type]}
              {(data?.errorTimeRate ?? 0) !== undefined &&
                ((data?.errorTimeRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                ))}
            </p>
            <p className="text-sm text-gray-400">
              Trung bình:{" "}
              {data && data.totalMachines > 0
                ? formatHoursToHM(
                  (data?.totalErrorTime ?? 0) / data.totalMachines
                )
                : "0 giờ 0 phút"}{" "}
              / máy
            </p>
          </div>
        </div>
        <div className="inline-block rounded-xl bg-white px-6 py-3 shadow-md shadow-gray-200 border border-gray-500 w-full">
          <div className="flex items-center justify-between">
            <MonitorDot size={25} className={"text-gray-500"} />
            <div
              className={`text-base font-medium ${(data?.emptyTimeRate ?? 0) < 0
                ? "text-red-500"
                : (data?.emptyTimeRate ?? 0) > 0
                  ? "text-green-500"
                  : "text-gray-400"
                }`}
            >
              <span
                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.emptyTimeRate ?? 0) < 0
                  ? "bg-red-100 text-red-500"
                  : (data?.emptyTimeRate ?? 0) > 0
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {(data?.emptyTimeRate ?? 0) > 0
                  ? `+${data?.emptyTimeRate}%`
                  : `${data?.emptyTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-[30px] font-semibold text-gray-400 leading-none mt-2">
            {convertHoursToHM(data?.totalEmptyTime ?? 0)}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-gray-400 flex items-center">
              Tổng Giờ Trống  {typeDate[type]}
              {(data?.emptyTimeRate ?? 0) !== undefined && (
                (data?.emptyTimeRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                )
              )}
            </p>
            <p className="text-sm text-gray-400">
              Trung bình: {data && data.totalMachines > 0
                ? formatHoursToHM((data?.emptyTimeRate ?? 0) / data.totalMachines)
                : "0 giờ 0 phút"} / máy
            </p>
          </div>
        </div>
        <div className="inline-block rounded-xl bg-white px-6 py-3 shadow-md shadow-blue-200 border border-blue-500 w-full">
          <div className="flex items-center justify-between">
            <MonitorDot size={25} className={"text-blue-500"} />
            <div
              className={`text-base font-medium ${(data?.processRate ?? 0) < 0
                ? "text-red-500"
                : (data?.processRate ?? 0) > 0
                  ? "text-green-500"
                  : "text-gray-400"
                }`}
            >
              <span
                className={`flex justify-center items-center px-2 py-1 rounded-md ${(data?.processRate ?? 0) < 0
                  ? "bg-red-100 text-red-500"
                  : (data?.processRate ?? 0) > 0
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {(data?.processRate ?? 0) > 0
                  ? `+${data?.processRate}%`
                  : `${data?.processRate}%`}
              </span>
            </div>

          </div>

          <p className="text-[30px] font-semibold text-blue-700 leading-none mt-2">
            {data?.totalProcesses ?? 0}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-blue-500 flex items-center">
              {/* Tổng Số Nguyên Công {typeDate[data.timeType]} */}
              Tổng Số Gia Công {typeDate[type]}
              {(data?.processRate ?? 0) !== undefined &&
                ((data?.processRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                ))}
            </p>
            <p className="text-sm text-gray-400">
              Trung bình:{" "}
              {data && data.totalProcesses > 0
                ? Math.round((data?.totalProcesses ?? 0) / data.totalMachines)
                : "0"}{" "}
              gia công / máy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
