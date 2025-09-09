"use client"
import { MachineProcessBarChart } from "../components/machineProcessBarChart";
import OperatorTable from "../components/operatorTable";
import { ReportTime } from "../components/reporTime";

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DivergingBarChart } from "./components/DivergingBarChart";
import DateRangeSelector from "../components/DateRangeSelector";
const myData = [
    { name: "Phuc", target: 450, real: 600 },
    { name: "An", target: 520, real: 320 },
    { name: "Bình", target: 600, real: 750 },
    { name: "An", target: 520, real: 920 },
    { name: "Bình", target: 300, real: 550 },
]
const myData2 = [
    { name: "Lợi", target: 400, real: 380 },
    { name: "Đức", target: 700, real: 720 },
    { name: "Trang", target: 500, real: 450 },
    { name: "Huy", target: 650, real: 800 },
    { name: "Lan", target: 550, real: 500 },
]
const myData3 = [
    { name: "Lợi", target: 400, real: 380 },   // real < target
    { name: "Đức", target: 700, real: 720 },   // real > target
    { name: "Trang", target: 500, real: 450 }, // real < target
    { name: "Huy", target: 650, real: 800 },   // real > target
    { name: "Lan", target: 550, real: 500 },
]
export default function OperationChart() {
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <>
            {/* Thống kê vận hành */}
            <div className="m-2 px-4 py-5 bg-white rounded-[10px] shadow" >
                <div className="flex flex-wrap items-center justify-end mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <DateRangeSelector />

                        {/* Bộ lọc nhóm */}
                        <Select>
                            <SelectTrigger className="w-[180px] text-xl bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
                                <SelectValue placeholder="Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Fruits</SelectLabel> */}
                                    <SelectItem value="apple">Nhóm 1</SelectItem>
                                    <SelectItem value="banana">Nhóm 2</SelectItem>
                                    <SelectItem value="blueberry">Nhóm 3</SelectItem>
                                    <SelectItem value="grapes">Nhóm 4</SelectItem>
                                    <SelectItem value="pineapple">Nhóm 5</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ReportTime title={"Thống kê vận hành"} description={"12 người vận hành"} />

                <div className="grid grid-cols-2 gap-5 my-5">
                    {/* <MachineRunBarChart /> */}
                    <DivergingBarChart title="Tổng điểm gia công trong nhóm 1" description="Thống kê tổng điểm của từng nhân viên trong nhóm" data={myData} />
                    <DivergingBarChart title="Tổng giờ PG trong nhóm 1" description="Thống kê tổng giờ PG của nhân viên trong nhóm" data={myData2} />
                    <DivergingBarChart title="Tổng giờ máy trong nhóm 1" description="Tổng giờ máy của từng nhân viên trong nhóm" data={myData3} />
                    <DivergingBarChart title="Nhân viên làm việc trong nhóm 1" description="Nhân viên làm việc" data={myData} />
                    <DivergingBarChart title="OLE trong nhóm 1" description="OLE của từng nhân viên trong nhóm" data={myData} />
                    <DivergingBarChart title="KPI trong nhóm 1" description="KPI của từng nhân viên trong nhóm " data={myData} />
                </div>
                <OperatorTable title="Danh sách người vận hành" description="Tất cả các máy" />
            </div >
        </>
    )
}