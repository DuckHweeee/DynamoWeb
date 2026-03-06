"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { File, MonitorDot, Pause, Play, ShieldQuestionMark, Square, TrendingDown, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MachineStatistic } from "../lib/type";
import { FiCheck, FiFacebook } from 'react-icons/fi';
import { RiComputerLine } from "react-icons/ri";
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

const MonitorDotGradient = ({ size = 25 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#monitorGradient)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="monitorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D0E5A5" />
        <stop offset="100%" stopColor="#86E3C3" />
      </linearGradient>
    </defs>

    {/* Monitor frame (open top-right like Lucide) */}
    <path d="M3 7V5a2 2 0 0 1 2-2h11" />
    <path d="M3 7v7a2 2 0 0 0 2 2h14" />
    <path d="M19 12v-2" />

    {/* Stand */}
    <path d="M12 14v4" />
    <path d="M8 18h8" />

    {/* Dot (outside screen, top-right) */}
    <circle cx="18" cy="7" r="3" />
  </svg>
);

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
        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  px-5 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#D0E5A5] to-[#86E3C3]">
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
                  ? `+${data?.runTimeRate}%`
                  : `${data?.runTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-green-400 leading-none mt-4">
            {convertHoursToHM(data?.totalRunTime ?? 0)}
          </p>

          <div className="mt-4">
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
            <p className="text-xs text-white">
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

        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
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
                  ? `+${data?.stopTimeRate}%`
                  : `${data?.stopTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-yellow-400 leading-none mt-4">
            {convertHoursToHM(data?.totalStopTime ?? 0)}
          </p>

          <div className="mt-4">
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
            <p className="text-xs text-white">
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

        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
          <div className="flex items-center justify-between">
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
                  ? `+${data?.errorTimeRate}%`
                  : `${data?.errorTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-rose-300 leading-none mt-4">
            {convertHoursToHM(data?.totalErrorTime ?? 0)}
          </p>

          <div className="mt-4">
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
            <p className="text-xs text-white">
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
        <div className="inline-block rounded-[20px] bg-white/10 backdrop-blur border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
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
                  ? `+${data?.emptyTimeRate}%`
                  : `${data?.emptyTimeRate}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-gray-100 leading-none mt-4">
            {convertHoursToHM(data?.totalEmptyTime ?? 0)}
          </p>

          <div className="mt-4">
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
            <p className="text-xs text-white">
              Trung bình: {data && data.totalMachines > 0
                ? formatHoursToHM((data?.emptyTimeRate ?? 0) / data.totalMachines)
                : "0 giờ 0 phút"} / máy
            </p>
          </div>
        </div>
        <div className="inline-block rounded-[20px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl  px-6 py-3 shadow-md w-full">
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
                  ? `+${data?.processRate}%`
                  : `${data?.processRate}%`}
              </span>
            </div>

          </div>

          <p className="text-2xl font-semibold text-sky-500 leading-none mt-4">
            {data?.totalProcesses ?? 0}
          </p>

          <div className="mt-4">
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
            <p className="text-xs text-white">
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
