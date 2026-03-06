"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MachineTable from "./components/machineTable";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportTimeMachine } from "./components/ReportTimeMachine";
import { SumRealTimeMachine } from "./components/SumRealTimeMachine";
import { MachineProcessBarChart } from "./components/machineProcessBarChart";
import { MachineTopProcessChart } from "./components/machineTopProcessChart";
import { useGroups } from "@/hooks/useGroup";
import { useMachineStatistics } from "@/app/(main-layout)/dashboard/machine/hooks/useMachineStatistics";
import { useMachineOverview } from "./hooks/useMachineOverview";
import DateRangeSelector from "../components/DateRangeSelector";
import MachineRunBarChart from "./components/machineRunBarChart";
import { useMachineTotalRuntime } from "./hooks/useMachineTotalRunTime";
import { useGroupEfficiency } from "./hooks/useGroupEfficiency";
import { useTopHighMachine, useTopLowMachine } from "./hooks/useTopMachine";
import { useExportExcel } from "@/hooks/useExportExcel";
import { MachinePieChart } from "./components/machinePieChart copy";

export default function MachineOverview() {
  const router = useRouter();

  // State management similar to operation page
  const [selectedStartDate, setStartDate] = useState<string>();
  const [selectedEndDate, setSelectedEndDate] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState<string>("day");
  const [selectedShiftCode, setSelectedShiftCode] = useState<string>("FULL");

  // Tạo queryParams để truyền vào hook useMachineStatistic
  const queryParams = useMemo(() => {
    if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
      return null;
    }
    return {
      groupId: selectedGroup,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      shiftCode: selectedShiftCode
    };
  }, [selectedGroup, selectedStartDate, selectedEndDate, selectedShiftCode]);

  // Get machine statistics from API
  const {
    data: machineStatistics,
    loading: statisticsLoading,
    error: statisticsError,
  } = useMachineStatistics(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""

  );
  // Lấy danh sách máy từ nhóm
  const machineList = machineStatistics?.machines;

  // Gọi API lấy dữ liệu thống kê máy Overview
  const { data: dataOverview } = useMachineOverview(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  // Gọi API lấy dữ liệu thống kê Total Run Time
  const { data: dataTotalRunTime } = useMachineTotalRuntime(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  // Gọi API lấy dữ liệu hiệu suất Group Efficiency
  const { data: dataGroupEfficiency } = useGroupEfficiency(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  // Gọi API lấy dữ liệu Top 5 cao nhất
  const { data: dataTopHighMachine } = useTopHighMachine(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  console.log("Top high machines:", dataTopHighMachine);
  // Gọi API lấy dữ liệu Top 5 thấp nhất
  const { data: dataTopLowMachine } = useTopLowMachine(
    queryParams?.groupId ?? "",
    queryParams?.startDate ?? "",
    queryParams?.endDate ?? "",
    queryParams?.shiftCode ?? ""
  );

  // Lấy danh sách nhóm
  const { data: groupList } = useGroups();

  // Lấy nhóm đầu tiên làm nhóm mặc định khi load trang
  useEffect(() => {
    if (groupList.length > 0 && !selectedGroup) {
      setSelectedGroup(String(groupList[0].groupId));
    }
  }, [groupList, selectedGroup]);

  // Get selected group name
  const selectedGroupName = groupList?.find(
    (g) => String(g.groupId) === selectedGroup
  )?.groupName;

  // Handler chuyển đến trang chi tiết
  const handleMachineSelection = (machineId: string) => {
    setSelectedMachine(machineId);
    const searchParams = new URLSearchParams();
    if (selectedStartDate) searchParams.set("startDate", selectedStartDate);
    if (selectedEndDate) searchParams.set("endDate", selectedEndDate);
    if (selectedGroup) searchParams.set("groupId", selectedGroup);
    if (selectedShiftCode) searchParams.set("shiftCode", selectedShiftCode);
    searchParams.set("machineId", machineId);

    router.push(`/dashboard/machine/machineDetail?${searchParams.toString()}`);
  };
  const { exportExcel } = useExportExcel(
    "/machine-group-statistic/export-excel",
    selectedGroup,
    selectedGroupName,
    selectedStartDate,
    selectedEndDate
  );


  return (
    <>
      <div className="m-2 px-4 py-1 rounded-[20px] bg-white/10 backdrop-blur border border-white/20 shadow-xl  ">
        <div className="pb-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-700 
                bg-[length:100%_2px] bg-no-repeat bg-left-bottom">
          <div className="flex py-3 gap-3 justify-between items-center">
            <div className="flex gap-3">
              <DateRangeSelector
                onChange={({ startDate, endDate, timeType, shiftCode }) => {
                  setStartDate(startDate);
                  setSelectedEndDate(endDate);
                  setSelectedTimeType(timeType);
                  setSelectedShiftCode(shiftCode);
                }}
              />
              <div className="space-y-1">
                <Select
                  value={selectedGroup ?? ""}
                  onValueChange={(val) => setSelectedGroup(val)}
                >
                  <SelectTrigger className="w-[175px] text-base cursor-pointer p-5  bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow text-white">
                    <SelectValue placeholder="Nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {groupList.map((m) => (
                        <SelectItem
                          key={m.groupId}
                          value={String(m.groupId)}
                          className={`text-base text-blue-950 cursor-pointer p-3 ${String(selectedGroup) === String(m.groupId)
                            ? "bg-gray-200"
                            : ""
                            }`}
                        >
                          {m.groupName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select
                  value={selectedMachine}
                  onValueChange={handleMachineSelection}
                >
                  <SelectTrigger className="w-auto text-base cursor-pointer p-5 bg-white/20 backdrop-blur border border-white/20 shadow-xl shadow transition text-white [&_span]:!text-white">

                    <SelectValue
                      placeholder={`Tổng số: ${machineList?.length || 0} máy`}
                      className="!text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {machineList?.map((machine) => (
                        <SelectItem
                          className="text-base text-blue-950"
                          key={machine.machineId}
                          value={String(machine.machineId)}
                        >
                          {machine.machineName}
                        </SelectItem>
                      )) || []}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="lg"
                className="items-center cursor-pointer !text-white hover:!text-black bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow"
                onClick={() => {
                  exportExcel()
                }}
              >
                Xuất file
              </Button>
            </div>
          </div>
        </div>

        {machineStatistics && (
          <ReportTimeMachine type={selectedTimeType} data={machineStatistics} />
        )}
        <div className="my-6 grid grid-cols-3 gap-6">

          <MachineTopProcessChart
            title="Top 5 máy chạy trong nhóm (Giờ)"
            description="Thống kê top 5 máy"
            dataTopHighMachine={dataTopHighMachine}
            dataTopLowMachine={dataTopLowMachine}
          />
          {
            dataTotalRunTime && (
              <MachineRunBarChart
                title={`Tổng giờ hoạt động trong ${selectedTimeType} của nhóm  ${selectedGroupName}`}
                description="Tổng thời gian hoạt động của nhóm này."
                dataRunTime={dataTotalRunTime}
              />
            )}
          <MachineProcessBarChart
            title={`Tổng số gia công từng máy trong nhóm ${selectedGroupName} đã chạy xong`}
            description="Thống kê số lượng gia công chi tiết đã được thực thi"
            dataOverview={dataOverview}
          />
        </div>


        <div className="my-6 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <SumRealTimeMachine
              title={`Tổng thời gian thực của từng máy trong ${selectedGroupName} (Giờ)`}
              description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu"
              dataOverview={dataOverview}
            />
          </div>
          <div className="col-span-1"> {dataGroupEfficiency && (
            <MachinePieChart dataRunTime={dataGroupEfficiency} />
          )}
          </div>
        </div>

        {/* <div className="col-span-1">
            <MachineTimeProgress
              dataOverview={dataOverview}
              title=""
              description=""

            />
          </div> */}

        <MachineTable
          title="Danh sách thống kê máy móc"
          description="Tất cả các máy"
          dataOverview={dataOverview}
        />



      </div>
    </>
  );
}
