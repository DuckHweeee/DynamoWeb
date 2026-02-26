"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonitorDot, Pause, Play, Square, TrendingDown, TrendingUp, X , File} from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MachineStatisticDetail } from "../lib/type";

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
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow px-5 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <linearGradient id="green-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor="#D0E5A5" offset="0%" />
                <stop stopColor="#86E3C3" offset="100%" />
              </linearGradient>
            </svg>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#86E3C3] to-[#D0E5A5]">
              <Play size={19} style={{ fill: "white", stroke: "white" }} />
            </div>

            <div
              className={`text-sm font-medium ${(data?.runTimeRate ?? 0) < 0
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
                  ? `+${data?.runTimeRate.toFixed(2)}%`
                  : `${data?.runTimeRate.toFixed(2)}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-green-400 leading-none mt-5">
            {convertHoursToHM(data?.totalRunTime ?? 0)}
          </p>

          <div className="mt-1">
            <p className="text-base font-medium text-green-300 flex items-center">
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

        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow px-6 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">

            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#fff494] to-[#ffdd94]">
              <Square size={15} style={{ fill: "white", stroke: "white" }} />
            </div>

            <div
              className={`text-sm font-medium ${(data?.stopTimeRate ?? 0) < 0
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
                  ? `+${data?.stopTimeRate.toFixed(2)}%`
                  : `${data?.stopTimeRate.toFixed(2)}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-yellow-400 leading-none mt-5">
            {convertHoursToHM(data?.totalStopTime ?? 0)}
          </p>

          <div className="mt-1">
            <p className="text-base font-medium text-yellow-500 flex items-center">
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

        <div className="inline-block rounded-[20px]  bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow px-6 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <linearGradient id="green-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop stopColor="#D0E5A5" offset="0%" />
                <stop stopColor="#86E3C3" offset="100%" />
              </linearGradient>
            </svg>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#FDC094] to-[#fa897b]">
              <X size={19} style={{ fill: "white", stroke: "white" }} />
            </div>

            <div
              className={`text-sm font-medium ${(data?.errorTimeRate ?? 0) < 0
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
                  ? `+${data?.errorTimeRate.toFixed(2)}%`
                  : `${data?.errorTimeRate.toFixed(2)}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-rose-300 leading-none mt-5">
            {convertHoursToHM(data?.totalErrorTime ?? 0)}
          </p>

          <div className="mt-1">
            <p className="text-base font-medium text-rose-400 flex items-center">
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
        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow px-6 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#d1d1d1] to-[#e7e7e7]">
              <Pause size={19} style={{ fill: "white", stroke: "white" }} />
            </div>
            <div
              className={`text-sm font-medium ${(data?.emptyTimeRate ?? 0) < 0
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
                  ? `+${data?.emptyTimeRate.toFixed(2)}%`
                  : `${data?.emptyTimeRate.toFixed(2)}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-gray-100 leading-none mt-5">
            {convertHoursToHM(data?.totalEmptyTime ?? 0)}
          </p>

          <div className="mt-1">
            <p className="text-base font-medium text-gray-200 flex items-center">
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
        <div className="inline-block rounded-[20px]  bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow px-6 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#4adede] to-[#1ca7ec]">
              <File size={20} style={{ fill: "white", stroke: "white" }} />
            </div>
            <div
              className={`text-sm font-medium ${(data?.processRate ?? 0) < 0
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
                  ? `+${data?.processRate.toFixed(2)}%`
                  : `${data?.processRate.toFixed(2)}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-sky-500 leading-none mt-5">
            {data?.numberOfProcesses ?? 0}
          </p>

          <div className="mt-1">
            <p className="text-base font-medium text-sky-400 flex items-center">
              {/* Tổng Số Nguyên Công {typeDate[data.timeType]} */}
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
