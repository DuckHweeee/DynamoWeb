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
import { MachinePieChart } from "../../components/machinePieChart";
import MachineLogTable from "../../components/machineLogTable";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import DateRangeSelector from "../../components/DateRangeSelector";
import { ReportTimeMachine } from "../components/ReportTimeMachine";
import { RunningTimePieChart } from "../../components/runningTimePieChart";

const chartItems = [
    { label: "Tổn thất Offset", value: 90 },
    { label: "Tổn thất NG/khác", value: 36 },
    { label: "Hiệu suất khai thác máy", value: 78 },
    { label: "Hiệu suất giá trị", value: 64 },
    { label: "Hiệu suất PG", value: 58 },
    { label: "OEE", value: 34 },
]

const MachineIdDashboard = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [date, setDate] = useState<DateRange | undefined>();
    
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

    // Handle machine selection change
    const handleMachineChange = (newMachineId: string) => {
        // Preserve existing URL parameters
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('machineId', newMachineId);
        newSearchParams.set('machineName', `Máy số ${newMachineId}`);
        
        // Navigate to new machine dashboard
        router.push(`/dashboard/machine/${newMachineId}?${newSearchParams.toString()}`);
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

        // Update page title based on machine name
        if (typeof document !== 'undefined') {
            document.title = `${machineName} - Thống kê máy móc`;
        }
    }, [machineId, machineName, groupId, startDate, endDate, mode, week, month, year]);

    return (
        <>
            <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
                <div className="flex flex-wrap items-center justify-end mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <DateRangeSelector />

                        {/* Bộ lọc máy */}
                        <Select value={machineId} onValueChange={handleMachineChange}>
                            <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder={groupId} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1" className="text-lg">Nhóm 1</SelectItem>
                                    <SelectItem value="2" className="text-lg">Nhóm 2</SelectItem>
                                    <SelectItem value="3" className="text-lg">Nhóm 3</SelectItem>
                                    <SelectItem value="4" className="text-lg">Nhóm 4</SelectItem>
                                    <SelectItem value="5" className="text-lg">Nhóm 5</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <ReportTimeMachine title={"Thống kê máy móc"} description={machineName} />

                <div className="my-5 grid grid-cols-2 gap-3">
                    <RunningTimePieChart />
                    <div className="grid grid-cols-3 gap-3">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div>
                <MachineLogTable />
            </div>
        </>
    );
}

export default MachineIdDashboard;