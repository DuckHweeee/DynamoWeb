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
import { RunningTimePieChart1 } from "./components/RunningTimePieChart";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const MachineDetailOverview = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTimeType, setSelectedTimeType] = useState<string>("day");

    const startDateFromUrl = searchParams.get("startDate") || "";
    const endDateFromUrl = searchParams.get("endDate") || "";
    const groupIdFromUrl = searchParams.get("groupId") || "";
    const machineIdFromUrl = searchParams.get("machineId") || "";
    const shiftCodeFromUrl = searchParams.get("shiftCode") || "";

    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDateFromUrl);
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDateFromUrl);
    const [selectedGroup, setSelectedGroup] = useState<string>(groupIdFromUrl);
    const [selectedMachine, setSelectedMachine] = useState<number>(Number(machineIdFromUrl));
    const [selectedShiftCode, setSelectedShiftCode] = useState<string>(shiftCodeFromUrl);
    useEffect(() => {
        setSelectedStartDate(startDateFromUrl);
        setSelectedEndDate(endDateFromUrl);
        setSelectedGroup(groupIdFromUrl);
        setSelectedMachine(Number(machineIdFromUrl));
        setSelectedShiftCode(shiftCodeFromUrl)
    }, [startDateFromUrl, endDateFromUrl, groupIdFromUrl, machineIdFromUrl, shiftCodeFromUrl]);

    // Get data
    const { data: groupList } = useGroups()

    const { data: dataStatistic } = useMachineStatisticDetail(
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? "",
        shiftCodeFromUrl ?? ""
    );
    console.log("dataStatistic", dataStatistic)
    const { data: dataHistory } = useMachineHistoryDetail(
        groupIdFromUrl ?? "",
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? "",
        shiftCodeFromUrl ?? ""
    );

    const [dataEfficiency, setDataEfficiency] = useState<MachineEfficiencyDetail | null>(null);

    const { data: dataEfficiencyDefault } = useMachineEfficiencyDetail(
        selectedMachine ?? 0,
        startDateFromUrl ?? "",
        endDateFromUrl ?? "",
        groupIdFromUrl ?? "",
        shiftCodeFromUrl ?? ""
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId: selectedGroup,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                    shiftCode: selectedShiftCode
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy dữ liệu");
            }

            const result = await response.json();

            const machines = result.machines ?? [];
            const stillExists = machines.some((m: any) => m.machineId === selectedMachine);

            const finalMachineId = stillExists ? selectedMachine : result.machineId;

            setDataEfficiency(result);

            const newUrl = `?groupId=${selectedGroup}&startDate=${selectedStartDate}&endDate=${selectedEndDate}&machineId=${finalMachineId}&shiftCode=${selectedShiftCode}`;
            router.replace(newUrl);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi.");
        }
    };

    return (
        <>
            <div className="m-2 px-4 py-5  bg-white/10 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow" >
                <div className="pb-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-700 
                bg-[length:100%_2px] bg-no-repeat bg-left-bottom">
                    <div className="flex py-3 gap-3 justify-between items-center">
                        <div className="flex gap-3">
                            <DateRangeSelectorDetail
                                startDate={selectedStartDate}
                                endDate={selectedEndDate}
                                shiftCode={selectedShiftCode as any}
                                onChange={({ startDate, endDate, timeType, shiftCode }) => {
                                    setSelectedStartDate(startDate);
                                    setSelectedEndDate(endDate);
                                    setSelectedTimeType(timeType);
                                    setSelectedShiftCode(shiftCode);
                                }}
                            />
                            <div className="space-y-1">
                                <Select value={selectedGroup ?? ""} onValueChange={(val) => setSelectedGroup(val)}>
                                    <SelectTrigger className="w-[175px] text-base cursor-pointer p-5 text-white  bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow">
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
                                <Select
                                    value={selectedMachine.toString()}
                                    onValueChange={(val) => setSelectedMachine(val ? Number(val) : 0)}
                                >
                                    <SelectTrigger className="w-[175px] text-base text-white cursor-pointer p-5  bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow transition ">
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
                            <div className="flex flex-col">
                                <Button
                                    onClick={handleSubmit}
                                    variant="outline"
                                    size="lg"
                                    className="w-[175px] text-base cursor-pointer p-5 text-white bg-white/20 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow font-normal"
                                >
                                    <UserRoundSearch className="h-4 w-4 mr-1" />
                                    Lọc nhóm mới
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="items-center cursor-pointer !text-white  h-11 
                                    hover:from-slate-400 hover:via-zinc-300 hover:to-red-700
                                    px-6 text-base transition-all  bg-white/40 backdrop-blur border border-white/20 shadow-xl rounded-[10px] shadow"
                            >
                                Xuất file
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                {dataStatistic && (
                    <ReportTimeMachineDetail data={dataStatistic} type={selectedTimeType} />
                )}

                <div className="my-6 grid grid-cols-6 gap-6">
                    <div className="col-span-2 grid grid-rows-2 gap-6">
                        {dataStatistic && (
                            <RunningTimePieChart1 dataRunTime={dataStatistic} title={"Thống kê thời gian hoạt động máy"} description={"Phân tích thời gian trong tháng này"} />
                        )}
                        {dataEfficiency && (
                            <MachinePieChart  dataRunTime={dataEfficiency} />
                        )}
                    </div>

                    <div className="col-span-4">
                        {dataHistory && (
                            <MachineHistoryTable title={"Lịch sử máy chạy"} dataHistory={dataHistory} />
                        )} </div>

                </div>
            </div >
        </>
    );
}

export default MachineDetailOverview;