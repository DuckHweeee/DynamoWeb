"use client"

import { MonitorDot, TrendingDown, TrendingUp } from "lucide-react"
import MachineRunBarChart from "./component/machineRunBarChart"
import MachineRunBarChart2 from "./component/machineRunBarChart2"
import { MachineRunPieChart } from "./component/machineRunPieChart"
import { MachinePieChart } from "./component/machinePieChart"
import { SumRealTime } from "./component/sumRealTime"
import { MachineProcessBarChart } from "./component/machineProcessBarChart"
import MachineTable from "./component/machineTable"
import { ReportTime } from "./component/reporTime"
import OperatorTable from "./component/operatorTable"
import DrawingCodeTable from "./component/drawingTable"

import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react"

const chartItems = [
    { label: "Máy Đang Chạy", value: 12, fill: "#0ea5e9" },     // blue
    { label: "Máy Dừng", value: 3, fill: "#facc15" },           // yellow
    { label: "Máy Lỗi", value: 1, fill: "#ef4444" },            // red
    { label: "Bảo Trì", value: 2, fill: "#8b5cf6" },            // purple
]

export default function Dashboard() {
    const [date, setDate] = useState<DateRange | undefined>();
    return (
        <div>
            <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow" >
                <div className="flex flex-wrap items-center justify-between mb-4">
                    {/* Vùng chọn ngày */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center gap-2 bg-[#004799] text-white px-4 py-3 rounded-md hover:bg-[#003b80] transition"
                                    )}
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">
                                        {date?.from ? format(date.from, "dd/MM/yyyy") : "Ngày bắt đầu"} -{" "}
                                        {date?.to ? format(date.to, "dd/MM/yyyy") : "Ngày kết thúc"}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="flex gap-4 p-4 !w-full" align="start">
                                <DatePicker
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Bộ lọc 1 */}
                        <Select>
                            <SelectTrigger className="w-[180px] bg-[#004799] px-4 !py-5.5 !text-white rounded-md hover:bg-[#003b80] transition [&>svg]:!text-white">
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
                <ReportTime title={"Thống kê máy móc"} description={"12 máy"} />
                <div className="my-5 grid grid-cols-2 gap-3">
                    {/* <MachineRunBarChart /> */}
                    <MachineRunBarChart2 title="Tổng Giờ Chạy Trong Tháng Nhóm 1" description="Tổng thời gian hoạt động của nhóm này." />
                    <div className="grid grid-cols-2 gap-3">
                        {chartItems.map((item, index) => (
                            <MachinePieChart key={index} data={item} />
                        ))}
                    </div>
                </div>

                {/* <div className="my-5 flex gap-3 justify-between">
                <div className="w-1/2 h-[300px]">
                    <MachineRunBarChart />
                </div>

                <div className="w-1/2 h-[300px] grid grid-cols-2 gap-4">
                    {chartItems.map((item, index) => (
                        <MachinePieChart key={index} data={item} />
                    ))}
                </div>
                </div> */}

                <SumRealTime title="Tổng Thời Gian Thực" description="PG Dự Kiến Của Từng Máy Trong Nhóm" />
                <div className="flex gap-5 justify-between my-5">
                    {/* <MachineRunBarChart /> */}
                    <MachineProcessBarChart title="Tổng số process từng máy trong nhóm đã chạy xong" description="Description" />
                    <MachineProcessBarChart title="Tổng số process từng máy trong nhóm đã chạy xong" description="Description" />
                </div>
                <MachineTable title="Danh sách Thống kê Máy móc" description="Tất cả các máy" />
            </div >

            {/* Thống kê vận hành */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê vận hành"} description={"12 người vận hành"} />

                <div className="grid grid-cols-2 gap-5 my-5">
                    {/* <MachineRunBarChart /> */}
                    <MachineProcessBarChart title="Tổng giờ làm việc của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="Tổng điểm của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="Tổng số nguyên công của từng người vận hành" description="Description" />
                    <MachineProcessBarChart title="KPI của từng người vận hành trong nhóm" description="Description" />
                </div>
                <OperatorTable title="Danh sách người vận hành" description="Tất cả các máy" />
            </div >

            {/* Thống kê bản vẽ */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê bản vẽ"} description={"12 bản vẽ"} />
                <SumRealTime title="Tổng Thời Gian Thực / Dự kiến" description="PG Dự Kiến Của Từng Máy Trong Nhóm" />
                <div className="mt-5">
                    <DrawingCodeTable title="Danh sách bản vẽ" description="Tất cả các máy" />
                </div>
            </div >

            {/* Thống kê Process */}
            <div className="m-2 my-5 px-4 py-5 bg-white rounded-[10px] shadow" >
                <ReportTime title={"Thống kê Process "} description={"12 nguyên công"} />
                <OperatorTable title="Danh sách thống kê nhân viên" description="Tất cả các máy" />
            </div >
        </div >
    )
}
