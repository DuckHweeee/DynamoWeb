"use client";

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

import MachineLogTable from "../../components/machineLogTable";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import DateRangeSelector from "../../components/DateRangeSelector";
import { ReportTimeMachine } from "../components/ReportTimeMachine";
import { RunningTimePieChart } from "../../components/runningTimePieChart";
import { useMachine } from "@/hooks/useMachine";
import { useGroups } from "@/hooks/useGroup";
import { MachinePieChart } from "./components/machinePieChart";

const chartItems = [
    { label: "Tổn thất Offset", value: 90 },
    { label: "Tổn thất NG/khác", value: 36 },
    { label: "Hiệu suất khai thác máy", value: 78 },
    { label: "Hiệu suất giá trị", value: 64 },
    { label: "Hiệu suất PG", value: 58 },
    { label: "OEE", value: 34 },
]

const MachineDetailOverview = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [date, setDate] = useState<DateRange | undefined>();

    // State management similar to main machine page
    const [selectedStartDate, setStartDate] = useState<string>()
    const [selectedEndDate, setSelectedEndDate] = useState<string>()
    const [selectedGroup, setSelectedGroup] = useState<string>()
    const [selectedMachine, setSelectedMachine] = useState<string>("");

    // Get data
    const { data: groupList } = useGroups()
    const { data: machineList } = useMachine()

    // Get machine data from URL parameters
    const machineId = params.machineId as string;
    const machineName = searchParams.get('machineName') || `Máy số ${machineId}`;
    const groupId = searchParams.get('groupId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const mode = searchParams.get('mode');
    const week = searchParams.get('week');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Set initial state from URL parameters
    useEffect(() => {
        if (startDate) setStartDate(startDate);
        if (endDate) setSelectedEndDate(endDate);
        if (groupId) setSelectedGroup(groupId);
        if (machineId) setSelectedMachine(machineId);
    }, [startDate, endDate, groupId, machineId]);

    // Set default group when data loads
    useEffect(() => {
        if (groupList.length > 0 && !selectedGroup && !groupId) {
            setSelectedGroup(String(groupList[0].groupId))
        }
    }, [groupList, selectedGroup, groupId])

    // Get selected group name
    const selectedGroupName = groupList?.find((g) => String(g.groupId) === selectedGroup)?.groupName;

    // Handle machine selection change
    const handleMachineChange = (newMachineId: string) => {
        // Preserve existing URL parameters
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('machineId', newMachineId);

        // Find machine name from the list
        const machine = machineList?.find(m => String(m.machineId) === newMachineId);
        const newMachineName = machine?.machineName || `Máy số ${newMachineId}`;
        newSearchParams.set('machineName', newMachineName);

        // Navigate to new machine dashboard
        router.push(`/dashboard/machine/${newMachineId}?${newSearchParams.toString()}`);
    };

    // Handler for machine selection from dropdown
    const handleMachineSelection = (machineId: string) => {
        setSelectedMachine(machineId);
        const searchParams = new URLSearchParams();
        if (selectedStartDate) searchParams.set('startDate', selectedStartDate);
        if (selectedEndDate) searchParams.set('endDate', selectedEndDate);
        if (selectedGroup) searchParams.set('groupId', selectedGroup);
        searchParams.set('machineId', machineId);

        router.push(`/dashboard/machine/${machineId}?${searchParams.toString()}`);
    };

    useEffect(() => {
        console.log('Machine Dashboard loaded with params:', {
            machineId,
            machineName,
            groupId,
            startDate,
            endDate,
            mode,
            week,
            month,
            year
        });
    }, [machineId, machineName, groupId, startDate, endDate, mode, week, month, year]);

    return (
        <>
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div>
                    <div className="flex justify-between items-center mr-5">
                        <p className="text-3xl font-semibold">Thống kê chi tiết máy {machineName}</p>
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
                                        placeholder={machineName || `Máy số ${machineId}`}
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

                {/* <ReportTimeMachine data={undefined} type={""} /> */}

                {/* <div className="my-5 grid grid-cols-2 gap-3">
                    <RunningTimePieChart />
                    <div className="grid grid-cols-3 gap-3">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div> */}
                <MachineLogTable />
            </div >
        </>
    );
}

export default MachineDetailOverview;