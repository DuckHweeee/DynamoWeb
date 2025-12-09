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
import { Download, UserRoundSearch } from "lucide-react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"
import { RunningTimePieChart } from "./components/RunningTimePieChart";
import { useGroups } from "@/hooks/useGroup";
import { MachineEfficiencyDetail } from "./lib/type";
import { useMachineEfficiencyDetail } from "./hooks/useMachineEfficiencyDetail";
import { useMachineStatisticDetail } from "./hooks/useMachineStatisticDetail";
import { useMachineHistoryDetail } from "./hooks/useMachineHistoryDetail";
import { toast } from "sonner";
import DateRangeSelectorDetail from "./hooks/DateRangeSelectorDetail";
import { ReportTimeMachineDetail } from "./components/ReportTimeMachineDetail";
import { MachinePieChart } from "./components/machinePieChart";
import MachineHistoryTable from "./components/MachineHistoryTable";
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const MachineDetailOverview = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const machineIdFromUrl = searchParams.get("machineId") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedMachine, setSelectedMachine] = useState<number>(Number(machineIdFromUrl));

    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedMachine(Number(machineIdFromUrl));
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, machineIdFromUrl]);

    // Get data
    const { data: groupList } = useGroups()

    const { data: dataStatistic } = useMachineStatisticDetail(
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );
    console.log("dataStatistic", dataStatistic)
    const { data: dataHistory } = useMachineHistoryDetail(
        groupIdFromUrl ?? "",
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );

    const [dataEfficiency, setDataEfficiency] = useState<MachineEfficiencyDetail | null>(null);

    const { data: dataEfficiencyDefault } = useMachineEfficiencyDetail(
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? ""
    );
    useEffect(() => {
        if (dataEfficiencyDefault) {
            setDataEfficiency(dataEfficiencyDefault);
        }
    }, [dataEfficiencyDefault]);


    const machineList = dataEfficiency?.machines;
    const selectedMachineName = machineList?.find((m) => m.machineId === selectedMachine)?.machineName;

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${url}/api/machine-detail/detail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId: selectedGroup,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy dữ liệu");
            }

            const result = await response.json();
            setDataEfficiency(result);
            const newUrl = `?groupId=${selectedGroup}&startDate=${selectedStartDate}&endDate=${selectedEndDate}&machineId=${result.machineId}`;
            router.replace(newUrl);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    return (
        <>
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div>
                    <div className="flex justify-between items-center mr-5 border-b pb-3 py-4 ">
                        <p className="text-3xl font-semibold">Thống kê chi tiết máy {selectedMachineName}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="items-center cursor-pointer !text-white border-gray-200 hover:border-gray-300 h-9 bg-blue-900 hover:bg-blue-650"
                        >
                            Xuất file
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-row py-3 gap-3 justify-end">
                        <DateRangeSelectorDetail
                            startDate={selectedStartDate}
                            endDate={selectedEndDate}
                            onChange={({ startDate, endDate, timeType }) => {
                                setSelectedStartDate(startDate);
                                setSelectedEndDate(endDate);
                                setSelectedTimeType(timeType);
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
                                value={selectedMachine.toString()}
                                onValueChange={(val) => setSelectedMachine(val ? Number(val) : 0)}
                            >
                                <SelectTrigger className="w-fit text-lg px-4 rounded-md transition ">
                                    <SelectValue
                                        placeholder={selectedMachineName}
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
                        <div className="flex flex-col pt-6">
                            <Button
                                onClick={handleSubmit}
                                variant="outline"
                                size="lg"
                                className="text-lg font-normal cursor-pointer text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 h-9"
                            >
                                <UserRoundSearch className="h-4 w-4 mr-1" />
                                Lọc nhóm mới
                            </Button>
                        </div>
                    </div>
                </div>
                {dataStatistic && (
                    <ReportTimeMachineDetail data={dataStatistic} type={selectedTimeType} />
                )}

                <div className="my-5 grid grid-cols-2 gap-3">
                    {dataStatistic && (
                        <RunningTimePieChart dataRunTime={dataStatistic} title={"Thống kê thời gian hoạt động máy"} description={"Phân tích thời gian trong tháng này"} />
                    )}
                    {dataEfficiency && (
                        <MachinePieChart dataDetail={dataEfficiency} />
                    )}
                </div>
                {dataHistory && (
                    <MachineHistoryTable title={"Lịch sử máy chạy"} dataHistory={dataHistory} />
                )}
            </div >
        </>
    );
}

export default MachineDetailOverview;