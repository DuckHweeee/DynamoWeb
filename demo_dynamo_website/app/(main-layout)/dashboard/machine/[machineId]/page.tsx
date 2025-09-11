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
import { useState } from "react";
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
    const [date, setDate] = useState<DateRange | undefined>();

    return (
        <>
            <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
                <div className="flex flex-wrap items-center justify-end mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <DateRangeSelector />

                        {/* Bộ lọc nhóm */}
                        <Select>
                            <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Máy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="machine1" className="text-lg">Máy 1</SelectItem>
                                    <SelectItem value="machine2" className="text-lg">Máy 2</SelectItem>
                                    <SelectItem value="machine3" className="text-lg">Máy 3</SelectItem>
                                    <SelectItem value="machine4" className="text-lg">Máy 4</SelectItem>
                                    <SelectItem value="machine5" className="text-lg">Máy 5</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <ReportTimeMachine title={"Thống kê máy móc"} description={"Máy số 1"} />

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