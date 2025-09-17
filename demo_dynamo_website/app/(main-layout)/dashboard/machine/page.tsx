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
import MachineRunBarChart2 from "../components/machineRunBarChart2";
import { MachinePieChart } from "../components/machinePieChart";
import MachineTable from "../components/machineTable";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import DateRangeSelector from "../components/DateRangeSelector";
import { ReportTimeMachine } from "./components/ReportTimeMachine";
import { SumRealTimeMachine } from "./components/SumRealTimeMachine";
import { MachineProcessBarChart } from "../components/machineProcessBarChart";
import { MachineTopProcessChart } from "../components/machineTopProcessChart";
import { DivergingBarChart } from "../operation/components/DivergingBarChart";
import { useMachine } from "@/hooks/useMachine";
import { useGroups } from "@/hooks/useGroup";
import { useMachineStatistics } from "@/hooks/useMachineStatistics";

const chartItems = [
    { label: "Tổn thất Offset", value: 90 },
    { label: "Tổn thất NG/khác", value: 36 },
    { label: "Hiệu suất khai thác máy", value: 78 },
    { label: "Hiệu suất giá trị", value: 64 },
    { label: "Hiệu suất PG", value: 58 },
    { label: "OEE", value: 34 },
];

export default function MachineOverview() {
    const router = useRouter();
    const [date, setDate] = useState<DateRange | undefined>();

    // State management similar to operation page
    const [selectedStartDate, setStartDate] = useState<string>()
    const [selectedEndDate, setSelectedEndDate] = useState<string>()
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    // Create queryParams for API call
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

    // Get groups data
    const { data: groupList } = useGroups()
    const { data: machineList } = useMachine()

    // Get machine statistics from API
    const { data: machineStatistics, loading: statisticsLoading, error: statisticsError } = useMachineStatistics(
        queryParams?.groupId ?? "",
        queryParams?.startDate ?? "",
        queryParams?.endDate ?? ""
    );

    // Set default group when data loads
    useEffect(() => {
        if (groupList.length > 0 && !selectedGroup) {
            setSelectedGroup(String(groupList[0].groupId))
        }
    }, [groupList, selectedGroup])

    // Get selected group name
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    // Handler for machine selection
    const handleMachineSelection = (machineId: string) => {
        setSelectedMachine(machineId);
        const searchParams = new URLSearchParams();
        if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
        if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
        if (selectedGroup) searchParams.set('groupId', selectedGroup);
        searchParams.set('machineId', machineId);

        router.push(`/dashboard/machine/${machineId}?${searchParams.toString()}`);
    };

    // Data transformation function for API data
    function transformMachineApiData<T extends Record<string, any>>(
        machineData: T[],
        targetKey: keyof T,
        realKey: keyof T
    ) {
        return machineData.map((m) => ({
            name: m.machineName,
            target: m[targetKey] as number,
            real: m[realKey] as number,
        }));
    }

    // Chart configurations for machines using API data structure
    const apiChartConfigs = [
        {
            title: (groupName: string) => `Tổng giờ chạy trong ${groupName}`,
            description: "Thống kê tổng giờ chạy của máy trong nhóm",
            targetKey: "pgTimeExpected",
            realKey: "runTime",
        },
        {
            title: (groupName: string) => `Tổng giờ dừng trong ${groupName}`,
            description: "Thống kê tổng giờ dừng của máy trong nhóm",
            targetKey: "pgTimeExpected", // Using expected time as baseline
            realKey: "stopTime",
        },
        {
            title: (groupName: string) => `Tổng giờ PG trong ${groupName}`,
            description: "Thống kê tổng giờ PG của máy trong nhóm",
            targetKey: "pgTimeExpected",
            realKey: "pgTime",
        },
        {
            title: (groupName: string) => `Tổng giờ Offset trong ${groupName}`,
            description: "Thống kê tổng giờ Offset của máy trong nhóm",
            targetKey: "pgTimeExpected",
            realKey: "offsetTime",
        },
    ];
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
                        >
                            Xuất file
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-row py-3 gap-15 justify-end">
                        <DateRangeSelector
                            onChange={({ startDate, endDate }) => {
                                setStartDate(startDate);
                                setSelectedEndDate(endDate);
                            }}
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 tracking-wide">Nhóm</label>
                            <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                                <SelectTrigger className="w-[180px] text-lg ">
                                    <SelectValue placeholder="Nhóm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {groupList.map((m) => (
                                            <SelectItem className="text-lg text-blue-950" key={m.groupId} value={String(m.groupId)}>
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

                <ReportTimeMachine />

                <div className="my-5 grid grid-cols-2 gap-3">
                    <MachineRunBarChart2 title="Tổng Giờ Chạy Trong Tháng Nhóm 1" description="Tổng thời gian hoạt động của nhóm này." />
                    <div className="grid grid-cols-3 gap-3">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div>

                <SumRealTimeMachine title="Tổng Thời Gian Thực PG Của Từng Máy Trong Nhóm (Giờ)" description="Tổng giờ chạy thực so với tổng giờ chạy mục tiêu" />

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

                {/* Show charts when data is available */}
                {machineStatistics && machineStatistics.length > 0 && (
                    <>
                        {/* Main chart showing process count comparison */}
                        <DivergingBarChart
                            title={`Tổng số gia công trong ${selectedGroupName || 'nhóm'}`}
                            description="Thống kê tổng số gia công của từng máy trong nhóm"
                            data={transformMachineApiData(machineStatistics, "pgTimeExpected", "numberOfProcesses")}
                        />

                        {/* Dynamic charts using API data */}
                        <div className="grid grid-cols-2 gap-4 my-5">
                            {apiChartConfigs.map((cfg, idx) => (
                                <DivergingBarChart
                                    key={idx}
                                    title={cfg.title(selectedGroupName ?? "")}
                                    description={cfg.description}
                                    data={transformMachineApiData(machineStatistics, cfg.targetKey as any, cfg.realKey as any)}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="flex gap-5 justify-between my-5">
                    <MachineProcessBarChart title="Tổng số gia công từng máy trong nhóm đã chạy xong" description="Thống kê số lượng gia công chi tiết đã được thực thi" />
                    <MachineTopProcessChart title="Top 5 máy chạy nhiều nhất trong nhóm" description="Thống kê top 5 máy chạy nhiều nhất" />
                </div>

                <MachineTable title="Danh sách Thống kê Máy móc" description="Tất cả các máy" />
            </div >
        </>
    )

}