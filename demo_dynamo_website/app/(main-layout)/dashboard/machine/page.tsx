"use client"
import { DateRange } from "react-day-picker"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import MachineTable from "./components/machineTable";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { ReportTimeMachine } from "./components/ReportTimeMachine";
import { SumRealTimeMachine } from "./components/SumRealTimeMachine";
import { MachineProcessBarChart } from "./components/machineProcessBarChart";
import { MachineTopProcessChart } from "./components/machineTopProcessChart";
import { DivergingBarChart } from "../operation/components/DivergingBarChart";
import { useMachine } from "@/hooks/useMachine";
import { useGroups } from "@/hooks/useGroup";
import { useMachineStatistics } from "@/app/(main-layout)/dashboard/machine/hooks/useMachineStatistics";
import { useMachineOverview } from "./hooks/useMachineOverview";
import DateRangeSelector from "../components/DateRangeSelector";
import MachineRunBarChart from "./components/machineRunBarChart";
import { useMachineTotalRuntime } from "./hooks/useMachineTotalRunTime";
import { useGroupEfficiency } from "./hooks/useGroupEfficiency";
import { MachinePieChart } from "./components/machinePieChart";
import { useTopHighMachine, useTopLowMachine } from "./hooks/useTopMachine";
import { useExportExcel } from "@/hooks/useExportExcel";

export default function MachineOverview() {
    const router = useRouter();

    // State management similar to operation page
    const [selectedStartDate, setStartDate] = useState<string>()
    const [selectedEndDate, setSelectedEndDate] = useState<string>()
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    // Tạo queryParams để truyền vào hook useMachineStatistic
    const queryParams = useMemo(() => {
        if (!selectedGroup || !selectedStartDate || !selectedEndDate) {
            return null;
        }
        return {
            groupId: selectedGroup,
            startDate: selectedStartDate,
            endDate: selectedEndDate
        };
    }, [selectedGroup, selectedStartDate, selectedEndDate]);

    // Get machine statistics from API
    const { data: machineStatistics, loading: statisticsLoading, error: statisticsError } = useMachineStatistics(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );
    console.log(machineStatistics)
    // Lấy danh sách máy từ nhóm
    const machineList = machineStatistics?.machines;

    // Gọi API lấy dữ liệu thống kê máy Overview
    const { data: dataOverview } = useMachineOverview(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Gọi API lấy dữ liệu thống kê Total Run Time
    const { data: dataTotalRunTime } = useMachineTotalRuntime(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Gọi API lấy dữ liệu hiệu suất Group Efficiency
    const { data: dataGroupEfficiency } = useGroupEfficiency(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Gọi API lấy dữ liệu Top 5 cao nhất
    const { data: dataTopHighMachine } = useTopHighMachine(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );
    // Gọi API lấy dữ liệu Top 5 thấp nhất
    const { data: dataTopLowMachine } = useTopLowMachine(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Lấy danh sách nhóm
    const { data: groupList } = useGroups()

    // Lấy nhóm đầu tiên làm nhóm mặc định khi load trang
    useEffect(() => {
        if (groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId))
        }
    }, [groupList, selectedGroup])

    // Get selected group name
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    // Handler chuyển đến trang chi tiết
    const handleMachineSelection = (machineId: string) => {
        setSelectedMachine(machineId);
        const searchParams = new URLSearchParams();
        if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
        if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
        if (selectedGroup) searchParams.set('groupId', selectedGroup);
        searchParams.set('machineId', machineId);

        router.push(`/dashboard/machine/machineDetail?${searchParams.toString()}`);
    };
    const { exportExcel } = useExportExcel("/machine-group-statistic/export-excel", selectedGroup, selectedGroupName, selectedStartDate, selectedEndDate);

    return (
        <>
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div>
                    <div className="flex justify-between items-center mr-5">
                        <p className="text-3xl font-semibold">Thống kê máy móc</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-900 hover:bg-blue-650"

                            onClick={exportExcel}>
                            Xuất file
                            {/* <Download className="h-4 w-4" /> */}
                        </Button>
                    </div>
                    <div className="flex flex-row py-3 gap-15 justify-end">
                        <DateRangeSelector
                            onChange={({ startDate, endDate, timeType }) => {
                                setStartDate(startDate);
                                setSelectedEndDate(endDate);
                                setSelectedTimeType(timeType);
                            }}
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
                            <Select
                                value={selectedGroup ?? ""}
                                onValueChange={(val) => setSelectedGroup(val)}
                            >
                                <SelectTrigger className="w-[180px] text-lg cursor-pointer">
                                    <SelectValue placeholder="Nhóm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {groupList.map((m) => (
                                            <SelectItem
                                                key={m.groupId}
                                                value={String(m.groupId)}
                                                className={`text-lg text-blue-950 cursor-pointer ${String(selectedGroup) === String(m.groupId)
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
                            <label className="text-sm font-medium text-gray-600 tracking-wide">Máy móc</label>
                            <Select
                                value={selectedMachine}
                                onValueChange={handleMachineSelection}
                            >
                                <SelectTrigger className="w-fit text-lg px-4 rounded-md transition ">
                                    <SelectValue
                                        placeholder={`Tổng số: ${machineList?.length || 0} máy`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {machineList?.map((machine) => (
                                            <SelectItem
                                                className="text-xl text-blue-950"
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
                </div>

                {/* <ReportTimeMachine /> */}
                {machineStatistics && (
                    <ReportTimeMachine type={selectedTimeType} data={machineStatistics} />
                )}

                <div className="my-5 grid grid-cols-2 gap-3">
                    {dataTotalRunTime && (
                        <MachineRunBarChart title={`Tổng Giờ Chạy Trong Tháng ${selectedGroupName}`} description="Tổng thời gian hoạt động của nhóm này." dataRunTime={dataTotalRunTime} />
                    )}
                    {dataGroupEfficiency && (
                        <MachinePieChart dataRunTime={dataGroupEfficiency} />
                    )}
                </div>

                <SumRealTimeMachine title={`Tổng Thời Gian Thực PG Của Từng Máy Trong ${selectedGroupName} (Giờ)`} description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu" dataOverview={dataOverview} />

                {/* Show loading state */}
                {statisticsLoading && (
                    <div className="text-center py-4">
                        <p>Đang tải dữ liệu thống kê máy móc...</p>
                    </div>
                )}

                {/* Show error state */}
                {statisticsError && (
                    <div className="text-center py-4 text-red-500">
                        <p>{statisticsError}</p>
                    </div>
                )}

                <div className="flex gap-5 justify-between my-5">
                    <MachineProcessBarChart title="Tổng số gia công từng máy trong nhóm đã chạy xong" description="Thống kê số lượng gia công chi tiết đã được thực thi" dataOverview={dataOverview} />
                    <MachineTopProcessChart title="Top 5 máy chạy trong nhóm" description="Thống kê top 5 máy" dataTopHighMachine={dataTopHighMachine} dataTopLowMachine={dataTopLowMachine} />
                </div>

                <MachineTable title="Danh sách Thống kê Máy móc" description="Tất cả các máy" dataOverview={dataOverview} />
            </div >
        </>
    )

}