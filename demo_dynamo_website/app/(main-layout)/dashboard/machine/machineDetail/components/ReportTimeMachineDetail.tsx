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
import { MachineStatisticDetail } from "../lib/type";
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
  data: MachineStatisticDetail;
  type: string;
}
export function ReportTimeMachineDetail({
  data,
  type,
}: ReportTimeOperatorProps) {
  const typeDate: { [key: string]: string } = {
    day: "Ngày",
    week: "Tuần",
    month: "Tháng",
    year: "Năm",
  };
  return (
    <>
      <div className="my-5 flex gap-3 items-center justify-between">
        <div className="inline-block rounded-lg bg-white px-5 py-4 shadow-md shadow-green-2 00 border border-green-300 w-full">
          <div className="flex items-start justify-between">
            <MonitorDot size={24} className={"text-green-500"} />
            <p
              className={`text-lg font-medium ${(data?.runTimeRate ?? 0) < 0
                  ? "text-red-500"
                  : (data?.runTimeRate ?? 0) > 0
                    ? "text-green-500"
                    : ""
                }`}
            >
              {(data?.runTimeRate ?? 0) > 0
                ? `+${data?.runTimeRate.toFixed(2) ?? 0}%`
                : `${data?.runTimeRate.toFixed(2) ?? 0}%`}
            </p>
          </div>

          <p className="text-[25px] font-semibold text-green-700 leading-none mt-2">
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
          </div>
        </div>

        <div className="inline-block rounded-lg bg-white px-6 py-4 shadow-md shadow-yellow-100 border border-yellow-500 w-full">
          <div className="flex items-start justify-between">
            <MonitorDot size={24} className={"text-yellow-500"} />
            <p
              className={`text-lg font-medium ${(data?.stopTimeRate ?? 0) < 0
                  ? "text-red-500"
                  : (data?.stopTimeRate ?? 0) > 0
                    ? "text-green-500"
                    : ""
                }`}
            >
              {(data?.stopTimeRate ?? 0) > 0
                ? `+${data?.stopTimeRate.toFixed(2) ?? 0}%`
                : `${data?.stopTimeRate.toFixed(2) ?? 0}%`}
            </p>
          </div>

          <p className="text-[25px] font-semibold text-yellow-700 leading-none mt-2">
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
          </div>
        </div>

        <div className="inline-block rounded-lg bg-white px-6 py-4 shadow-md shadow-red-200 border border-red-300 w-full">
          <div className="flex items-start justify-between">
            <MonitorDot size={24} className={"text-red-500"} />
            <p
              className={`text-lg font-medium ${(data?.errorTimeRate ?? 0) < 0
                  ? "text-red-500"
                  : (data?.errorTimeRate ?? 0) > 0
                    ? "text-green-500"
                    : ""
                }`}
            >
              {(data?.errorTimeRate ?? 0) > 0
                ? `+${data?.errorTimeRate.toFixed(2) ?? 0}%`
                : `${data?.errorTimeRate.toFixed(2) ?? 0}%`}
            </p>
          </div>

          <p className="text-[25px] font-semibold text-red-700 leading-none mt-2">
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
          </div>
        </div>

        {/*  */}
        <div className="inline-block rounded-lg bg-white px-6 py-4 shadow-md shadow-grey-200 border border-muted-foreground  w-full">
          <div className="flex items-start justify-between">
               <MonitorDot size={24} className={"text-muted-foreground"} />
            <p
              className={`text-lg font-medium ${(data?.emptyTimeRate  ?? 0) < 0
                ? "text-red-500"
                : (data?.emptyTimeRate  ?? 0) > 0
                  ? "text-green-500"
                  : ""
                }`}
            >
              {(data?.emptyTimeRate  ?? 0) > 0
                ? `+${data?.emptyTimeRate.toFixed(2)  ?? 0}%`
                : `${data?.emptyTimeRate.toFixed(2)  ?? 0}%`}
            </p>
          </div>

          <p className="text-[30px] font-semibold text-muted-foreground leading-none mt-2">
            {convertHoursToHM(data?.totalEmptyTime ?? 0)}
          </p>

          <div className="mt-2">
            <p className="text-lg font-medium text-muted-foreground flex items-center">
              Tổng Giờ Trống  {typeDate[type]}
              {(data?.emptyTimeRate ?? 0) !== undefined && (
                (data?.emptyTimeRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                )
              )}
            </p>
          </div>
        </div>
        <div className="inline-block rounded-lg bg-white px-6 py-4 shadow-md shadow-blue-200 border border-blue-300 w-full">
          <div className="flex items-start justify-between">
            <MonitorDot size={24} className={"text-blue-500"} />
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

          <p className="text-[25px] font-semibold text-blue-700 leading-none mt-2">
            {data?.numberOfProcesses ?? 0}
          </p>
          <div className="mt-2">
            <p className="text-lg font-medium text-blue-500 flex items-center">
              Tổng Số Gia Công {typeDate[type]}
              {(data?.processRate ?? 0) !== undefined &&
                ((data?.processRate ?? 0) >= 0 ? (
                  <TrendingUp size={14} className="ml-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="ml-1 text-red-500" />
                ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
